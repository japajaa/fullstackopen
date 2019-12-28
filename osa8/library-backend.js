const { ApolloServer, UserInputError, AuthenticationError, gql, PubSub } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const uuid = require('uuid/v1')
const jwt = require('jsonwebtoken')
const pubsub = new PubSub()
require('dotenv').config()

const JWT_SECRET = process.env.SECRET

mongoose.set('useFindAndModify', false)

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Query {
    hello: String!
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }


  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Subscription {
    bookAdded: Book!
  }    
`

const resolvers = {
  Query: {
    hello: () => { return "world" },
    //bookCount: () => books.length,
    bookCount: () => Book.collection.countDocuments(),
    //authorCount: () => authors.length,
    authorCount: () => Author.collection.countDocuments(),
    /*
    allBooks: (root, args) => {
     let filteredBooks = books
     if (args.author) {
      filteredBooks = filteredBooks.filter(book => book.author === args.author)
     }
     if (args.genre) {
      filteredBooks = filteredBooks.filter(book => book.genres.includes(args.genre))
     }
     return filteredBooks
    },
    */
    allBooks: async (root, args) => {
      // filters missing

      let filteredBooks = await Book.find({}).populate('author')

      if (args.genre) {
      let filterResult = await Book.find({ genres: { $in: args.genre } }).populate('author')
      console.log(filterResult)
      return filterResult
      }

      /*
      //need to come back to this
      if (args.author) {
        let filterResult = await Book.find({ author: { $in: args.genre } }).populate('author')
        console.log(filterResult)
        return filterResult
        }
*/
      return filteredBooks
      //return await Book.find({}).populate('author')

    },
    //allAuthors: () => authors
    allAuthors: async (root, args) => {
      // filters missing
      return await Author.find({})
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {

   addBook: async (root, args, context) => {

    const currentUser = context.currentUser

    if (!currentUser) {
      throw new AuthenticationError("not authenticated")
    }

    console.log('hello, here are args: ', args)
    let author = await Author.findOne({ name: args.author })

    if (author !== null) {
    } else {
     const newAuthor = new Author({name: args.author})
       try {
        console.log('trying to save author:',author)
        author = await newAuthor.save()
        } catch (error) {
          console.log('cathing some errors in author', author)
          throw new UserInputError(error.message, {
            invalidArgs: args,
           })
  }
    }
    console.log(author)
    
    const book = new Book({ 
      ...args, 
      author: author
    })
      console.log('trying to save a book:', book)

      try {
        console.log('in try, before save')
    await book.save()
    console.log('in try, after save')
  } catch (error) {
    console.log('in error')
    throw new UserInputError(error.message, {
      invalidArgs: args,
     })
}

pubsub.publish('BOOK_ADDED', { bookAdded: book })

    return book
  },


    editAuthor: async (root, args, context) => {

      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      let originalAuthor = await Author.findOne({ name: args.name })
      console.log(originalAuthor)
      if (originalAuthor) {
        originalAuthor.born = args.setBornTo
        console.log(originalAuthor)
        try {
          await originalAuthor.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
           })
      }
      return originalAuthor
      }
      return null
    },

    createUser: (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
  
      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'kikkeli' ) {
        throw new UserInputError("wrong credentials")
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
  },
  Author: {
    bookCount: (root) => {
      console.log(root._id)
      return Book.find({author: root._id}).countDocuments()}
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id).populate('friends')
      return { currentUser }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})
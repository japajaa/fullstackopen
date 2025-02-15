const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
`mongodb+srv://fullstack:${password}@fullstackcourse-vxxtl.mongodb.net/phone-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: {type: String, required: true, minlength: 3, unique: true, uniqueCaseInsensitive: true },
  number: {type: String, required: true, minlength: 8}
})
personSchema.plugin(uniqueValidator);

/*
const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })
*/  
  const Person = mongoose.model('Person', personSchema)

if (process.argv[4]) {
      const person = new Person({
        name: name,
        number: number
      })
      
      person.save().then(response => {
        console.log(`added ${person.name} number ${person.number} to phonebook`);
        mongoose.connection.close();
      })

} else {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
}
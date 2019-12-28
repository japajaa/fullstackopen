const dummy = (blogs) => {
    // ...
    return 1
  }
  
const totalLikes = (blogs) => {
  const likeArray = blogs.map(blog => blog.likes)
  //const total = likeArray.reduce((x, y) => x + y)

  return likeArray.length === 0
  ? 0 
  : likeArray.reduce((x, y) => x + y)
}

const favoriteBlog = (blogs) => {

    let maxLikes = 0
    let favorite = {}

    blogs.forEach((blog) => {
        if (blog.likes >= maxLikes) {
            maxLikes = blog.likes
            favorite = blog
        }
    })
    return favorite
}


const mostBlogs = (blogs) => {
    const _ = require('lodash');

   let grouped = _.countBy(blogs, 'author')
console.log(grouped)


const blogger ={
author: "Japa",
blogs: "7"
}

let result = 0
return result
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
  }
const dummy = (blogs) => {
    // ...
    return 1
  }
  
const totalLikes = (blogs) => {
  const likeArray = blogs.map(blog => blog.likes)

const result = likeArray.length === 0
? 0 
: likeArray.reduce((x, y) => x + y) 

return result

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

var maxKey = _.max(Object.keys(grouped), o => grouped[o]);


const blogger ={
author: "Japa",
blogs: "7"
}

return maxKey
}


const mostLikes = (blogs) => {
  const _ = require('lodash');

 let grouped = _.groupBy(blogs, 'author')

const niceList = [];

for (let [key, value] of Object.entries(grouped)) {

niceList.push({author: key, likes: _.sumBy(value, 'likes')})
}

return _.maxBy(niceList, 'likes')
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }
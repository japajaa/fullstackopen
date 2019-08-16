const blogs = [
    {
      title:"some verry good blog",
      author:"mahatma",
      url:"http://google.fi",
      likes:4,
      user:
        {
          username:"japajaa2",
          name:"Japa Repolainen",
          id:"5d53a552c62b583b1c381c88"
        },
      id:"5d554adca861b1237872ef17"
    },
    {
      title:"my new blog",
      author:"minä ite",
      url:"http://iltalehti.fi",
      likes:5,
      user:
        {
          username:"japajaa2",
          name:"Japa Repolainen",
          id:"5d53a552c62b583b1c381c88"
        },
      id:"5d554cb7a861b1237872ef18"
    },
    {
      title:"japa3",
      author:"japa3",
      url:"http://japa3.com",
      likes:6,
      user:
        {
          username:"japajaa3",
          name:"Japa Repolainen",
          id:"5d53ada6c62b583b1c381c89"
        },
      id:"5d554d53a861b1237872ef19"
    }
]
  
  const getAll = () => {
    return Promise.resolve(blogs)
  }
  
  export default { getAll }
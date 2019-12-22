const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {

    const blogs = [
        {
            title: "Mökkiläiset",
            author: "Japa",
            url: "http://mokkilaiset.blogspot.com",
            likes: 666,
            id: "5d515a32fcdaf931c0e7f467"
            },
            {
            title: "Mökkiläiset",
            author: "Japa",
            url: "http://mokkilaiset.blogspot.com",
            likes: 666,
            id: "5d515aa9701af477ec764f1e"
            },
            {
            title: "Moekkiläiset",
            author: "Japa",
            url: "http://mokkilaiset.blogspot.com",
            likes: 666,
            id: "5d51640897e8e57ae49dbc41"
            }
    ]

    const oneblog = [
        {
            title: "Mökkiläiset",
            author: "Japa",
            url: "http://mokkilaiset.blogspot.com",
            likes: 666,
            id: "5d515a32fcdaf931c0e7f467"
            }
    ]


    test('of empty list is zero', () => {
      expect(listHelper.totalLikes([])).toBe(0)
    })
  
    test('when list has only one blog equals the likes of that', () => {
      expect(listHelper.totalLikes(oneblog)).toBe(666)
    })
  
    test('of a bigger list is calculated right', () => {
      expect(listHelper.totalLikes(blogs)).toBe(1998)
    })


  })


  describe('favorite blog', () => {

    const blogs = [
        {
            title: "Mökkiläiset66",
            author: "Japa",
            url: "http://mokkilaiset.blogspot.com",
            likes: 66,
            id: "5d515a32fcdaf931c0e7f467"
            },
            {
            title: "Mökkiläiset666",
            author: "Japa",
            url: "http://mokkilaiset.blogspot.com",
            likes: 666,
            id: "5d515aa9701af477ec764f1e"
            },
            {
            title: "Moekkiläiset6",
            author: "FeikkiJapa",
            url: "http://mokkilaiset.blogspot.com",
            likes: 6,
            id: "5d51640897e8e57ae49dbc41"
            }
    ]

    const favorite ={
        title: "Mökkiläiset666",
    author: "Japa",
    url: "http://mokkilaiset.blogspot.com",
    likes: 666,
    id: "5d515aa9701af477ec764f1e"
    }


    test('of empty list is empty object', () => {
      expect(listHelper.favoriteBlog([])).toEqual({})
    })
  
    test('of list with only one object', () => {
      expect(listHelper.favoriteBlog([favorite])).toEqual(favorite)
    })
  
    test('of a bigger list is chosen right', () => {
      expect(listHelper.favoriteBlog(blogs)).toEqual(favorite)
    })


  })


  describe('most blogs', () => {

    const blogs = [
        {
            title: "Mökkiläiset66",
            author: "Japa",
            url: "http://mokkilaiset.blogspot.com",
            likes: 66,
            id: "5d515a32fcdaf931c0e7f467"
            },
            {
            title: "Mökkiläiset666",
            author: "Japa",
            url: "http://mokkilaiset.blogspot.com",
            likes: 666,
            id: "5d515aa9701af477ec764f1e"
            },
            {
            title: "Moekkiläiset6",
            author: "FeikkiJapa",
            url: "http://mokkilaiset.blogspot.com",
            likes: 6,
            id: "5d51640897e8e57ae49dbc41"
            },
            {
              title: "Mökkiläiset66",
              author: "Japa",
              url: "http://mokkilaiset.blogspot.com",
              likes: 66,
              id: "5d515a32fcdaf931c0e7f467"
              },
              {
              title: "Mökkiläiset666",
              author: "Japa",
              url: "http://mokkilaiset.blogspot.com",
              likes: 666,
              id: "5d515aa9701af477ec764f1e"
              },
              {
              title: "Moekkiläiset6",
              author: "FeikkiJapa",
              url: "http://mokkilaiset.blogspot.com",
              likes: 6,
              id: "5d51640897e8e57ae49dbc41"
              }
    ]

    const oneBlog = [
      {
          title: "Mökkiläiset66",
          author: "Tartsa",
          url: "http://mokkilaiset.blogspot.com",
          likes: 66,
          id: "5d515a32fcdaf931c0e7f467"
          }]

/*
    test('of empty list is empty object', () => {
      expect(listHelper.favoriteBlog([])).toEqual({})
    })
  
    test('of list with only one object', () => {
      expect(listHelper.favoriteBlog([favorite])).toEqual(favorite)
    })
 
    */
    test('most blogs', () => {
      expect(listHelper.mostBlogs(blogs)).toEqual('Japa')
    })


    test('only one blog', () => {
      expect(listHelper.mostBlogs(oneBlog)).toEqual('Tartsa')
    })

    test('empty list', () => {
      expect(listHelper.mostBlogs([])).toEqual(undefined)
    })
  })




  describe('most likes', () => {

    const blogs = [
        {
            title: "Mökkiläiset66",
            author: "Japa",
            url: "http://mokkilaiset.blogspot.com",
            likes: 66,
            id: "5d515a32fcdaf931c0e7f467"
            },
            {
            title: "Mökkiläiset666",
            author: "Japa",
            url: "http://mokkilaiset.blogspot.com",
            likes: 666,
            id: "5d515aa9701af477ec764f1e"
            },
            {
            title: "Moekkiläiset6",
            author: "FeikkiJapa",
            url: "http://mokkilaiset.blogspot.com",
            likes: 6,
            id: "5d51640897e8e57ae49dbc41"
            },
            {
              title: "Mökkiläiset66",
              author: "Japa",
              url: "http://mokkilaiset.blogspot.com",
              likes: 66,
              id: "5d515a32fcdaf931c0e7f467"
              },
              {
              title: "Mökkiläiset666",
              author: "Japa",
              url: "http://mokkilaiset.blogspot.com",
              likes: 666,
              id: "5d515aa9701af477ec764f1e"
              },
              {
              title: "Moekkiläiset6",
              author: "FeikkiJapa",
              url: "http://mokkilaiset.blogspot.com",
              likes: 6,
              id: "5d51640897e8e57ae49dbc41"
              }
    ]

    const oneBlog = [
      {
          title: "Mökkiläiset66",
          author: "Tartsa",
          url: "http://mokkilaiset.blogspot.com",
          likes: 66,
          id: "5d515a32fcdaf931c0e7f467"
          }]

    test('most likes', () => {
      expect(listHelper.mostLikes(blogs)).toEqual({"author": "Japa", "likes": 1464})
    })

    test('only one blog', () => {
      expect(listHelper.mostLikes(oneBlog)).toEqual({"author": "Tartsa", "likes": 66})
    })

    test('empty list', () => {
      expect(listHelper.mostLikes([])).toEqual(undefined)
    })

  })
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Japamies',
      username: 'japajaa2',
      password: 'kickelman'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
  })
  it('front page can be opened, not signed in', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Log in to application')
  })


  it('login can be done', function() {
    cy.visit('http://localhost:3000')
    cy.get('input:first')
      .type('japajaa2')
    cy.get('input:last')
      .type('kickelman')
    cy.contains('login')
      .click()
  })

  it('logout can be done', function() {
    cy.window()
      .then((window) => {
        const loggedUser = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))
        expect(loggedUser.username).to.equal('japajaa2')
      })
    cy.contains('Logout')
      .click()
    cy.wait(1000)
    cy.contains('Log in to application')

    cy.window()
      .then((window) => {
        const afterUser = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))
        expect(afterUser).to.equal(null)
      })
  })

  it('blog can be added', function() {
    cy.visit('http://localhost:3000')
    cy.get('input:first')
      .type('japajaa2')
    cy.get('input:last')
      .type('kickelman')
    cy.contains('login')
      .click()
    cy.contains('new blog')
      .click()
    cy.get('input:first')
      .type('nice blog title')
    cy.get('input').eq(1)
      .type('cool jabberwock')
    cy.get('input:last')
      .type('http://lollers.fi')
    cy.contains('create')
      .click()
    cy.contains('a new blog nice blog title by cool jabberwock added')
    cy.contains('Logout')
      .click()
  })


  it('blogs are listed in single user page', function() {
    cy.visit('http://localhost:3000')
    cy.get('input:first')
      .type('japajaa2')
    cy.get('input:last')
      .type('kickelman')
    cy.contains('login')
      .click()
    cy.contains('new blog')
      .click()
    cy.get('input:first')
      .type('nice blog title')
    cy.get('input').eq(1)
      .type('cool jabberwock')
    cy.get('input:last')
      .type('http://lollers.fi')
    cy.contains('create')
      .click()
    cy.contains('a new blog nice blog title by cool jabberwock added')
    cy.contains('users')
      .click()
    cy.get('td>a').eq(0)
      .click()
    cy.contains('nice blog title')
    cy.contains('Logout')
      .click()
  })

  it('comments can be added', function() {
    cy.visit('http://localhost:3000')
    cy.get('input:first')
      .type('japajaa2')
    cy.get('input:last')
      .type('kickelman')
    cy.contains('login')
      .click()
    cy.contains('new blog')
      .click()
    cy.get('input:first')
      .type('nice blog title')
    cy.get('input').eq(1)
      .type('cool jabberwock')
    cy.get('input:last')
      .type('http://lollers.fi')
    cy.contains('create')
      .click()
    cy.contains('a new blog nice blog title by cool jabberwock added')
    cy.get('li>a').eq(0)
      .click()
    cy.contains('nice blog title')
    cy.contains('no comments yet')
    cy.get('input:first')
      .type('best blog ever!!!1')
    cy.contains('add comment')
      .click()
    cy.contains('best blog ever!!!1')
  })



})
const notes = require('./controllers/notes')
const users = require('./controllers/users')

module.exports = app => {
  app.post('/api/auth', users.auth)
  // app.post('/api/auth/check')

  app.post('/api/note', users.checkJwt, notes.create)
  // app.get('/api/note/:id')
  // app.get('/api/note/:date')
  app.get('/api/notes', users.checkJwt, notes.all)
  app.post('/api/note/update/', users.checkJwt, notes.update)
  app.post('/api/note/delete', users.checkJwt, notes.delete)

  app.get('*', (req, res) => res.sendFile(__dirname + '/public/index.html'))
}

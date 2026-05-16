const jsonServer = require('json-server')
const crypto = require('crypto')

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

server.use((req, _res, next) => {
  if (req.method === 'POST') {
    req.body.id = crypto.randomUUID()
  }
  next()
})

server.use(router)

const PORT = process.env.PORT || 10000

server.listen(PORT, '0.0.0.0', () => {
  console.log(`JSON Server running on port ${PORT}`)
})
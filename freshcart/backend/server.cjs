const jsonServer = require('json-server')
const crypto = require('crypto')

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

// Assign a UUID string ID to every POST so IDs are always strings,
// matching the TypeScript models (id: string).
server.use((req, _res, next) => {
  if (req.method === 'POST') {
    req.body.id = crypto.randomUUID()
  }
  next()
})

server.use(router)
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`JSON Server running at http://localhost:${PORT}`)
})

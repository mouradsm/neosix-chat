import express from 'express'
import http from 'http'
import Router from 'express'
import routes from './routes'
import dotenv from 'dotenv'
import { Server } from 'socket.io'

const app = express()
const router = Router()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: "http://localhost:3000" } })

app.use(express.json())

router.use('/api', routes)

dotenv.config()

app.use(router)

io.on('connection', (socket) => {
  socket.on('join-room', (room: string) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('message', (msg) => {
    io.to(msg.room).emit('message', msg);
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(process.env.APP_PORT, () => {
  console.log('Server is running on http://localhost:' + process.env.APP_PORT)
})
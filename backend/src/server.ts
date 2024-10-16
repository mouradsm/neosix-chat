import express from 'express'
import http from 'http'
import Router from 'express'
import routes from './routes'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
const router = Router()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: "http://localhost:3000" } })

const corsOptions = {
  origin: '*'
}

app.use(cors(corsOptions))
app.use(express.json())

router.use('/api', routes)

dotenv.config()

app.use(router)

io.on('connection', (socket) => {
  socket.on('join-room', (room: string) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('message', (body) => {
    console.log(body)
    io.to(body.room).emit('message', body.message);
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(process.env.APP_PORT, () => {
  console.log('Server is running on http://localhost:' + process.env.APP_PORT)
})
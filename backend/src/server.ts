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

const connectedUsers = new Map<string, string>()

io.on('connection', (socket) => {
  console.log('User connected:', socket.id );

  connectedUsers.set(socket.id, `User-${socket.id}`)

  socket.on('join-room', (room: string) => {
    socket.join(room);
    
  });

  socket.on('message', (body) => {
    console.log(body)
    io.to(body.room).emit('message', body.message);
  });

  socket.on('private-message', ({to, message}) => {
    const from = connectedUsers.get(socket.id)
    
    if(!from || !connectedUsers.has(to)) {
      return;
    }

    io.to(to).emit('private-message', {from, message})
    console.log(`Mensagem privada envia de ${from} para ${to}`)

  })
  
  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id)
    connectedUsers.delete(socket.id)
  })
})

server.listen(process.env.APP_PORT, () => {
  console.log('Server is running on http://localhost:' + process.env.APP_PORT)
})
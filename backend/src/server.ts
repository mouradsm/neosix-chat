import express from 'express'
import http from 'http'
import Router from 'express'
import routes from './routes'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
import cors from 'cors'
import User from './types/user.interface'

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

const connectedUsers: User[] = [] 

const findUserById = (id: number) => connectedUsers.find(user => user.id === id)

const addConnectedUser = (user: User) => { 
  if(!findUserById(user.id)) {
    connectedUsers.push(user)
    return
  }

  connectedUsers.map(connectedUser => {
    if(connectedUser.id === user.id) {
      connectedUser.online = true
    }
  })
}

io.use((socket, next) => {
  const user = socket.handshake.auth.user
  console.log(user)
  if(!user) {
    return next(new Error('Usuário Inválido'))
  }

  /* @ts-expect-error: */
  socket.username = user.name
  /* @ts-expect-error: */
  socket.userId = user.id  
  
  next()
})

io.on('connection', (socket) => {
  /* @ts-expect-error: */

  console.log('User connected:', [ socket.userId, socket.username ]);

  addConnectedUser({id: socket.userId, name: socket.username, online: true} as User)  

  io.emit('users-online', connectedUsers)

  socket.on('join-room', (room: string) => {
    socket.join(room);    
  });

  socket.on('message', ({to, message}) => {

    /* @ts-expect-error: */
    const from = findUserById(userId)

    if(!from || !findUserById(to.id)) {
      return;
    }

    console.log(message)
    
    io.to(to.id).emit('message', message);
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected:', [ socket.userId, socket.username ]);    
    
    //update user status to offline
    connectedUsers.map(user => {
      if(user.id === socket.userId) {
        user.online = false
      }
    })
   
    io.emit('users-online', connectedUsers)

  })
})

server.listen(process.env.APP_PORT, () => {
  console.log('Server is running on http://localhost:' + process.env.APP_PORT)
})
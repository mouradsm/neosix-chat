import Router, { Request, Response } from 'express'
import { login, register } from '../controllers/auth.controller'

const router = Router()

router.post('/login', login as any)

router.post('/register', register as any) 

router.get('/logout', (req: Request, res: Response) => {
    res.send('Logout route')
})

export default router
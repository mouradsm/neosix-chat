import Router, { Request, Response } from 'express'
import { login as loginController, register as registerController } from '../controllers/auth.controller'

const router = Router()

router.post('/login', loginController as any)

router.post('/register', registerController as any) 

router.get('/logout', (req: Request, res: Response) => {
    res.send('Logout route')
})

export default router
import { Request, Response, Router } from 'express'
import { authenticateJWT } from '../middlewares/auth.middleware'

const router = Router()

router.use(authenticateJWT)

router.get('/messages', (req: Request, res: Response) => {
    return res.send("Oi")
})

export default router
import { Request, Response } from "express";
import { query } from "../models/DB";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const login = async (req: Request, res: Response) => {
 
  const { email, password }: { email: string; password: string } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Email e senha são obrigatórios" });
  }

  const result = await query(`SELECT * FROM users WHERE email = '${email}'`);  

  if(result.recordset.length === 0) {
    return res.status(400).send({error: 'Email ou senha inválidos'})
  }  

  const user = result.recordset[0] as User

  const isPasswordValid = await bcrypt.compare(password, user.password)
 
  if (!isPasswordValid) {
    return res.status(422).json({ error: "Email ou senha inválidos" })
  }

  const token = jwt.sign({id: user.id, email: user.email, name: user.name}, process.env.JWT_SECRET as string, {
    expiresIn: '1h'
  })

  return res.status(200).json({ token: token});
};

const register = async (req: Request, res: Response) => {

  const { name, email, password, password_confirmation } = req.body
  
  if(!email || !password || !password_confirmation) {
    return res.status(400).json({error: "Campos são obrigatórios"})
  }  

  const result = await query(`SELECT * FROM users WHERE email = '${email}'`);  
    
  if(result.recordset.length > 0) {
    return res.status(400).json({error: "O email informado já está sendo utilizado"})
  }

  if(password !== password_confirmation) {
    return res.status(400).json({ error: "password e password_confirmation devem coincidir"})
  }  

  const hashedPassword = await bcrypt.hash(password, 10)

  await query(`INSERT INTO users (name, email, password) VALUES ('${name}','${email}', '${hashedPassword}')`)
    .catch((error) => {
        console.log(error)
        return res.status(500).json({error: error})
    })  

  return res.status(201).send({message: 'Usuário criado com sucesso'})
};


export { login, register };

import { Request, Response } from "express";
import pool from "../models/DB";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const login = async (req: Request, res: Response) => {
 
  const { email, password }: { email: string; password: string } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Email e senha são obrigatórios" });
  }

  const connection = await pool.getConnection();

  const [rows] = await connection.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if((rows as any[]).length == 0) {
    return res.status(400).send({error: 'Usuário inexistente!'})
  }

  connection.release()
  
  const userEmail = rows[0].email
  const userPassword = rows[0].password

  const isPasswordValid = await bcrypt.compare(password, userPassword)
 
  if (!isPasswordValid) {
    return res.status(422).json({ error: "Email ou senha inválidos" })
  }

  const token = jwt.sign({email: userEmail}, process.env.JWT_SECRET as string, {
    expiresIn: '1h'
  })

  return res.status(200).json({ token: token});
};

const register = async (req: Request, res: Response) => {

  const { email, password, password_confirmation } = req.body
  
  if(!email || !password || !password_confirmation) {
    return res.status(400).json({error: "Campos são obrigatórios"})
  }

  const connection = await pool.getConnection()

  const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', email)
    
  if((existingUser as any[]).length > 0) {
    return res.status(400).json({error: "O email informado já está sendo utilizado"})
  }

  if(password !== password_confirmation) {
    return res.status(400).json({ error: "password e password_confirmation devem coincidir"})
  }  

  const hashedPassword = await bcrypt.hash(password, 10)

  const response = await connection
    .execute("INSERT INTO users (email, password) VALUES (?,?)",
        [email, hashedPassword ]
    )
    .catch((error) => {
        console.log(error)
        return res.json(500).json({error: error})
    })

  connection.release()

  return res.status(201).send({message: 'Usuário criado com sucesso'})
};


export { login, register };

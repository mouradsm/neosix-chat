'use client'

import { useRouter } from "next/navigation"
import { ReactNode, createContext, useContext, useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"
import { useCookies } from "react-cookie"
import socket from '@/lib/socket'
interface AuthContextType {
    user: User|null
    error: Error|null
    login: (username: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: {children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState<Error | null>(null)
    const [cookie, setCookie, removeCookie] = useCookies(['token'])

    const router = useRouter()

    useEffect(() => {
        const token = cookie.token

        if(!token) {
            return
        }

        let decodedToken = jwtDecode(token)

        setUser(decodedToken as User)

        socket.auth = {user: decodedToken}
        socket.connect()
        
            
        
    }, [router])

    const login = async (username: string, password: string) => {
        const headers = new Headers()

        headers.append('Accept', 'application/json')
        headers.append('Content-Type', 'application/json')
        const data = await fetch('http://localhost:8888/api/auth/login', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({email: username, password: password})
        })
        .then((res) => res.json())    
        .catch((e: Error) => setError(e))
        
        if(!data) {
            return;
        }

        // let decodedToken = jwtDecode(data.token)
        
        // setUser(decodedToken.name)

        setCookie('token', data.token, {path: '/'})

        router.push('/chat')
    }

    const logout = async () => {
        setUser(null)
        removeCookie('token', {path: '/'})
        router.push('/login')

    }

    return (
        <AuthContext.Provider value={{user, error, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if(!context) {
        throw new Error('Contexto Inválido')
    }

    return context
}
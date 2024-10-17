'use client'

import { useRouter } from "next/navigation"
import { ReactNode, createContext, useContext, useState } from "react"


interface AuthContextType {
    user: string|null
    error: Error|null
    login: (username: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: {children: ReactNode}) => {
    const [user, setUser] = useState<string | null>(null)
    const [error, setError] = useState<Error | null>(null)
    const router = useRouter()



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
        
        setUser(data)

        router.push('/chat/general')
    }

    const logout = async () => {
        setUser(null)
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
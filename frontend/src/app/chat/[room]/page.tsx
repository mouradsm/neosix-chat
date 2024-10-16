'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import socket from '@/lib/socket'


export default function Page() {
    const { room } = useParams()

    const [ messages, setMessages] = useState<{user: string; text: string}[]>([])
    const [newMessage, setNewMessage] = useState('')

    useEffect(() => {
        socket.emit('join-room', room)

        socket.on('message', (msg) => {
            setMessages((prev) => [...prev, msg])
        })

        return () => {
            socket.off('message')
        }
    }, [room])
    
    const sendMessage = () => {        
        if(newMessage.trim()) {
            socket.emit('message', {room, text: newMessage})
            setNewMessage('')
        }
    }

    return (
        <main className="flex flex-col justify-between bg-white min-h-96">
            <div className="w-full text-black">
                {messages.map((msg, index) => (
                    <div className="flex flex-row w-full ">
                        <p className="px-4 py-4 mt-2 text-right rounded-md w-fit" key={index}>{msg.text}</p>
                    </div>
                ))}
            </div>
            <input 
            className="p-2 mt-1 text-black bg-gray-200 border border-gray-300 outline-none" 
            type="text" 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
            />
        </main>
    );
}
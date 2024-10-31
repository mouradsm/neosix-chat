'use client'

import { useEffect, useState } from "react";

import UserCard from "../components/UserCard";
import socket from '@/lib/socket'
import { useUser } from "@/context/UserContext";

const Nav = () => {
  const [users, setUsers] = useState<User[]>([])
   const {setSelectedUser} = useUser()

  useEffect(() => {
    socket.on('users-online', (onlineUsers: User[]) => {
      setUsers(onlineUsers)
    })    

    return () => {
      socket.off('user-online')
    }
  },[])

  return (
    <nav className="h-screen p-2 bg-gray-600">
      <ul className="flex flex-col list-none">        
        {users.length <= 1 ? (<p>No users online</p>) : 
        /* @ts-expect-error: */
        (users.filter((user) => user.name != socket?.auth?.user?.name).map((user, index) => (
          <button key={index} onClick={() => setSelectedUser(user)}>
            <li >
              <UserCard user={user}/>
            </li>
          </button>
        )))}
      </ul>
    </nav>
  );
};

export default Nav;

"use client";

import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import socket from "@/lib/socket";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";


export default function Page() {
  const  room = 'general'

  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState("");

  const {selectedUser} = useUser()

  useEffect(() => {
    socket.emit("join-room", selectedUser?.id);
    socket.emit("join-room", user?.id)

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("message");
    };
  }, [selectedUser]);

  const sendMessage = () => {
    if (!messageContent.trim()) {
      return;
    }

    let newMessage: Message = {
      to: selectedUser as User,
      sender: user as User,
      content: messageContent,
    };

    socket.emit("message" , { to: selectedUser, message: newMessage });

    setMessageContent(""); 
  };
  
  const filteredMessages = messages.filter((message) => (message.sender.id == user?.id && message.to.id == selectedUser?.id) 
                    || (message.sender.id == selectedUser?.id && message.to.id == user?.id))

  return (
    selectedUser && (<main className="flex flex-col justify-between bg-[#0a0a0a] min-h-96">
      <div className="flex flex-col w-full p-1 text-black">
        {
        filteredMessages.map((message, index) => (
          <div key={index} className={`flex flex-row w-full ${message?.sender?.name === user?.name ? "justify-end" : "justify-start"}`}>
            <div className={`mt-1 ${message?.sender?.name === user?.name ? "bg-[#008069]" : "bg-gray-600"} rounded-lg w-fit`}>
              <span className="p-2 font-bold text-green-300">
                ~ {message.sender.name}
              </span>
              <p className="px-2 mt-2 font-medium text-right text-white rounded-md w-fit">
                {message.content}
              </p>
            </div>
          </div>
        ))}
      </div>
      <input
        className="p-2 mt-1 text-black bg-gray-200 border border-gray-300 outline-none"
        type="text"
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        onKeyUp={(e) => e.key === "Enter" && sendMessage()}
      />
    </main>)
  );
}

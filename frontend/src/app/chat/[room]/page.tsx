"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import { useAuth } from "@/context/AuthContext";

export default function Page() {
  const { room } = useParams();

  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState("");

  useEffect(() => {
    socket.emit("join-room", room);

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("message");
    };
  }, [room]);

  const sendMessage = () => {
    if (!messageContent.trim()) {
      return;
    }

    let newMessage: Message = {
      sender: "Diego Moura",
      content: messageContent,
    };

    socket.emit("message", { room, message: newMessage });

    setMessageContent("");
  };

  const self = false;

  return (
    <main className="flex flex-col justify-between bg-[#0a0a0a] min-h-96">
      <div className="flex flex-col w-full text-black ">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex flex-row w-full ${
              self ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`mt-1 ${
                self ? "bg-[#008069]" : "bg-gray-600"
              } rounded-lg w-fit`}
            >
              <span className="p-2 font-bold text-green-300">~ {message.sender}</span>
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
    </main>
  );
}

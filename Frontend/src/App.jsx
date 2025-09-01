import React, { useState } from 'react'
import { useEffect } from 'react';
import { useForm } from 'react-hook-form'
import { io } from 'socket.io-client'


const socket = io("http://localhost:3000");


const App = () => {
  const { register, reset, handleSubmit } = useForm()
  const [message, setmessage] = useState([])

  const submitHandler = (data) => {
    const userMessage = {
      sender: 'user',
      text: data.message,
      timeStamps: new Date().toLocaleTimeString(),
      id: Date.now(),
    }
    setmessage(prev => [...prev, userMessage]);
    socket.emit("ai-message", data.message) // sending to the Backend
    reset()

  }

  
  useEffect(() => {
    socket.on("ai-message-response", (data) => {
      const BotMessage = {
        sender: "model",
        text: data,
        timeStamps: new Date().toLocaleTimeString(),
        id: Date.now() + 1
      }
      setmessage(prev => [...prev, BotMessage]);
    })


    return () => {
      socket.off("ai-message-response");
    }
  }, [])


  const rendermsg = message.map((msg, index) => (
    <div key={msg.id}
      className={`flex my-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
    >
      <div className='bg-blue-400 inline-block w-auto p-1 px-3 rounded-xl max-w-2/3 mb-1'>
        <div className='text-xl'>{msg.text}</div>
        <div className='text-sm'>{msg.timeStamps}</div>
      </div>
    </div>
  ))

  return (
    <div className='w-full  h-screen bg-gray-800 relative '>
      <h2 className='text-7xl absolute font-semibold text-gray-500 top-1/2 left-1/2 -translate-y-[50%] -translate-x-[50%]'>AI CHATBOT</h2>
      <div className='h-9/10 w-screen fixed overflow-y-auto px-5'>{rendermsg}</div>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className='absolute bottom-0 w-full rounded-xl border-zinc-400 p-1 border flex justify-between items-center'>
        <input
          {...register('message')}
          type='text'
          placeholder='Message AI chat'
          className='w-full text-3xl py-2 px-4 outline-0 font-semibold text-zinc-500' />
        <button className='text-2xl border rounded-full px-2 py-1 bg-zinc-200 font-semibold text-zinc-400'>Submit</button>
      </form>
    </div>
  )
}

export default App
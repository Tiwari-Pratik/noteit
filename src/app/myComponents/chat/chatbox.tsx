"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useChat } from "ai/react"
import { Bot, User } from "lucide-react";
import { useEffect, useRef } from "react";
import { B612_Mono, Poppins } from "next/font/google"
import { useState } from 'react';
import { useUIState, useActions } from "ai/rsc";
import type { AI, AIState, UIState } from './actions';

const poppins = Poppins({
  weight: "400",
  style: "normal",
  subsets: ["latin"]

})


const ChatBox = () => {
  // const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading, error } = useChat()
  const divRef = useRef<HTMLDivElement | null>(null)
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();


  useEffect(() => {

    const divEl = divRef.current
    if (divEl) {

      divEl.scrollTop = divEl.scrollHeight
    }
  }, [messages.length])


  return (
    <>
      <div className={cn("z-10 bottom-0 right-0 flex flex-col w-full max-w-[500px] py-24 pt-12 pb-1 mx-auto stretch xl:right-36 max-h-[450px]")}>
        <div className={cn(poppins.className, "overflow-y-scroll mb-8 px-4 text-sm")} ref={divRef}>

          {messages.map((m: UIState) => (
            <div key={m.id} className="whitespace-pre-wrap text-wrap my-2 flex gap-4 items-center justify-start">
              <div className="shrink-0" >
                {m.role === 'user' ? <span className="text-primary"><User size={15} className="inline" /> : </span> : <span className="text-primary"><Bot size={15} className="inline" /> : </span>}
              </div>
              <div className="px-2 rounded-md justify-self-stretch grow">
                {m.display}
              </div>
            </div>
          ))}
        </div>

        {/* <form onSubmit={handleSubmit}> */}
        {/*   <Input */}
        {/*     className="w-full max-w-md p-2 mb-8 border border-primary/50 rounded shadow-xl" */}
        {/*     value={input} */}
        {/*     placeholder="Say something..." */}
        {/*     onChange={handleInputChange} */}
        {/*   /> */}
        {/*   <Button type="submit" >Send</Button> */}
        {/* </form> */}
        <form className="max-w-full" onSubmit={async (e) => {
          e.preventDefault();
          setInputValue('');

          // Add user message to UI state
          const userMessageUI: UIState = {

            id: Date.now(),
            display: <div className="break-all">{inputValue}</div>,
            role: 'user'
          }
          setMessages((currentMessages: UIState[]) => [
            ...currentMessages,
            userMessageUI
          ]);

          // Submit and get response message
          const responseMessage = await submitUserMessage(inputValue);
          setMessages((currentMessages: UIState[]) => [
            ...currentMessages,
            responseMessage,
          ]);

        }}>
          <Input
            className="w-full max-w-full p-2 mb-8 border border-primary/50 rounded shadow-xl text-wrap overflow-auto"
            placeholder="Send a message..."
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value)
            }}
          />
          <div className="py-2 px-4 flex gap-2 justify-between items-center">
            <Button type="submit" >Send</Button>
            <Button type="reset" onClick={async (e) => {
              e.preventDefault()
              setMessages((currentMessages: UIState[]) => [])
            }} >Clear</Button>
          </div>
        </form>
      </div>
    </>
  );

}
export default ChatBox

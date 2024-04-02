"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useChat } from "ai/react"
import { Bot, User } from "lucide-react";
import { useEffect, useRef } from "react";


const ChatBox = () => {
  const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading, error } = useChat()
  const divRef = useRef<HTMLDivElement | null>(null)


  useEffect(() => {

    const divEl = divRef.current
    if (divEl) {

      divEl.scrollTop = divEl.scrollHeight
    }
  }, [messages.length])


  return (
    <>
      <div className={cn("z-10 bottom-0 right-0 flex flex-col w-full max-w-[500px] py-24 pt-12 pb-1 mx-auto stretch xl:right-36 max-h-[450px]")}>
        <div className="overflow-y-scroll mb-8" ref={divRef}>

          {messages.map(m => (
            <div key={m.id} className="whitespace-pre-wrap my-2">
              {m.role === 'user' ? <span className="text-primary"><User size={15} className="inline" /> : </span> : <span className="text-primary"><Bot size={15} className="inline" /> : </span>}
              {m.content}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            className="w-full max-w-md p-2 mb-8 border border-primary/50 rounded shadow-xl"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
          <Button type="submit" >Send</Button>
        </form>
      </div>
    </>
  );

}
export default ChatBox

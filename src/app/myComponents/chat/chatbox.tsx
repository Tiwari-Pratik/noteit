"use client"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChat } from "ai/react"
import { XCircle } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void
}

const ChatBox = ({ open, onClose }: Props) => {
  const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading, error } = useChat()

  return (
    <>
      <button onClick={onClose} className="mb-1 ms-auto block"><XCircle size={30} /></button>
      <div className={cn("z-10 bottom-0 right-0 flex flex-col w-full max-w-[500px] py-24 mx-auto stretch xl:right-36", open ? "fixed" : "hidden")}>
        {messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap">
            {m.role === 'user' ? 'User: ' : 'AI: '}
            {m.content}
          </div>
        ))}

        <form onSubmit={handleSubmit}>
          <input
            className="w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </>
  );

}
export default ChatBox

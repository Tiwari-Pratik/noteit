"use client"

import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ChatBox from "./chatbox"

const ChatButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-primary/50 text-primary"><Bot size={20} className="mr-2" /> AI Chat</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md left-[80%] top-[67%] max-h-[600px] border-primary/50 md:w-[700px] md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-primary">Chat with AI</DialogTitle>
          <DialogDescription className="text-primary">
            Talk to the AI to get intelligent answers from your notes.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <ChatBox />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ChatButton

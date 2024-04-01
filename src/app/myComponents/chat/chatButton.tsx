"use client"
import { Fragment, useState } from "react"
import ChatBox from "./chatbox"
import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"

const ChatButton = () => {

  const [chatOpen, setChatOpen] = useState<boolean>(false)

  return (
    <Fragment>
      <Button onClick={() => setChatOpen(true)}><Bot size={20} className="mr-2" /> AI Chat</Button>
      <ChatBox open={chatOpen} onClose={() => setChatOpen(false)} />
    </Fragment>
  )

}

export default ChatButton

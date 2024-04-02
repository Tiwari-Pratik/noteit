
import { Button } from "@/components/ui/button"
import { CardTitle, CardDescription, CardContent, Card } from "@/components/ui/card"
import { AddNotesButton } from "./addNotesButton"
import { getAllNotesByUserId } from "@/lib/notesData"
import { auth } from "../../../../auth"
import { Note } from "@prisma/client"
import { EditNotesButton } from "./editNotesButton"
import { deleteNote } from "@/lib/actions"
import DeleteNoteButton from "./deleteNoteButton"
import ChatButton from "../chat/chatButton"

const Notes = async () => {

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return <p>You are not authorized to see any notes</p>
  const allNotes: Note[] | null = await getAllNotesByUserId(userId)

  return (
    <main className="mt-12 mx-auto p-8 w-[90%] min-h-full">
      <div className="flex flex-col min-h-full">
        <section className="flex-1 flex flex-col p-4 gap-4 md:p-6">
          <div className="flex justify-between items-center gap-4 bg-secondary/50 px-4 py-2 rounded-md">
            <h1 className="font-semibold text-2xl text-primary">Notes</h1>
            <div className="flex gap-4">
              <AddNotesButton />
              <ChatButton />
            </div>
          </div>
          <div className="grid gap-4 md:gap-6">
            {allNotes && allNotes.map((note, index) => {
              return (

                <Card className="border-primary/50 flex items-center justify-between px-2" key={index}>
                  <div>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg font-semibold">{note.title}</CardTitle>
                      <CardDescription className="whitespace-pre text-wrap">
                        {note.content}
                      </CardDescription>
                    </CardContent>
                  </div>
                  <div className="flex gap-4">
                    <EditNotesButton title={note.title} body={note.content} id={note.id} />
                    <DeleteNoteButton delete={deleteNote} id={note.id} />

                  </div>
                </Card>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Notes



"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { editNote } from "@/lib/actions"
import { notesState } from "@/lib/notesSchemas"
import { useEffect, useState } from "react"
import { useFormState } from "react-dom"
import EditIcon from "./editIcon"

interface Props {
  title: string,
  body: string | null,
  id: string
}

export function EditNotesButton({ title, body, id }: Props) {

  const initialState: notesState = { message: null, errors: {} }

  const editNoteWithId = editNote.bind(null, id)
  const [state, dispatch] = useFormState(editNoteWithId, initialState)
  const [success, setSuccess] = useState<boolean>(false)
  const { toast } = useToast()



  useEffect(() => {

    if (state.message === "success") {
      setSuccess(prev => !prev)
      toast({
        title: "Note updated successfully to the database",
      })
    }

  }, [state.message])

  return (
    <Dialog open={success} onOpenChange={setSuccess}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-primary/50">
          <EditIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
          <DialogDescription>
            Add a new note for yourself.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form className="flex flex-col gap-8" action={dispatch} aria-describedby="custom-message">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                defaultValue={title}
                className="col-span-3"
                name="title"
                aria-describedby="title-error"
              />
            </div>
            <div id="title-error" aria-live="polite" aria-atomic="true">
              {state.errors?.title &&
                state.errors?.title?.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="body" className="text-right">
                Note
              </Label>
              <Textarea
                id="body"
                defaultValue={body || ""}
                className="col-span-3"
                name="body"
                placeholder="Please add your notes here"
                aria-describedby="body-error"

              />
            </div>
            <div id="body-error" aria-live="polite" aria-atomic="true">
              {state.errors?.body &&
                state.errors?.body?.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
            <div className="self-end">

              <Button type="submit">Save changes</Button>
            </div>
          </form >
        </div>
        <DialogFooter>

          <div
            id="custom-message"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.message && !success && (
              <p className="mt-2 text-sm text-red-500">{state.message}</p>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}





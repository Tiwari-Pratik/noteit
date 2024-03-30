import { Note } from "@prisma/client"
import prisma from "./db"


export const getAllNotesByUserId = async (userId: string) => {

  try {
    const notes: Note[] = await prisma.note.findMany({
      where: {
        userId
      }
    })
    return notes
  } catch (error) {
    return null
  }
}

export const getNoteById = async (id: string) => {
  try {
    const note: Note | null = await prisma.note.findUnique({
      where: {
        id
      }
    })
    return note
  } catch (error) {
    return null
  }

}

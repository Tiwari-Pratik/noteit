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

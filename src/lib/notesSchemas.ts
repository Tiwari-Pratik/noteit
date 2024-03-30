import { z } from "zod";


export const notesSchema = z.object({
  title: z.string({ required_error: "Title must be provided" }),
  body: z.string({ invalid_type_error: "Content must be string" })
})

export interface notesState {
  message?: string | null,
  errors?: {
    title?: string[],
    body?: string[]
  }

}

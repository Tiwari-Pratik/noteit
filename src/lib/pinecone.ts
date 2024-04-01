
import { Pinecone } from "@pinecone-database/pinecone"

const apikey = process.env.PINECONE_API_KEY

if (!apikey) {
  throw new Error("Pinecone API key is not set")
}

const pinecone = new Pinecone({
  apiKey: apikey
})

export const notesIndex = pinecone.Index("noteit")

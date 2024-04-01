
import OpenAI from 'openai';

// Create an OpenAI API client (that's edge friendly!)

const apikey = process.env.OPENAI_API_KEY
if (!apikey) {
  throw new Error("Openai API key is not set")
}
const openai = new OpenAI({
  apiKey: apikey,
});

export default openai

export const getEmbedding = async (text: string) => {
  console.log("calling openai")
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text
  })

  const embedding = response.data[0].embedding
  if (!embedding) throw new Error("Error generating embedding")
  // console.log(embedding)

  return embedding

}

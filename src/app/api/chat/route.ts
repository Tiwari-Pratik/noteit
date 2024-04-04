
import { OpenAIStream, StreamingTextResponse } from 'ai';
import openai, { getEmbedding } from '@/lib/openai';
import { NextRequest, NextResponse } from 'next/server';
import { ChatCompletionMessage } from 'openai/resources/index.mjs';
import { auth } from '../../../../auth';
import { notesIndex } from '@/lib/pinecone';
import prisma from '@/lib/db';

// Set the runtime to edge for best performance
// export const runtime = 'edge';
//



export const POST = async (req: NextRequest) => {
  console.log("calling chat route")

  try {
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages
    // console.log({ messages })

    const messagesTruncated = messages.slice(-6)
    const embedding = await getEmbedding(messagesTruncated.map(message => message.content).join("\n"))
    const session = await auth()
    const userId = session?.user?.id
    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 4,
      filter: { userId }

    })

    const relevantNotes = await prisma.note.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map(match => match.id)
        }
      }
    })

    // console.log({ relevantNotes })


    // Ask OpenAI for a streaming chat completion given the prompt

    const systemMessage: ChatCompletionMessage = {
      role: "assistant",
      content: "You are an intelligent notes taking app. You answer the user's questions based on their existing notes" +
        "The relevant notes for this query are:\n" +
        relevantNotes.map(note => `Title:${note.title}\n\n Content:\n${note.content}`).join("\n\n")
    }
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
      // messages
    });
    // console.log({ response })

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);
    // Respond with the stream
    return new StreamingTextResponse(stream);

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })

  }
}

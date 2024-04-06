"use server"
import { NextRequest, NextResponse } from 'next/server';
import { ChatCompletionMessage } from 'openai/resources/index.mjs';
import OpenAI from 'openai';



export const getTopicsFromTweet = async (tweet: string) => {
  const topicOpenai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const systemMessage: ChatCompletionMessage = {
    role: "assistant",
    content: "You are smart data analyist, who prvides key topics discussed in a tweet\n" +
      "You should return the key topics precisely in a list, for example ['key topic 1','key topic 2']\n"
  }
  const response = await topicOpenai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: false,
    messages: [systemMessage, { role: "assistant", content: `Please give the key topics from this tweet: ${tweet}` }],
    // messages
  });
  // console.log(response.choices)

  return response.choices

}


export const getSummaryFromtext = async (text: string) => {
  const summaryOpenai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const systemMessage: ChatCompletionMessage = {
    role: "assistant",
    content: "You are smart data analyist with knowledge of Natural language processing, given a text you provide a crisp and to the point summary of the text\n\n"
  }
  const response = await summaryOpenai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: false,
    messages: [systemMessage, { role: "assistant", content: `Please summarize the article from the given text: ${text}` }],
    // messages
  });
  // console.log(response.choices)

  return response.choices

}

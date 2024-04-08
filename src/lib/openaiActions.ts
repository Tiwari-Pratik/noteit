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
    content: `You are smart data analyist with knowledge of Natural language processing and ability to parse a html string,
    given a html string with all the html tags,
    you parse the string and analyze it to provide a crisp and to the point summary of the text\n` +
      `You should provide all the key information from the parsed text, such as the title of the text,
     list of key people or names mentioned in that text, list of key topics discussed in that text and finally the summary of the article\n` +
      `you should return the data in the following structure\n` +
      `{
       "title":"Title of the text",
      "keyNames": ["key names mentioned in the text"],
       "keyTopics":["Key topics discussed in the text"],
       "summary":"Summary of the text"
}\n`+
      `"title" is a string field, "keyNames" is an array of strings, "keyTopics" is an array of strings and "summary" is a string field`
  }
  const response = await summaryOpenai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    stream: false,
    messages: [systemMessage, { role: "assistant", content: `Please summarize the article from the given html string: ${text}` }],
    // messages
  });
  console.log(response.choices[0])

  return response.choices

}

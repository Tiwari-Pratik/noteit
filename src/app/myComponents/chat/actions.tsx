

import { OpenAI } from "openai";
import { createAI, createStreamableUI, getMutableAIState, render } from "ai/rsc";
import { z } from "zod";
import { ReactNode, Suspense, useState } from "react";
import { getEmbedding } from "@/lib/openai";
import { auth } from "../../../../auth";
import { notesIndex } from "@/lib/pinecone";
import prisma from "@/lib/db";
import { ChatCompletionMessage, ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { Tweet } from "react-tweet"
import { WeatherData, getWeatherData } from "@/lib/weather";
import { Button } from "@/components/ui/button";
import WeatherCardContainer from "./weathercontainer";
import { getURL } from "next/dist/shared/lib/utils";
import IframeWrapper from "./iframeWrapper";
import { getSummaryFromtext, getTopicsFromTweet } from "@/lib/openaiActions";
import { getTweetDetail } from "@/lib/twitterData";
import { getTextFromWebsite } from "@/lib/scrapingActions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export interface AIState {

  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  id?: string;
  name?: string;
}

export interface UIState {

  id: number;
  display: React.ReactNode;
  role?: 'user' | 'assistant' | 'system' | 'function';
}
// An example of a spinner component. You can also import your own components,
// or 3rd party component libraries.
function Spinner() {
  return <div>Loading...</div>;
}

interface FlightInfo {
  flightNumber: string;
  departure: string;
  arrival: string
}
// An example of a flight card component.
function FlightCard({ flightInfo }: { flightInfo: FlightInfo }) {
  return (
    <div className="border border-primary px-4 py-2 bg-primary/20 w-[90%] mx-auto rounded-md">
      <h2>Flight Information</h2>
      <p>Flight Number: {flightInfo.flightNumber}</p>
      <p>Departure: {flightInfo.departure}</p>
      <p>Arrival: {flightInfo.arrival}</p>
    </div>
  );
}

const TweetCard = ({ id }: { id: string }) => {
  return (

    <div className="px-2 py-2 w-[90%] mx-auto rounded-md">
      <Tweet id={id} />
    </div>
  )
}

// const WeatherCard = ({ info }: { info: WeatherData }) => {
//   return (
//     <Suspense fallback={<p>Loading weather info...</p>}>
//       <WeatherCardContainer info={info} refreshAction={async () => {
//         "use server"
//         return getWeatherData("noida")
//       }} />
//     </Suspense>
//   )
// }

const WeatherWrapperComponent = ({ city }: { city: { city: string } }) => {

  return (
    <Suspense fallback={<p>Fetching weather data...</p>}>
      <WeatherCard city={city.city} />
    </Suspense>
  )
}

const WeatherCard = async ({ city }: { city: string }) => {
  const info: WeatherData = await getWeatherData(city)
  return (
    <>
      <WeatherCardContainer info={info} refreshAction={async () => {
        "use server"
        return getWeatherData("noida")
      }} />
    </>
  )
}

const getCity = async (city: string) => {
  return {
    city
  }
}


const getSourceUrl = async (url: string) => {

  if (url.toLowerCase().includes("youtube")) {
    const newUrlparts = url.split("watch?v=")
    const newUrl = newUrlparts[0] + "embed/" + newUrlparts[1]
    return newUrl
  }
  return url
}
// const WeatherCard = ({ weatherContainer }: { weatherContainer: ReactNode }) => {
//   return (
//     <div>
//       {weatherContainer}
//     </div>
//   )
// }

const embedTweet = async (url: string) => {
  const id = url.split("status/")[1]
  return { id }
}

// An example of a function that fetches flight information from an external API.
async function getFlightInfo(flightNumber: string, city1: string, city2: string) {
  return {
    flightNumber,
    departure: city1,
    arrival: city2,
  };
}

const TweetTopicsCard = async ({ tweet }: { tweet: string }) => {

  const topics = await getTopicsFromTweet(tweet)
  return (
    <div className="px-2 py-2 w-[90%] mx-auto rounded-md flex flex-col gap-2 justify-between items-center border border-primary">
      <div className="p-2">
        <h2>The key topics discussed in the Tweet provided are as following: </h2>
      </div>
      {topics.map((topic, index) => {
        return (
          <div className="p-2 flex gap-2 justify-between self-start" key={index}>
            <ol className="list-decimal ml-2">
              {topic.message.content?.replace("[", "").replace("]", "").split(",").map(topicName => {
                return (
                  <li>{topicName.replaceAll("'", "")}</li>
                )
              })}
            </ol>
          </div>
        )
      })}
    </div>
  )
}

const ArticleSummary = async ({ text }: { text: string | undefined }) => {

  if (!text) {
    return (

      <div className="px-2 py-2 w-[90%] mx-auto rounded-md border border-primary">
        <p>Couldn't find the article</p>
      </div>
    )
  }
  const summaries = await getSummaryFromtext(text)

  return (
    <div className="px-2 py-2 w-[90%] mx-auto rounded-md border border-primary">
      {summaries.map((summary, i) => {
        return <p key={i}>{summary.message.content}</p>
      })}

    </div>
  )

}

async function submitUserMessage(userInput: string) {
  'use server';

  // console.log("calling submitUserMessage")
  const aiState = getMutableAIState<typeof AI>();

  const aiMessages = [...aiState.get()]
  const messagesTruncated = aiMessages.slice(-6)
  const embedding = await getEmbedding(messagesTruncated.map(message => message.content).join("\n"))
  const session = await auth()
  const userId = session?.user?.id

  // console.log(userId)
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

  const systemMessage: ChatCompletionMessageParam = {
    role: 'system',
    content: "Youa re a flight assistant and but more importantly, You are an intelligent notes taking app. You answer the user's questions based on their existing notes" +
      "The relevant notes for this query are:\n" +
      relevantNotes.map(note => `Title:${note.title}\n\n Content:\n${note.content}`).join("\n\n")
  }

  // Update the AI state with the new user message.
  aiState.update([
    ...aiState.get(),
    {
      role: 'user',
      content: userInput,
    },
  ]);

  // The `render()` creates a generated, streamable UI.
  const ui: ReactNode = render({
    model: 'gpt-4-0125-preview',
    provider: openai,
    messages: [
      // { role: 'system', content: 'You are a flight assistant' },
      systemMessage,
      ...aiState.get() as ChatCompletionMessageParam[]
    ],

    // `text` is called when an AI returns a text response (as opposed to a tool call).
    // Its content is streamed from the LLM, so this function will be called
    // multiple times with `content` being incremental.
    text: ({ content, done }) => {
      // When it's the final content, mark the state as done and ready for the client to access.
      if (done) {
        aiState.done([
          ...aiState.get(),
          {
            role: "assistant",
            content
          }
        ]);
      }

      return <p>{content}</p>
    },
    tools: {
      get_flight_info: {
        description: 'Get the information for a flight',
        parameters: z.object({
          flightNumber: z.string().describe('the number of the flight'),
          city1: z.string().describe('the city from where flight will take off'),
          city2: z.string().describe('the city from where flight will land')
        }).required(),
        render: async function*({ flightNumber, city1, city2 }) {
          // Show a spinner on the client while we wait for the response.
          yield <Spinner />

          // Fetch the flight information from an external API.
          const flightInfo = await getFlightInfo(flightNumber, city1, city2)

          // Update the final AI state.
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "get_flight_info",
              // Content can be any string to provide context to the LLM in the rest of the conversation.
              content: JSON.stringify(flightInfo),
            }
          ]);

          // Return the flight card to the client.
          return <FlightCard flightInfo={flightInfo} />
        }
      },
      embed_tweet: {
        description: 'show or open a tweet from twitter url',
        parameters: z.object({
          url: z.string().describe('the url of the tweet').url(),
        }).required(),
        render: async function*({ url }) {
          // Show a spinner on the client while we wait for the response.
          yield <Spinner />

          // Fetch the flight information from an external API.
          const tweetInfo = await embedTweet(url)

          // Update the final AI state.
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "embed_tweet",
              // Content can be any string to provide context to the LLM in the rest of the conversation.
              content: JSON.stringify(tweetInfo),
            }
          ]);

          // Return the flight card to the client.
          return <TweetCard id={tweetInfo.id} />
        }

      },
      get_weather_data: {

        description: 'get weather information for a city',
        parameters: z.object({
          city: z.string().describe('any city or location name'),
        }).required(),
        render: async function*({ city }) {
          // Show a spinner on the client while we wait for the response.
          yield <Spinner />

          // Fetch the flight information from an external API.
          // const weatherInfo: WeatherData = await getWeatherData(city)
          const cityName = await getCity(city)

          // Update the final AI state.

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "get_weather_data",
              // Content can be any string to provide context to the LLM in the rest of the conversation.
              content: JSON.stringify(cityName),
            }
          ]);
          // aiState.done([
          //   ...aiState.get(),
          //   {
          //     role: "function",
          //     name: "get_weather_data",
          //     // Content can be any string to provide context to the LLM in the rest of the conversation.
          //     content: JSON.stringify(weatherInfo),
          //   }
          // ]);

          // Return the flight card to the client.
          // return <WeatherCard info={weatherInfo} />
          // const weatherContainer = createStreamableUI(<p>Fetching weather info...</p>)
          // weatherContainer.done(

          //   <WeatherCardContainer info={weatherInfo} refreshAction={async () => {
          //     "use server"
          //     return getWeatherData("noida")
          //   }} />
          // )
          // return <WeatherCard weatherContainer={weatherContainer.value} />
          return <WeatherWrapperComponent city={cityName} />
        }
      },
      embed_any_url: {

        description: 'embed or show any url or link but it should not be a tweet from Twitter',
        parameters: z.object({
          url: z.string().describe('the url to be embedded').url(),
        }).required(),
        render: async function*({ url }) {
          // Show a spinner on the client while we wait for the response.
          yield <Spinner />

          // Fetch the flight information from an external API.
          const sourceUrl = await getSourceUrl(url)

          // Update the final AI state.
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "embed_any_url",
              // Content can be any string to provide context to the LLM in the rest of the conversation.
              content: JSON.stringify(sourceUrl),
            }
          ]);

          // Return the flight card to the client.
          return <IframeWrapper url={sourceUrl} />
        }
      },
      extract_topics: {

        description: 'find or extract key topics discussed in atweet from its tweet url from twitter',
        parameters: z.object({
          url: z.string().describe('the url of the tweet').url(),
        }).required(),
        render: async function*({ url }) {
          // Show a spinner on the client while we wait for the response.
          yield <Spinner />

          // Fetch the flight information from an external API.
          const tweet = await getTweetDetail(url)

          // Update the final AI state.
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "extract_topics",
              // Content can be any string to provide context to the LLM in the rest of the conversation.
              content: JSON.stringify(tweet),
            }
          ]);

          // Return the flight card to the client.
          return <TweetTopicsCard tweet={tweet} />
        }
      },
      get_summary: {

        description: 'find the summary from the text content of a given url, the url can be of any blog or news or article or even a normal website link',
        parameters: z.object({
          url: z.string().describe('the url of the given link').url(),
        }).required(),
        render: async function*({ url }) {
          // Show a spinner on the client while we wait for the response.
          yield <Spinner />

          // Fetch the flight information from an external API.
          const sourceText = await getTextFromWebsite(url)

          // Update the final AI state.
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "get_summary",
              // Content can be any string to provide context to the LLM in the rest of the conversation.
              content: JSON.stringify(sourceText),
            }
          ]);

          // Return the flight card to the client.
          return <ArticleSummary text={sourceText} />
        }
      }
    }
  })
  const returnedUI: UIState = {

    id: Date.now(),
    display: ui,
    role: "assistant"
  }
  return returnedUI
}

// Define the initial state of the AI. It can be any JSON object.
const initialAIState: AIState[] = [];

// The initial UI state that the client will keep track of, which contains the message IDs and their UI nodes.

const initialUIState: UIState[] = [];

// AI is a provider you wrap your application with so you can access AI and UI state in your components.
export const AI = createAI({
  actions: {
    submitUserMessage
  },
  // Each state can be any shape of object, but for chat applications
  // it makes sense to have an array of messages. Or you may prefer something like { id: number, messages: Message[] }
  initialUIState,
  initialAIState
});

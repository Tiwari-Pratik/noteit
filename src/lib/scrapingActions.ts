
"use server"
import { JSDOM } from "jsdom"
import * as cheerio from "cheerio"


export const getTextFromWebsite = async (url: string) => {
  const webHtmlRes = await fetch(url, {
    method: "GET",
    headers: {
      "content-type": "text/html"
    }
  })
  const webHtml = await webHtmlRes.text()
  // console.log(webHtml)

  const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/i;
  const scriptRegex = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
  const noscriptRegex = /<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi;
  const unwantedTagsRegex = /<(?!\/?(h[1-6]|p|span|a)\b)[^>]+>/gi;

  let bodyText = webHtml.match(bodyRegex)?.[1] || '';
  bodyText = bodyText.replace(scriptRegex, '');
  bodyText = bodyText.replace(noscriptRegex, '');
  // const plainText = bodyText.replace(htmlTagsRegex, '').replace(lineBreaksRegex, '');
  let cleanText = bodyText.replace(unwantedTagsRegex, '')

  // console.log(cleanText.trim());



  return cleanText.trim()
}


"use server"
import { JSDOM } from "jsdom"
import { parse } from "parse5"


export const getTextFromWebsite = async (url: string) => {
  const webHtmlRes = await fetch(url, {
    method: "GET",
    headers: {
      "content-type": "text/html"
    }
  })
  const webHtml = await webHtmlRes.text()
  // console.log(webHtml)

  const jdoc = parse(webHtml)
  const jbody = jdoc.childNodes[1]
  console.log(jbody)

  // const jdom = new JSDOM(webHtml)
  // const jdoc = jdom.window.document
  // const jbody = jdoc.getElementsByTagName("body")[0]
  // console.log(jbody)
  // const websiteText = jbody?.innerText
  // console.log(jbody?.innerText)
  // return websiteText
}

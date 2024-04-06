"use server"


export const getTweetDetail = async (url: string) => {
  const tweetId = url.split("status/")[1]
  const tweetDetailURL = `https://twitter154.p.rapidapi.com/tweet/details?tweet_id=${tweetId}`

  try {
    const response = await fetch(tweetDetailURL, {
      method: "GET",
      headers: {

        'X-RapidAPI-Key': '6ec7934ea2msh8a8cb22698520c3p1f877djsn745040c35697',
        'X-RapidAPI-Host': 'twitter154.p.rapidapi.com'
      }
    });
    const result = await response.text();
    // console.log(result);
    return result
  } catch (error) {
    throw new Error("couldn't fetch tweet details")
  }



}

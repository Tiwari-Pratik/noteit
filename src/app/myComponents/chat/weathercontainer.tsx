
"use client"

import { Button } from "@/components/ui/button"
import { WeatherData, getWeatherData } from "@/lib/weather"
import { useEffect, useState } from "react"

interface WeatherProps {
  info: WeatherData,
  refreshAction: () => Promise<WeatherData>
}
const WeatherCardContainer = (props: WeatherProps) => {
  const [data, setData] = useState({ name: props.info.name, temp: props.info.main.temp, feels: props.info.main.feels_like })
  const clickHandler = async () => {
    const newData = await props.refreshAction()
    setData({ name: newData.name, temp: newData.main.temp, feels: newData.main.feels_like })
  }
  const cities = ["patna", "kolkata", "delhi", "toronto", "kashmir", "mumbai", "islamabad"];


  useEffect(() => {
    const interval = setInterval(async () => {
      const random = Math.floor(Math.random() * cities.length);
      const newData = await getWeatherData(cities[random])
      setData({ name: newData.name, temp: newData.main.temp, feels: newData.main.feels_like })

    }, 5000)
    return () => clearInterval(interval)
  }, [])
  return (

    <div className="py-2 px-2 flex flex-col gap-2 items-end">
      <div className="border border-primary px-4 py-2 bg-primary/20 w-[90%] mx-auto rounded-md">
        <h2>{data.name}</h2>
        <p>Temp: {data.temp}</p>
        <p>Feels Like: {data.feels}</p>

      </div>
      <Button onClick={clickHandler} className="mr-4">Refresh</Button>
    </div>
  )


}

export default WeatherCardContainer


const API_KEY = "dde14b1df50929932b612b71179d0326";

export interface GeoData {
  lat: number;
  long: number;
}

export interface WeatherData {
  name: string;
  weather: {
    description: string;
    icon: string;
    main: string;
    id: number;
  }[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
}

export type OpenWeatherTempScale = "metric" | "imperial";

export const getLocationGeocode = async (location: String) => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`,
    );

    if (!res.ok) {
      throw new Error("Location not found");
    }
    const data = await res.json();
    // console.log(data);
    const geoData: GeoData = {
      lat: data[0].lat,
      long: data[0].lon,
    };
    // console.log(geoData);
    return geoData;
  } catch (error) {
    throw error;
  }
};

export const getWeatherData = async (
  location: String,
): Promise<WeatherData> => {
  try {
    const locationData: GeoData = await getLocationGeocode(location);
    console.log({ locationData });
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${locationData.lat.toString()}&lon=${locationData.long.toString()}&units=metric&appid=${API_KEY}`,
    );
    if (!res.ok) {
      throw new Error("Weather data not found");
    }

    const data: WeatherData = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};

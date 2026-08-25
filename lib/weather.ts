export type WeatherSnapshot = {
  temperatureC: number;
  label: string;
};

const WMO: Record<number, string> = {
  0: "vedro",
  1: "uglavnom vedro",
  2: "djelomično oblačno",
  3: "oblačno",
  45: "magla",
  48: "magla",
  51: "slaba kiša",
  53: "kiša",
  55: "kiša",
  61: "kiša",
  63: "kiša",
  65: "jaka kiša",
  71: "snijeg",
  73: "snijeg",
  75: "snijeg",
  80: "pljusak",
  81: "pljusak",
  82: "pljusak",
  95: "grmljavina",
  96: "grmljavina",
  99: "grmljavina",
};

export async function getWeather(lat: number, lng: number): Promise<WeatherSnapshot | null> {
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(lat));
    url.searchParams.set("longitude", String(lng));
    url.searchParams.set("current", "temperature_2m,weather_code");
    url.searchParams.set("timezone", "Europe/Sarajevo");

    const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      current?: { temperature_2m?: number; weather_code?: number };
    };
    const temperatureC = data.current?.temperature_2m;
    const code = data.current?.weather_code;
    if (typeof temperatureC !== "number") return null;

    return {
      temperatureC: Math.round(temperatureC),
      label: (code !== undefined && WMO[code]) || "na terenu",
    };
  } catch {
    return null;
  }
}

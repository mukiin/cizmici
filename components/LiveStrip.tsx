import Link from "next/link";
import { site } from "@/lib/data";
import { daysUntil } from "@/lib/dates";
import { getWeather } from "@/lib/weather";

export async function LiveStrip() {
  const weather = await getWeather(site.location.lat, site.location.lng);
  const days = daysUntil(site.danMz.month, site.danMz.day);
  const weatherText = weather
    ? `Čizmići, ${weather.temperatureC}°C, ${weather.label}`
    : "Čizmići · vrijeme se učitava";

  return (
    <div className="strip">
      <div className="wrap">
        <div className="item">
          <span className="pulse" />
          {weatherText}
        </div>
        <div className="sep" />
        <div className="item">
          {days} dana do Dana MZ · 10. juli
        </div>
        <div className="sep" />
        <Link href={site.live.lastNewsHref} className="item">
          Zadnje: „{site.live.lastNews}“
        </Link>
        <div className="sep" />
        <Link href="/dijaspora" className="item">
          Dijaspora — mapa i pozdravi
        </Link>
      </div>
    </div>
  );
}

import type {
  Business,
  Demographics,
  Diaspora,
  EventItem,
  Greetings,
  Infrastructure,
  Issues,
  MapData,
  Poll,
  Project,
  Site,
  Story,
  TimelineItem,
} from "./types";

import siteJson from "@/content/site.json";
import historijaJson from "@/content/historija.json";
import demografijaJson from "@/content/demografija.json";
import infrastrukturaJson from "@/content/infrastruktura.json";
import mapaJson from "@/content/mapa.json";
import projektiJson from "@/content/projekti.json";
import biznisiJson from "@/content/biznisi.json";
import priceJson from "@/content/price.json";
import dijasporaJson from "@/content/dijaspora.json";
import pozdraviJson from "@/content/pozdravi.json";
import dogadjajiJson from "@/content/dogadjaji.json";
import prijaveJson from "@/content/prijave.json";
import anketaJson from "@/content/anketa.json";

export const site = siteJson as Site;
export const historija = historijaJson as TimelineItem[];
export const historijaPregled = historija.filter((item) => item.featured);

export function getHistorija(slug: string) {
  return historija.find((item) => item.slug === slug);
}

export function historijaNeighbors(slug: string) {
  const index = historija.findIndex((item) => item.slug === slug);
  if (index < 0) return { prev: undefined, next: undefined };
  return {
    prev: index > 0 ? historija[index - 1] : undefined,
    next: index < historija.length - 1 ? historija[index + 1] : undefined,
  };
}
export const demografija = demografijaJson as Demographics;
export const infrastruktura = infrastrukturaJson as Infrastructure;
export const putevi = infrastruktura.roads;
export const infraObjekti = infrastruktura.objects;

export function getPut(slug: string) {
  return putevi.find((item) => item.slug === slug);
}

export function getInfraObjekt(slug: string) {
  return infraObjekti.find((item) => item.slug === slug);
}

export function putNeighbors(slug: string) {
  const index = putevi.findIndex((item) => item.slug === slug);
  if (index < 0) return { prev: undefined, next: undefined };
  return {
    prev: index > 0 ? putevi[index - 1] : undefined,
    next: index < putevi.length - 1 ? putevi[index + 1] : undefined,
  };
}

export const mapa = mapaJson as MapData;
export const projekti = projektiJson as Project[];
export const biznisi = biznisiJson as Business[];
export const price = priceJson as Story[];
export const dijaspora = dijasporaJson as Diaspora;
export const pozdravi = pozdraviJson as Greetings;
export const dogadjaji = dogadjajiJson as EventItem[];
export const prijave = prijaveJson as Issues;
export const anketa = anketaJson as Poll;

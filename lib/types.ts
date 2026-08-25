export type SourceKind = "official" | "verified" | "public";

export type TimelineItem = {
  slug: string;
  year: string;
  title: string;
  body: string;
  source: SourceKind;
  featured: boolean;
  detail: string[];
};

export type AgeGroup = { label: string; value: number };
export type EthnicityRow = { label: string; count: number; pct: string };

export type Demographics = {
  note: string;
  coverageNote: string;
  source: SourceKind;
  sourceLabel: string;
  males: number;
  females: number;
  areaKm2: number;
  ageGroups: AgeGroup[];
  ethnicity: EthnicityRow[];
  total: number;
};

export type InfraFact = { label: string; value: string };

export type MapMarker = {
  lat: number;
  lng: number;
  color: string;
  title: string;
  body: string;
  legend: string;
};

export type Road = {
  id: string;
  slug: string;
  name: string;
  km: string;
  from: string;
  to: string;
  detail: string[];
  facts: InfraFact[];
};

export type InfraObject = {
  slug: string;
  name: string;
  chip: string;
  kind: "object" | "network";
  detail: string[];
  facts: InfraFact[];
};

export type Infrastructure = {
  intro: string;
  source: SourceKind;
  roads: Road[];
  objects: InfraObject[];
};

export type MapData = {
  intro?: string;
  center: [number, number];
  zoom: number;
  markers: MapMarker[];
  path?: [number, number][];
};

export type Project = {
  status: "done" | "progress" | "planned";
  statusLabel: string;
  title: string;
  body: string;
  year: string;
  meta: string;
};

export type Business = {
  tag: string;
  name: string;
  body: string;
  founded: string;
  location: string;
};

export type Story = {
  title: string;
  body: string;
  soon: boolean;
};

export type DiasporaCountry = {
  flag: string;
  name: string;
  count: number;
  lat: number;
  lng: number;
};

export type Diaspora = {
  illustrative: boolean;
  note: string;
  total: number;
  countriesCount: number;
  home: { lat: number; lng: number; name: string };
  countries: DiasporaCountry[];
};

export type Greeting = { name: string; loc: string; text: string };

export type Greetings = {
  illustrative: boolean;
  note: string;
  items: Greeting[];
};

export type EventItem = {
  day: string;
  month: string;
  title: string;
  meta: string;
  recurring?: boolean;
  illustrative?: boolean;
};

export type Issue = {
  title: string;
  meta: string;
  status: "new" | "progress" | "done";
  statusLabel: string;
};

export type Issues = { illustrative: boolean; items: Issue[] };

export type Poll = {
  illustrative: boolean;
  question: string;
  votesLabel: string;
  options: { label: string; pct: number }[];
};

export type RoadmapItem = {
  num: string;
  title: string;
  body: string;
  live: boolean;
};

export type Site = {
  name: string;
  domain: string;
  tagline: string;
  location: {
    municipality: string;
    canton: string;
    settlements: string[];
    lat: number;
    lng: number;
    elevationM: number;
    note: string;
  };
  danMz: { month: number; day: number; foundedYear: number };
  stats: { value: string; label: string }[];
  live: { lastNews: string; lastNewsHref: string };
  sources: string[];
  disclaimer: string;
  roadmap: RoadmapItem[];
};

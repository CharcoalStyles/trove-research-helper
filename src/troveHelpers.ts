export type TroveZone =
  | "article"
  | "book"
  | "picture"
  | "music"
  | "map"
  | "newspaper"
  | "gazette";

export type TroveSearchResult = {
  response: {
    query: string;
    zone: Array<{
      name: TroveZone;
      records: Array<{
        s: string;
        n: number;
        total: number;
        next: string;
        nextStart: string;
        work: Array<TroveWork>;
      }>;
    }>;
  };
};

export type TroveRelevance = {
  score: number;
  value:
    | "very relevant"
    | "likely to be relevant"
    | "may have relevance"
    | "limited relevance"
    | "vaguely relevant";
};

export type TroveWork = {
  id: string;
  url: string;
  troveUrl: string;
  title:
    | string
    | {
        id: string;
        value: string;
      };
  contributor?: Array<string>;
  issued?: 2021;
  type?: Array<string>;
  holdingsCount?: number;
  versionCount?: number;
  relevance?: TroveRelevance;
  snippet?: Array<String>;
  page?: number;
  pageSequence?: number;
  heading?: string;
  category?: string;
  identifier?: Array<{
    type: "url";
    linktype: "fulltext" | "thumbnail" | "restricted";
    linktext?: string;
    value: string;
  }>;
};

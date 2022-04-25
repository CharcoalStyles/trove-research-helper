// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { TroveSearchResult } from "@src/troveHelpers";
import { ErrorResponse } from "@src/apiHelpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TroveSearchResult | ErrorResponse>
) {
  const { query, zone } = req.query;

  if (!query) {
    res.status(400).json({
      error: "Missing query",
    });
    return;
  }

  const response = await axios.get<TroveSearchResult>(
    "https://api.trove.nla.gov.au/v2/result",
    {
      params: {
        key: process.env.TROVE_API_KEY,
        q: query,
        zone: zone
          ? zone
          : [
              "article",
              "book",
              "picture",
              "music",
              "map",
              "newspaper",
              "gazette",
            ],
        encoding: "json",
        include: "work,relevance,snippet",
        order: "relevance",
        sort: "desc",
      },
    }
  );

  res.status(200).json(response.data);
}

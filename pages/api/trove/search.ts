// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { TroveSearchResult } from "@src/troveHelpers";
import { ErrorResponse } from "@src/apiHelpers";
import qs from "qs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TroveSearchResult | ErrorResponse>
) {
  const { query, zone } = req.query;
  console.log(query, zone);

  if (!query) {
    res.status(400).json({
      error: "Missing query",
    });
    return;
  }

  const params = {
    key: process.env.TROVE_API_KEY,
    q: query,
    zone: zone
      ? zone
      : ["article", "book", "picture", "music", "map"],
    encoding: "json",
    include: "work,relevance,snippet",
    order: "relevance",
    sort: "desc",
  };

  console.log({ params });

  const data = await axios
    .get<TroveSearchResult>("https://api.trove.nla.gov.au/v2/result", {
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "repeat" });
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error({ err: err.toJSON() });
    });

  if (data) {
    res.status(200).json(data);
  } else {
    res.status(500).json({
      error: "Unknown error",
    });
  }
}

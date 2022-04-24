// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, TroveItem } from "@prisma/client";
import { getProjectId } from "..";
import { ErrorResponse } from "../../../hello";

type GetResponseData = {
  items: Array<TroveItem>;
};

type PostResponseData = {
  item: TroveItem;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetResponseData | PostResponseData | ErrorResponse>
) {
  const projectId = getProjectId(req);

  if (projectId === -1) {
    res.status(400).json({
      error: "projectId must be a single value",
    });
    return;
  }

  const prisma = new PrismaClient();

  switch (req.method) {
    case "GET":
      const items = await prisma.troveItem.findMany({
        where: {
          projectId,
        },
      });
      res.json({ items });
      break;
    case "POST":
      const { name, description, url } = req.body;
      const item = await prisma.troveItem.create({
        data: {
          name,
          description,
          url,
          addedDate: new Date(),
          projectId: projectId,
        },
      });
      res.status(201).json({ item });
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

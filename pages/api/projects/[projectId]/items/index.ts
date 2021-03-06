// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, TroveItem } from "@prisma/client";
import {
  ErrorResponse,
  getProjectId,
  ItemResponseData,
  ListResponseData,
} from "@src/apiHelpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    ListResponseData<TroveItem> | ItemResponseData<TroveItem> | ErrorResponse
  >
) {
  const projectId = getProjectId(req);

  if (!projectId) {
    res.status(400).json({
      error: "ProjectId is required",
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

      if (!name || !description || !url) {
        res.status(400).json({
          error: "name, description, and url are required",
        });
        return;
      }

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

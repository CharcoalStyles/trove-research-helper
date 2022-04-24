// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Note } from "@prisma/client";
import {
  ErrorResponse,
  getProjectId,
  getTroveItemId,
  ItemResponseData,
  ListResponseData,
} from "@src/apiHelpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    ListResponseData<Note> | ItemResponseData<Note> | ErrorResponse
  >
) {
  const projectId = getProjectId(req);
  const troveItemId = getTroveItemId(req);

  if (!projectId) {
    res.status(400).json({
      error: "ProjectId is required",
    });
    return;
  }

  if (!troveItemId) {
    res.status(400).json({
      error: "Trove Item Id is required",
    });
    return;
  }

  const prisma = new PrismaClient();

  switch (req.method) {
    case "GET":
      const items = await prisma.note.findMany({
        where: {
          troveItemId,
        },
      });
      res.json({ items });
      break;
    case "POST":
      const { content } = req.body;

      if (!content) {
        res.status(400).json({
          error: "content is required",
        });
        return;
      }

      const item = await prisma.note.create({
        data: {
          content,
          troveItemId,
          addedDate: new Date(),
        },
      });
      res.status(201).json({ item });
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Note, PrismaClient, TroveItem } from "@prisma/client";
import {
  ErrorResponse,
  getNoteId,
  getProjectId,
  getTroveItemId,
  ItemResponseData,
} from "@src/apiHelpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ItemResponseData<Note> | ErrorResponse>
) {
  const projectId = getProjectId(req);
  const troveItemId = getTroveItemId(req);
  const noteId = getNoteId(req);

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

  if (!noteId) {
    res.status(400).json({
      error: "Note Id is required",
    });
    return;
  }

  const prisma = new PrismaClient();

  switch (req.method) {
    case "GET":
      const item = await prisma.note.findFirst({
        where: {
          AND: [{ troveItemId }, { id: noteId }],
        },
      });
      if (!item) {
        res.status(404).json({
          error: "Item not found",
        });
        return;
      }
      res.json({ item });
      break;
    case "PATCH":
      const { content } = req.body;

      if (!content) {
        res.status(400).json({
          error: "content is required",
        });
        return;
      }

      const updatedItem = await prisma.note.update({
        where: {
          id: noteId,
        },
        data: {
          content,
        },
      });
      res.json({ item: updatedItem });
      break;
    case "DELETE":
      const deletedItem = await prisma.note.delete({
        where: {
          id: noteId,
        },
      });
      res.json({ item: deletedItem });
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

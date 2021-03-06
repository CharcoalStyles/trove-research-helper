// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, TroveItem } from "@prisma/client";
import {
  ErrorResponse,
  getProjectId,
  getTroveItemId,
  ItemResponseData,
} from "@src/apiHelpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ItemResponseData<TroveItem> | ErrorResponse>
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
      const item = await prisma.troveItem.findFirst({
        where: {
          AND: [{ id: troveItemId }, { projectId }],
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
      const { name, description, url } = req.body;

      if (!name && !description && !url) {
        res.status(400).json({
          error: "name, description or url are required",
        });
        return;
      }

      const updatedItem = await prisma.troveItem.update({
        where: {
          id: troveItemId,
        },
        data: {
          ...(name ? { name } : {}),
          ...(description ? { description } : {}),
          ...(url ? { url } : {}),
        },
      });
      res.json({ item: updatedItem });
      break;
    case "DELETE":
      const deletedItem = await prisma.troveItem.delete({
        where: {
          id: troveItemId,
        },
      });
      res.json({ item: deletedItem });
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

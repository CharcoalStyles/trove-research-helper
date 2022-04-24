// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, TroveItem } from "@prisma/client";
import { ErrorResponse } from "../../../../hello";
import { getProjectId } from "../..";

type GetResponseData = {
  item: TroveItem;
};

export const getTroveItemId = (req: Pick<NextApiRequest, "query">): number => {
  const { troveItemId } = req.query;

  return troveItemId ? parseInt(troveItemId as string) : -1;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetResponseData | ErrorResponse>
) {
  const projectId = getProjectId(req);
  const troveItemId = getTroveItemId(req);

  if (projectId === -1) {
    res.status(400).json({
      error: "projectId must be a single value",
    });
    return;
  }

  if (troveItemId === -1) {
    res.status(400).json({
      error: "troveItemId must be a single value",
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
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

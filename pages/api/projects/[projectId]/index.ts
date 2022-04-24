// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Project } from "@prisma/client";
import { ErrorResponse, getProjectId, ItemResponseData } from "@src/apiHelpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ItemResponseData<Project> | ErrorResponse>
) {
  const projectId = getProjectId(req);

  if (!projectId) {
    res.status(400).json({
      error: "projectId is required",
    });
    return;
  }

  const prisma = new PrismaClient();

  switch (req.method) {
    case "GET":
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
        },
      });
      if (!project) {
        res.status(404).json({
          error: "Project not found",
        });
        return;
      }
      res.json({ item: project });
      break;
    case "PATCH":
      const { name } = req.body;
      if (!name) {
        res.status(400).json({
          error: "name is required",
        });
        return;
      }
      const updatedProject = await prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          name,
        },
      });
      res.json({ item: updatedProject });
      break;
    case "DELETE":
      const deletedProject = await prisma.project.delete({
        where: {
          id: projectId,
        },
      });
      res.json({ item: deletedProject });
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

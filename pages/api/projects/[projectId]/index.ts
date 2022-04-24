// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Project } from "@prisma/client";
import { ErrorResponse } from "../../hello";

type GetResponseData = {
  project: Project;
};

export const getProjectId = (req: Pick<NextApiRequest, "query">): number => {
  const { projectId } = req.query;

  return projectId ? parseInt(projectId as string) : -1;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetResponseData | ErrorResponse>
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
      res.json({ project });
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

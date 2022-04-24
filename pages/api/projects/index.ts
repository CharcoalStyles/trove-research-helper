// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Project } from "@prisma/client";

type GetResponseData = {
  projects: Array<Project>;
};

type PostResponseData = {
  project: Project;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetResponseData | PostResponseData>
) {
  const prisma = new PrismaClient();

  switch (req.method) {
    case "GET":
      const projects = await prisma.project.findMany();
      res.json({ projects });
      break;
    case "POST":
      const { name, description } = req.body;
      const project = await prisma.project.create({
        data: {
          name,
          description,
        },
      });
      res.status(201).json({ project });
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

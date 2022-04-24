// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Project } from "@prisma/client";
import {
  ErrorResponse,
  ItemResponseData,
  ListResponseData,
} from "@src/apiHelpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    ListResponseData<Project> | ItemResponseData<Project> | ErrorResponse
  >
) {
  const prisma = new PrismaClient();

  switch (req.method) {
    case "GET":
      const projects = await prisma.project.findMany();
      res.json({ items: projects });
      break;
    case "POST":
      const { name, description } = req.body;

      if (!name || !description) {
        res.status(400).json({
          error: "name and description are required",
        });
        return;
      }

      const project = await prisma.project.create({
        data: {
          name,
          description,
        },
      });
      res.status(201).json({ item: project });
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

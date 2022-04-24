import { NextApiRequest } from "next";

export type ListResponseData<T> = {
  items: Array<T>;
};

export type ItemResponseData<T> = {
  item: T;
};

export type ErrorResponse = {
  error: string;
};

export const getProjectId = (
  req: Pick<NextApiRequest, "query">
): number | undefined => {
  const { projectId } = req.query;

  return projectId ? parseInt(projectId as string) : undefined;
};

export const getTroveItemId = (
  req: Pick<NextApiRequest, "query">
): number | undefined => {
  const { troveItemId } = req.query;

  return troveItemId ? parseInt(troveItemId as string) : undefined;
};

export const getNoteId = (
  req: Pick<NextApiRequest, "query">
): number | undefined => {
  const { noteId } = req.query;

  return noteId ? parseInt(noteId as string) : undefined;
};

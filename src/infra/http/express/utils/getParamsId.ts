import { Request } from 'express';

export const getParamsId = (req: Request): string => {
  const idParam = req.params.id;

  return Array.isArray(idParam) ? idParam[0] : idParam;
};

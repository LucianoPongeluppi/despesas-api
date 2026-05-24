import { ZodObject, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateRequest =
  (schema: ZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse({
          body: req.body,
          params: req.params,
          query: req.query,
        });
        next();
      } catch (err) {
        if (err instanceof ZodError) {
          const simplified = err.issues.reduce((acc, issue) => {
            acc[issue.path.join('.')] = issue.message;

            return acc;
          }, {} as Record<string, string>);

          return res.status(400).json({
            data: {
              message: 'Validation error',
              errors: simplified,
            },
            success: false,
          });
        }
        next(err);
      }
    };

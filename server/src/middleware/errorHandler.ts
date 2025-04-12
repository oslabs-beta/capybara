// ------------------------------------------------------------------------------------------------
// > MIDDLEWARE - ERROR HANDLER < //
// ------------------------------------------------------------------------------------------------
import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err.stack); // Log the entire error stack
  res.status(500).send({
    message: 'Uh oh! Something went wrong! Take a nap and try again.',
    error: err.message,
  });
};

// ------------------------------------------------------------------------------------------------
// * MODULE EXPORT
// ------------------------------------------------------------------------------------------------
export default errorHandler;

// import { Request, Response, NextFunction } from "express";
// import { responseDTO } from "../dto/responseDTO.js";

// export const errorHandler = (
//   err: any,

//   req: Request,

//   res: Response,

//   next: NextFunction
// ) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Internal Server Error";
//   res.status(statusCode).json(responseDTO(statusCode, "error", null, message));
// };

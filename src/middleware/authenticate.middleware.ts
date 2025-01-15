// import logger from "../configs/logger.config.js";
// import { User } from "../model/index.js";
// import jwtService from "../service/jwt.service.js";

// /**
//  * Middleware to authenticate user requests
//  * @param {Object} req - Express request object
//  * @param {Object} res - Express response object
//  * @param {Function} next - Express next middleware function
//  * @returns {void}
//  */
// const authenticateMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void | Response<any, Record<string, any>>> => {
//   try {
//     const { authorization } = req.headers;
//     if (!authorization) {
//       return res.status(401).json({ message: "Access token is missing" });
//     }

//     const token = authorization.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({ message: "Access token is malformed" });
//     }

//     const decoded = jwtService.verifyAccessToken(token);
//     if (!decoded) {
//       return res.status(401).json({ message: "Invalid access token" });
//     }

//     if (typeof decoded !== "string" && "userId" in decoded) {
//       const user = await User.findById(decoded.userId);
//       if (!user) {
//         return res.status(401).json({ message: "Invalid access token" });
//       }
//       req.user = user;
//     } else {
//       return res.status(401).json({ message: "Invalid access token" });
//     }
//     next();
//   } catch (error) {
//     logger.error("Error in authenticateMiddleware:", error);
//     return res.status(401).json({ message: "Authentication failed" });
//   }
// };

// export default authenticateMiddleware;

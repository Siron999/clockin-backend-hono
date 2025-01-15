import { ResponseDTO } from "../types/types.js";

export const responseDTO = (
  status: number,
  message: string,
  data: any = null,
  error: any = undefined
): ResponseDTO => {
  const response: ResponseDTO = {
    status,
    message,
    ...(data !== null && { data }),
    ...(error !== undefined && { error }),
  };

  return response;
};

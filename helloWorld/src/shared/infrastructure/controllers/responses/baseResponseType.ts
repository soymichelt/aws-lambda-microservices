export type BaseResponseType = {
  statusCode?: number;
  body?: string;
  
  [key: string]: any;
};
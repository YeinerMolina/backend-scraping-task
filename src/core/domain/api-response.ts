export interface IApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
  path: string;
}
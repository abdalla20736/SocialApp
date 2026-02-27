export interface SingleDataResponse<T> {
  success: boolean;
  message: string;
  data: {
    entity: T;
  };
}

declare type TErrorCodes = {
  code: string;
  message: string;
};

declare type TMeta = {
  detail: string;
  errorCode?: string | null;
  errorCodes?: TErrorCodes[] | null;
  status: number;
  title: string;
};

declare type TResponse<T = object | null> = {
  value: {
    code: string;
    message: string;
    data: T | null;
  };
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
};

declare type TResponseData<T = object | null> = {
  code: string;
  message: string;
  data: T | null;
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
};

declare type TPagination<T = object | null> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
};

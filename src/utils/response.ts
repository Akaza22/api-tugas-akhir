type StatusType = 'success' | 'error';

interface ApiResponse {
  status: StatusType;
  message: string;
  data?: any;
  errors?: any;
  statusCode: number;
}

export const buildResponse = ({
  status,
  message,
  data = null,
  errors = null,
  statusCode
}: ApiResponse): ApiResponse => ({
  status,
  message,
  data,
  errors,
  statusCode
});

// Shortcut untuk success
export const success = (
  message: string,
  data: any = null,
  statusCode: number = 200
) => buildResponse({ status: 'success', message, data, statusCode });

// Shortcut untuk error
export const error = (
  message: string,
  errors: any = null,
  statusCode: number = 500
) => buildResponse({ status: 'error', message, errors, statusCode });

export const getErrorMessage = (status?: number, apiMessage?: string | string[]): string => {
  // Chuyển mảng tin nhắn thành chuỗi nếu cần
  const messageStr = Array.isArray(apiMessage) ? apiMessage.join(', ') : apiMessage;

  if (messageStr) {
    const msgLower = messageStr.toLowerCase();
    
    // Các lỗi liên quan đến xác thực (Auth)
    if (msgLower.includes('unauthorized') || msgLower.includes('invalid credentials') || msgLower.includes('mật khẩu không chính xác')) {
      return 'The email or password is incorrect.';
    }
    if (msgLower.includes('token expired') || msgLower.includes('jwt expired') || msgLower.includes('hết hạn')) {
      return 'Your session has expired. Please log in again.';
    }
    if (msgLower.includes('user not found') || msgLower.includes('không tìm thấy người dùng')) {
      return 'User information not found.';
    }
    if (msgLower.includes('already exists') || msgLower.includes('đã tồn tại')) {
      return 'This data already exists in the system.';
    }
    if (msgLower.includes('validation')) {
      return 'Invalid input. Please check and try again.';
    }
  }

  // Fallback map lỗi dựa trên HTTP status code
  switch (status) {
    case 400:
      return 'Invalid request. Please check the data and try again.';
    case 401:
      return 'You are not logged in or your session has expired.';
    case 403:
      return 'You do not have permission to access or perform this action.';
    case 404:
      return 'The requested data or page was not found.';
    case 408:
      return 'The request timed out. Please try again later.';
    case 409:
      return 'A data conflict occurred.';
    case 422:
      return 'The input data is not in the correct format.';
    case 429:
      return 'You have made too many requests. Please try again in a few minutes.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'The system is experiencing issues. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
};

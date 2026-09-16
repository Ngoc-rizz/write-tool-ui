export const getErrorMessage = (status?: number, apiMessage?: string | string[]): string => {
  // Chuyển mảng tin nhắn thành chuỗi nếu cần
  const messageStr = Array.isArray(apiMessage) ? apiMessage.join(', ') : apiMessage;

  if (messageStr) {
    const msgLower = messageStr.toLowerCase();
    
    // Các lỗi liên quan đến xác thực (Auth)
    if (msgLower.includes('unauthorized') || msgLower.includes('invalid credentials') || msgLower.includes('mật khẩu không chính xác')) {
      return 'Email hoặc mật khẩu không chính xác.';
    }
    if (msgLower.includes('token expired') || msgLower.includes('jwt expired') || msgLower.includes('hết hạn')) {
      return 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.';
    }
    if (msgLower.includes('user not found') || msgLower.includes('không tìm thấy người dùng')) {
      return 'Không tìm thấy thông tin người dùng.';
    }
    if (msgLower.includes('already exists') || msgLower.includes('đã tồn tại')) {
      return 'Dữ liệu này đã tồn tại trong hệ thống.';
    }
    if (msgLower.includes('validation')) {
      return 'Dữ liệu đầu vào không hợp lệ. Vui lòng kiểm tra lại.';
    }
  }

  // Fallback map lỗi dựa trên HTTP status code
  switch (status) {
    case 400:
      return 'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại dữ liệu.';
    case 401:
      return 'Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn.';
    case 403:
      return 'Bạn không có quyền truy cập hoặc thực hiện thao tác này.';
    case 404:
      return 'Không tìm thấy dữ liệu hoặc trang yêu cầu.';
    case 408:
      return 'Yêu cầu hết thời gian chờ. Vui lòng thử lại sau.';
    case 409:
      return 'Đã xảy ra xung đột dữ liệu.';
    case 422:
      return 'Dữ liệu đầu vào không đúng định dạng.';
    case 429:
      return 'Bạn đã thực hiện quá nhiều thao tác. Vui lòng thử lại sau ít phút.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.';
    default:
      return 'Đã có lỗi xảy ra. Vui lòng thử lại.';
  }
};

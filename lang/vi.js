export const transValidation = {
  EMAIL_INCORRECT: "Định dạng email không hợp lệ.",
  GENDER_INCORRECT: "Giới tính không hợp lệ.",
  PASSWORD_INCORRECT:
    "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và kí đặt biệt.",
  PASSWORD_CONFIRM_INCORRECT: "Nhập lại mật khẩu không chính xác.",
  UPDATE_USERNAME:"Username giới hạn trong khoảng 3-17 kí tự và không chứa kí tự đặc biệt (aA@123456)",
  UPDATE_GENDER:"Dữ liệu giới tính có vấn đề, bạn không xác định giới tính của mình ?",
  UPDATE_PHONE:"Số điện thoại bắt đầu bằng số 0, giới hạn trong khoảng 10-12 kí tự",
  UPDATE_ADDRESS:"Địa chỉ giới hạn trong khoảng 5-30 kí tự",
};
export const transErrorsMessage = {
  ACCOUNT_IN_USER: "Email này đã được sử dụng vui lòng sử dụng email khác !",
  ACCOUNT_REMOVED: "Tài khoản này đã bị vô hiệu hóa !",
  ACCOUNT_NOT_ACTIVE: "Tài khoản này chưa được kích hoạt vui lòng kiểm tra email của bạn !",
  TOKEN_UNDEFINED: "Token không hợp lệ !",
  LINK_ERROR: "Token không hợp lệ hoặc liên kết đã bị vô hiệu hóa",
  LOGIN_FAILED: "Tài khoản không tồn tại !",
  SERVER_ERROR:'Rất tiếc đã có lỗi vui lòng thử lại sau hoặc liên hệ với bộ phận hỗ trợ ):',
  AVATAR_TYPE:'Định dạng file không hợp lệ chỉ chấp nhận jpg, png hoặc jpeg !',
  IMAGE_LIMIT_SIZE_MESSAGE:'Kích thước file vượt quá 1MB, vui lòng thử lại !',
  ACCOUNT_UNDEFINED:"Tài khoản này không tồn tại !",
  PASSWORD_INCORRECT:"Mật khẩu tài khoản không chính xác !",
  CONFIRM_PASSWORD_INCORRECT:"Xác nhận mật khẩu không chính xác.",
  KEYWORD_SEARCH:"Từ khóa không được phép chứa giá trị đặc biệt !",
  GROUP_NAME : 'Tên cuộc trò chuyện yêu cầu tối thiểu 5 kí tự và có tối đa 30 kí tự !',
  MESSAGE_ERROR:"Tin nhắn gửi đi yêu cầu tối thiểu 1 ký tự và tối đa 400 ký tự",
  MESSAGE_ERROR_GROUP:"Không tồn tại người dùng hoặc nhóm trò chuyện vui lòng thử lại !",
  IMAGE_MESSAGE_TYPE:"Kiểu file không hợp lệ chỉ chấp nhận jpg, png hoặc jpeg"
};
export const transSuccess = {
  userCreated: userEmail => {
    return `  
    Tài khoản của Email <strong>${userEmail}</strong> đã được tạo, vui lòng kiểm tra email hoặc tìm trong mục spam để kích hoạt tài khoản ^^.
    Liên kết sẽ bị vô hiệu hóa trong vòng 1 giờ kể từ thời điểm này.
    `;
  },
  ACCOUNT_ACTIVE: "Kích hoạt tài khoản thành công !",
  ACCOUNT_LOGIN: "Đăng nhập thành công !",
  AVATAR_UPDATED:"Cập nhật avatar thành công !",
  USER_UPDATE_INFO:"Cập nhật thông tin thành công !",
  UPDATE_USERNAME:"Username giới hạn trong khoảng 3-17 kí tự và không chứa kí tự đặc biệt.",
  UPDATE_GENDER:"Dữ liệu giới tính có vấn đề, bạn không xác định giới tính của mình ?",
  UPDATE_PHONE:"Số điện thoại bắt đầu bằng số 0, giới hạn trong khoảng 10-12 kí tự",
  UPDATE_ADDRESS:"Địa chỉ giới hạn trong khoảng 5-30 kí tự",
  loginSuccess:(username)=>{
    return `Xin chào ${username}, chúc bạn một ngày mới tốt lành`
  },
  ACCOUNT_LOGOUT:'Đăng xuất thành công !',
  UPDATE_PASSWORD_SUCCESS:"Cập nhật mật khẩu thành công."
};
export const transMail = {
  SUBJECT: "Chat-app xác nhận kích hoạt tài khoản",
  template: link => `
 
  <h3>Vui lòng click vào <strong><a href="${link}" target="blank">đây</a></strong> để kích hoạt tài khoản ^^.</h3>
  <h4>Liên kết sẽ bị vô hiệu hóa trong vòng 1 giờ kể từ thời điểm này</h4>
  `,
  SEND_FAILED:
    "Có lỗi trong quá trình gửi mail, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi."
};

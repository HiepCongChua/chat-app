export const transValidation = {
  EMAIL_INCORRECT: "Định dạng email không hợp lệ.",
  GENDER_INCORRECT: "Giới tính không hợp lệ.",
  PASSWORD_INCORRECT:
    "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và kí đặt biệt.",
  PASSWORD_CONFIRM_INCORRECT: "Nhập lại mật khẩu không chính xác."
};
export const transErrorsMessage = {
  ACCOUNT_IN_USER: "Email này đã được sử dụng vui lòng sử dụng email khác !",
  ACCOUNT_REMOVED: "Tài khoản này đã bị vô hiệu hóa !",
  ACCOUNT_NOT_ACTIVE: "Tài khoản này chưa được kích hoạt vui lòng kiểm tra email của bạn !",
  TOKEN_UNDEFINED: "Token không hợp lệ !",
  LINK_ERROR: "Token không hợp lệ hoặc liên kết đã bị vô hiệu hóa",
  LOGIN_FAILED: "Tài khoản không tồn tại !",
  SERVER_ERROR:'Rất tiếc đã có lỗi vui lòng thử lại sau hoặc liên hệ với bộ phận hỗ trợ ): '
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
  loginSuccess:(username)=>{
    return `Xin chào ${username}, chúc bạn một ngày mới tốt lành`
  }
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

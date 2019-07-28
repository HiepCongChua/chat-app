export const transValidation = {
  EMAIL_INCORRECT: 'Định dạng email không hợp lệ',
  GENDER_INCORRECT: 'Giới tính không hợp lệ',
  PASSWORD_INCORRECT: 'Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và kí đặt biệt',
  PASSWORD_CONFIRM_INCORRECT: 'Nhập lại mật khẩu không chính xác',
}
export const transErrorsMessage = {
    ACCOUNT_IN_USER :  'Email này đã được sử dụng vui lòng sử dụng email khác !',
    ACCOUNT_REMOVED : 'Tài khoản này đã bị vô hiệu hóa !',
    ACCOUNT_NOT_ACTIVE : 'Tài khoản này chưa được kích hoạt thông qua email !'
}
export const transSuccess = {
  userCreated:(userEmail)=>{
    return `Tài khoản của Email <strong>${userEmail} đã được tạo, vui lòng kiểm tra email để kích hoạt tài khoản ^^</strong>`
  }
}
import {check} from 'express-validator/check';
import {transValidation, transErrorsMessage} from './../../lang/vi';
let udpateInfoValidation = [
    check('username',transValidation.UPDATE_USERNAME)
    .optional()
    .isLength({min:3,max:17})
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)
    ,
    check('gender',transValidation.UPDATE_GENDER)
    .optional()
    .isIn(['male','female']),
    check('address',transValidation.UPDATE_ADDRESS)
    .optional()
    .isLength({min:5,max:30})
    ,
    check('phone',transValidation.UPDATE_PHONE)
    .optional()
    .matches(),
    check('address',transValidation.UPDATE_ADDRESS)
    .optional(/^(0)[0-9]{9,10}$/)
    .isLength({min:5,max:30})
];
let updatePasswordValidation = [
    check('currentPass',transErrorsMessage.PASSWORD_INCORRECT)
    .isLength({min:8})
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
    check('newPass',transValidation.PASSWORD_INCORRECT)
    .isLength({min:8})
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
    check('confirmPass',transErrorsMessage.CONFIRM_PASSWORD_INCORRECT)
    .custom((value,{req})=>{
        return value === req.body.newPass
    }),
];
export  {
    udpateInfoValidation,
    updatePasswordValidation
};



import {check} from 'express-validator/check';
import {transErrorsMessage} from './../../lang/vi';
const checkGroupNameValidation = [
    check('groupChatName',transErrorsMessage.GROUP_NAME)
    .isLength({min:5,max:30})
];
export {
    checkGroupNameValidation
}
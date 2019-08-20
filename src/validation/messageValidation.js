
import {check} from 'express-validator/check';
import {transValidation, transErrorsMessage} from './../../lang/vi';
let checkMessageValidation = [
    check('messageVal',transErrorsMessage.MESSAGE_ERROR)
    .isLength({min:1,max:400})
];
export {
    checkMessageValidation
}
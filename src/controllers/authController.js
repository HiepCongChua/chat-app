  import {validationResult} from 'express-validator/check'
  const getLoginRegister = (req, res, next) => {
    return res.render('auth/master');
};
  const postRegister = (req,res,next)=>{
    const errorArr = [];
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty())
    {
      const errors = Object.values(validationErrors.mapped());
      errors.forEach(item=>{
       errorArr.push(item.msg)
      });
      console.log(errorArr);
      return;
    }
    console.log(req.body);
  }
export default {
    getLoginRegister,
    postRegister
}


function errorHandler(err, req, res, next) {
  let msg = '';
  let code = '';
  const errors = []
  
  switch (err.name) {
    case 'SequelizeValidationError':
      err.errors.forEach((el) => {
        errors.push(el.message);
      });
      code = 400;
      msg = `${errors}`;
      break;
    case 'SequelizeUniqueConstraintError':
      err.errors.forEach((el) => {
        errors.push(el.message);
      });
      code = 400;
      msg = `Not Unique! ${errors}`;
      break;

    case 'Wrong Email or Password':
      code = 404;
      msg = 'Wrong Email or Password';
      break;

    case 'Unauthenticated':
      code = 401;
      msg = 'Unauthenticated. You need to login first';
      break;

    case 'Not Authorized':
      code = 403;
      msg = 'You are not Authorized';
      break;

    default:
      code = 500;
      msg = err.message;
      next()
      break;
  }

  return res.status(code).json({code, msg, data: err });
}

module.exports = errorHandler;

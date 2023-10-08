const userRouter = require('express').Router();
const UserController = require('../controllers/userControllers');
const { authorization, authentification } = require('../middleware/Auth');

userRouter.post('/register', UserController.register);
userRouter.post( '/login', UserController.login );
userRouter.get('/google', UserController.googleSignIn)

userRouter.use(authentification);
userRouter.put('/:id', UserController.updateUser);
userRouter.get('/me', UserController.getCurrentUser);

userRouter.use(authorization);
userRouter.get('/', UserController.list);
userRouter.delete('/:id', UserController.deleteUser);

module.exports = userRouter;

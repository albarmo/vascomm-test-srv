const router = require('express').Router();
const userRouter = require('./userRouter');
const productRouter = require('./productRouter');


router.use('/user', userRouter);
router.use('/products', productRouter);

module.exports = router;

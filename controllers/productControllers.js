const {Product} = require( '../models' );
const { Op } = require('sequelize');
const uploader = require( '../helpers/uploader' );

class ProductController
{
  static async list( req, res, next ){
    const {limit, keyword, status, offset} = req.query
    
    let params = {}
    if (status) {
      params = {status}
    }

    if ( keyword ) {
      params.title = {[Op.like]: `%${keyword}%`}
    }

    try {
      const data = await Product.findAll({
        where: {
         ...params
        },
        limit: limit || 10,
        offset: offset || 0,
        order: [['createdAt', 'ASC']],
      });
      if (data) {
        return res.status(200).json({code:'200', message:'OK', data });
      }
    } catch (error) {
      next(error);
    }
  }

  static create(req, res, next) {
    try {
      const upload = uploader('PRODUCT_IMAGE').fields([{ name: 'image' }]);
      upload(req, res, (err) => {
        if (err) {
          return res.status(500).json({ msg: err });
        }
        const { image } = req.files;
        const imagePath = image ? '/' + image[0].filename : null;

        let inputData = {
          title: req.body.title,
          status: !!req.body.status,
          image: imagePath,
          price: req.body.price,
        };

        Product.create(inputData)
          .then((data) => {
            return res.status(201).json({code:'200', message:'OK', data });
          })
          .catch((error) => {
            return res.status(500).json({ message: error });
          });
      });
    } catch ( error ) {
      next(error);
    }
  }

  static update(req, res, next) {
    try {
      const idProduct = req.params.id;
      const upload = uploader('PRODUCT_IMAGE').fields([{ name: 'image' }]);
      upload(req, res, (err) => {
        if (err) {
          return res.status(500).json({ msg: err });
        }
        const { image } = req.files;
        const imagePath = image ? '/' + image[0].filename : null;

        let inputDataUpdate = {
          title: req.body.title,
          status: !!req.body.status,
          image: imagePath,
          price: req.body.price,
        };
        Product.update(inputDataUpdate, {
          where: {
            id: idProduct,
          },
          returning: true,
        })
          .then((data) => {
            return res.status(200).json({code:'200', message:'OK', data });
          })
          .catch((error) => {
            return res.status(500).json({code: '500', message: error, data: idProduct });
          });
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    const idProduct = req.params.id;
    const product = await Product.findOne({ where: { id: idProduct } });
    try {
      if (!product) {
        return res.status(404).json({ message: 'product data not found!' });
      } else {
        const deleteProduct = await Product.destroy({
          where: {
            id: idProduct,
          },
          returning: true,
        });
        if (deleteProduct) {
          return res.status(200).json({code: '200', msg: `sucess deleted products ${idProduct}`,data: deleteProduct });
        }
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;

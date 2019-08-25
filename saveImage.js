const Product = require('../models/products');
const moment = require('moment');
const cloudinary = require('cloudinary').v2;
const { validationResult } = require('express-validator/check');
const path = require('path');
const DataUri = require('datauri');
const dUri = new DataUri();
let ITEM_PER_PAGE = 4;//Số sản phẩm trên 1 trang
cloudinary.config({ 
  cloud_name: 'hoasao', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
exports.postProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const { title, author, topic, des, price, releaseTime } = req.body;
    const img = req.file;
    if (!img) {
      return res.status(422).render('admin/add-product', {
        pageTitle: 'Add product',
        path: '/admin/add',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
        editing: false,
        hasError: true,
        releaseTime: formatTime(releaseTime),
        product: {
          title: title,
          price: price,
          description: des,
          author: author,
          topic: topic,
          releaseTime: formatTime(releaseTime)
        },
        error: 'Attached file is not an image',
        validationErrors: [],
      });
    }
    if (!errors.isEmpty()) {
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Add product',
        path: '/admin/add',
        activeAddProduct: true,
        editing: false,
        hasError: true,
        releaseTime: formatTime(releaseTime),
        product: {
          title: title,
          price: price,
          description: des,
          author: author,
          topic: topic,
          releaseTime: releaseTime
        },
        error: errors.array()[0].msg,

        validationErrors: errors.array()
      });
    };
    const file = dataUri(req).content;
    const imageInfo = await cloudinary.uploader.upload(file);
    const imageId = imageInfo.public_id;
    const imageUrl = imageInfo.secure_url.replace('upload','upload/c_fill,h_600,w_400/');
    const product = new Product(
      {
        title: title,
        price: price,
        author: author,
        imageId:imageId,
        topic: topic,
        description: des,
        imageUrl: imageUrl,
        userId: req.user._id,
        releaseTime: releaseTime
      })
    await product.save();
    return res.redirect('/admin/products');
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
exports.editGetProduct = async (req, res, next) => {
  try {
    const id_ = req.params.id;
    const product = await Product.findById(id_);
    return res.render('admin/edit-product', {
      pageTitle: 'Edit product',
      path: '/admin/addProduct',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
      editing: true,
      product: product,
      releaseTime: formatTime(product.releaseTime),
      error: null,
      hasError: false,
      validationErrors: []
    })
  } catch (error) {
    const err = new Error(error);
    error.httpStatusCode = 500;
    return next(err);
  }
};
exports.editPostProduct = async (req, res, next) => {
  try {
    console.log(process.env.CLOUDINARY_API_KEY);
    console.log(process.env.CLOUDINARY_API_SECRET);
    const { prodId, author, topic, title, des, price, releaseTime , imageId } = req.body;
    const image = req.file;
    if (!image) {//Trường hợp lỗi xảy ra khi chưa có ảnh được tải lên hoặc tải lên không đúng định dạng (PNG viết kiểu in sẽ bị lỗi vì regex phân biệt hoa thường)
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Add product',
        path: '/admin/add',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
        editing: false,
        hasError: true,
        releaseTime: releaseTime,
        product: {
          title: title,
          price: price,
          description: des,
          author: author,
          topic: topic,
        },
        error: 'Attached file is not an image',
        validationErrors: [],

      });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Edit product',
        path: '/admin/add',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
        editing: true,
        hasError: true,
        product: {
          title: title,
          author: author,
          topic: topic,
          price: price,
          description: des,
          _id: id_,
          imageUrl: image.path,
          releaseTime: releaseTime
        },
        error: errors.array()[0].msg,
        validationErrors: errors.array()
      });
    }
    await cloudinary.uploader.destroy(imageId);
    const file = dataUri(req).content;
    const imageInfo = await cloudinary.uploader.upload(file);
    imageUrl = imageInfo.secure_url.replace('upload','upload/c_fill,h_600,w_400/');;
    req.body = {...req.body,imageUrl};
    const result =  await Product.findByIdAndUpdate(prodId,{title,author,releaseTime,topic,price,description:des
      ,imageUrl:req.body.imageUrl}, { new: false,runValidators: true,seFindAndModify: false});
    if(!result)
    {
      return res.status(500).json({ message: 'Update product failed.' });
    }
    return res.redirect('/admin/products');
  }
  catch (error) {
    const err = new Error(error);
    error.httpStatusCode = 500;
    console.log(error);
    return next(err);
  }
}
exports.deleteProduct = async (req, res, next) => {
  try {
    const id_ = req.params.prodId;
    const product = await Product.findById(id_);
    if (!product) {
      return next(new Error('Product not found !'));
    }
    product.hasDelete = true;
    await product.save();
    res.status(200).json({ message: 'Sucess!' });
  } catch (error) {
    console.log('ERROR :', error);
    res.status(500).json({ message: 'Deleting product failed.' });
  }
};
exports.getProducts = async (req, res, next) => {
  try {
    let page = + req.query.page || 1;//Dựa vào query để lấy giá trị dùng để phân trang (mặc định là 1)
    let totalItems;
    const number = await Product.find({ userId: req.user._id, hasDelete: false }).populate('userId').countDocuments();
    totalItems = number;
    let products = await Product.find({ userId: req.user._id, hasDelete: false }).populate('userId').skip((page - 1) * ITEM_PER_PAGE).limit(ITEM_PER_PAGE);
    //Bỏ đi bao nhiêu sản phầm đầu tiên (ví dụ đang ở trang 1 thì ta bỏ đi
    // (1-1)*2 = 0 sản phẩm
    //(2-1)*2 = 2 sản phẩm
    //(3-1)*2 = 4 sản phẩm
    // Mỗi lần lấy bao nhiêu document
    
    return res.render('admin/admin-products',
      {
        count: 1,
        prods: products,
        pageTitle: 'List product',
        path: '/admin/products',
        activeShop: true,
        productCSS: true,
        totalProducts: totalItems,//Tổng sản phẩm
        currentPage: page,//page hiện tại
        hasNextPage: parseInt(ITEM_PER_PAGE) * parseInt(page) < parseInt(totalItems),//có page tiếp theo hay không (số sản phẩm tiêu chuẩn trong 1 page * số thứ tự trang hiện tại )
        hasPreviousPage: parseInt(page) > 1,//Có page tiếp theo hay không
        nextPage: parseInt(page) + 1,//page liền trước
        previousPage: parseInt(page) - 1,//page liền sau
        lastPage: Math.ceil(totalItems / ITEM_PER_PAGE)//page cuối cùng (hàm math.ceil trả về số nguyên nhỏ nhất lớn hơn hoặc bằng tham số đầu vào) (lấy tổng số sản phẩm / số sản phẩm trên một trang Ví dụ có totalItem = 13 , itemPerpage = 3 , result = 4.333 thì sẽ có 4 trang 3 sản phẩm và trang cuối cùng có 1 sản phẩm)
      });
  } catch (err) {
    console.log(err, '')
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
const dataUri = (req)=>{//Hàm chuyển đổi buffer sang kiểu image
   return  dUri.format(path.extname(Date.now()+req.file.originalname).toString(),req.file.buffer);
};
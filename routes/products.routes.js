const express = require ('express');
//const authenticate = require('../helpers/authenticate');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/products');


const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const fileSplit = file.originalname.split('.');
        const filename = file.fieldname + "-" + Date.now() + "." + fileSplit[fileSplit.length - 1];

        cb(null, filename);
    }
});

const upload = multer({ storage });


router.get('/', async( req, res) => {
    res.json({
        data: await Product.find()
    });
});


router.get('/search', async (req, res) => {
    const { productName, productPrice } = req.query;
    res.json({
        products: await Product.find({
            // AND operation
            productName: new RegExp(productName, 'i'),
            productPrice: new RegExp(productPrice,'i')          
        })
    });
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id)
        if (product) {
            res.json({
                data: product
            });
        } else {
            res.status(404).json({
                msg: 'Product not found'
            });
        }
    } catch (err) {
        res.status(400).json({
            data: err
        });
    }
});


router.post('/', async (req,res) => {
    const { productName, productType, productPrice, productImage, productDesc, rating } = req.body;
    try {
        const product = new Product({
            productName,
            productType,
            productPrice,
            productImage,
            productDesc,
            rating
        });

        const savedProduct = await product.save();    
        res.status(201).json({
            data: savedProduct
        });
    } catch (err) {
        res.status(400).json({
            data: err
        });
    }
});

router.post('/upload', upload.single('productImage'), (req, res) => {
    console.log(req.file);
    res.json({
        message: 'File uploaded successfully.'
    })
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { productName, productType, productPrice, productImage, productDesc, rating } = req.body;
    try {
        const product = await Product.findById(id);
        if (product) {
            product.productName = productName;
            product.productType = productType;
            product.productPrice = productPrice;
            product.productImage = productImage;
            product.productDesc = productDesc;
            product.rating = rating;
            res.json({
                data: await product.save()
            });
        } else {
            res.status(404).json({
                msg: 'Product not found'
            });
        }
    } catch (err) {
        res.status(400).json({
            data: err
        });
    }
});

router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { productName, productType, productPrice, productImage, productDesc, rating } = req.body;
    try {
        const product = await Product.findById(id);
        if (product) {
            if (productName !== undefined) {
                product.productName = productName;
            }
            if (productType !== undefined) {
                product.productType = productType;
            }
            if (productPrice !== undefined) {
                product.productPrice = productPrice;
            }
            if (productImage !== undefined) {
                product.productImage = productImage;
            }
            if (productDesc !== undefined) {
                product.productDesc = productDesc;
            }
            if (rating !== undefined) {
                product.rating = rating;
            }
            res.json({
                data: await product.save()
            });
        } else {
            res.status(404).json({
                msg: 'Product not found'
            });
        }
    } catch (err) {
        res.status(400).json({
            data: err
        });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // await User.findByIdAndDelete(id);
        const product = await Product.findById(id);
        if (product) {
            await product.delete();
            res.sendStatus(204);
        } else {
            res.status(404).json({
                msg: 'Product not found'
            });
        }
    } catch (err) {
        res.status(400).json({
            data: err
        });
    }
});

module.exports = router;

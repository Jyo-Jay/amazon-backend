const express = require ('express');
const router = express.Router();
const Cart = require('../models/cart');
//const User = require ('../models/user');
//const Product = require ('../models/products');

router.get('/', async( req, res) => {
    res.json({
        data: await Cart.find()
    });
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const cart = await Cart.findById(id)
        if (cart) {
            res.json({
                data: cart
            });
        } else {
            res.status(404).json({
                message: 'Cart Not Available'
            });
        }
    } catch (err) {
        res.status(400).json({
            data: err
        });
    }
});

router.post('/', async(req,res)=>{
    const { userid, product, productQuantity } = req.body;
    try{
        console.log('gyhg')
        const cart = new Cart({
            user: userid,
            cartItems:[{
                product:product,
                productQuantity:productQuantity
            }]
           
        });console.log(cart)
            const savedCart = await cart.save();
        res.status(201).json({
            data: savedCart
        });
    }catch(err){
        res.status(400).json({
            data: err
        });
    }

});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const cart = await Cart.findById(id);
        if (cart) {
            await cart.delete();
            res.sendStatus(204);
        } else {
            res.status(404).json({
                message: 'Cart not Available'
            });
        }
    } catch (err) {
        res.status(400).json({
            data: err
        });
    }
});



module.exports = router;
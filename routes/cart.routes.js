const express = require ('express');
const router = express.Router();
const Cart = require('../models/cart');

router.get('/', async( req, res) => {
    res.json({
        data: await Cart.find()  
    });
});

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        
        const cart = await Cart.find({ userId:{ $eq : userId } })
        //const user = await User.findById(userId)
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

router.get('/viewCart/:userId', async(req,res)=>{
    const { userId } = req.params;
    try {
        const cart = await Cart.find({ userId:{ $eq : userId } })
       //  console.log(cart[0].id);
        const cartView = await Cart.findById(cart[0].id).populate('items.productId',{__v:0});
       // console.log(cartView)

        if (cartView) {
            res.json({
                data: cartView
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


router.post('/', async (req,res)=>{
    const { userId, productId, quantity } = req.body;

    try{
        const cart = new Cart();        
               
        cart.items.push({ productId: productId, quantity: quantity })
        cart.userId = userId                  

        const savedCartData = await cart.save();
        res.status(200).json({
            type: "success",
            message: "Process Successful",
            data: savedCartData
        })
    }

    catch(err){
        res.status(400).json({
            data: err
        });
    }

});
    
router.put('/updateCart/:userId', async (req, res) => {
    const { userId } = req.params;
    const { cartItems} = req.body;
    try {

        const cart1 = await Cart.find({ userId:{ $eq : userId } });
       // console.log(cart1[0].id);
        const cart = await Cart.findById(cart1[0].id)
      //  console.log(cart)
        if (cart) {
            console.log(cart)
            cart.items= cartItems;
            res.json({
                data: await cart.save()
            });
        } else {
            res.status(404).json({
                msg: 'Cart Not Available'
            });
        }

    } catch (err) {
        res.status(400).json({
            data: err
        });
    }
});


router.delete('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const cartId = await Cart.find({ userId:{ $eq : userId } }) 

        const cart = await Cart.findById(cartId[0].id);
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
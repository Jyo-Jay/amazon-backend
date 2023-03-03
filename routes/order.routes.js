const express = require('express');
const router = express.Router();
const Order = require('../models/order');

router.get('/', async( req,res) => {
    res.json({
        data: await Order.find()  
    });
})

router.post('/', async (req,res) =>{
    const { userId, items } = req.body;

    try{
        const order = new Order();        
               
        order.items = items;
        order.userId = userId     

        const savedOrderData = await order.save();
        res.status(200).json({
            type: "success",
            message: "Process Successful",
            data: savedOrderData
        })
    }

    catch(err){
        res.status(400).json({
            data: err
        });
    }

});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id);
        if (order) {
            await order.delete();
            res.sendStatus(204);
        } else {
            res.status(404).json({
                message: 'No orders are generated'
            });
        }
    } catch (err) {
        res.status(400).json({
            data: err
        });
    }
});

module.exports = router;

const express = require ('express');
const router = express.Router();
const User = require('../models/user')
const jwt = require ('jsonwebtoken');
const SECRET = process.env.SECRET;
//const authenticate = require ('../helpers/authenticate');


router.get('/', async (req, res) => {
    res.json({
        data: await User.find({}, { password: 0, __v: 0})
    });
});

router.get('/search', async (req, res) => {
    const { firstName, address } = req.query;
    res.json({
        users: await User.find({
            // AND operation
            firstName: new RegExp(firstName, 'i'),
            address: new RegExp(address,'i')          
        }, { password: 0, __v: 0 })
    });
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id, { password: 0, __v: 0 })
      //  .populate('Cart');
        if (user) {
            res.json({
                data: user
            });
        } else {
            res.status(404).json({
                msg: 'User not found'
            });
        }
    } catch (err) {
        res.status(400).json({
            data: err
        });
    }
});


router.post('/', async (req,res) => {
    const { firstName, lastName, address, email, password } = req.body;
    try {
        const user = new User({
            name: {
                first: firstName,
                last: lastName
            },
            address,
            email,
            password
        });

        const savedUser = await user.save();
        savedUser.password = undefined;
    
        res.status(201).json({
            data: savedUser
        });
    } catch (err) {
        res.status(400).json({
            data: err
        });
    }
});



router.post('/login',async(req,res)=>{
    const {email, password} = req.body;
    const user = await User.findOne({ email });
    if(user){
        user.comparePassword(password,(err, isMatch)=> {
            if(err){
                return res.status(500).json({
                    message: err
                });
        }

        if(isMatch)
            {
             const token = jwt.sign({ id:user._id}, SECRET,{ 
                expiresIn:'1d'      //we can use '20s','5m','120' <=> 120ms,'2h' for the expiresIn
                }); 
                res.json({
                    message:'Login successfull',
                    userid : user._id,
                    token
                });
            }else{
                res.status(400).json({
                    message:'Invalid Password or email'
                });

            }
    });
        
    }else{
            res.status(400).json({
            message:'Invalid Password or email'
            });
        }
});



router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, address, email} = req.body;
    try {
        const user = await User.findById(id);
        if (user) {
            user.name.first = firstName;
            user.name.last = lastName;
            user.address = address;
            user.email = email;
            res.json({
                data: await user.save()
            });
        } else {
            res.status(404).json({
                msg: 'User not found'
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
    const { firstName, lastName, address, email } = req.body;
    try {
        const user = await User.findById(id);
        if (user) {
            if (firstName !== undefined) {
                user.name.first = firstName;
            }
            if (lastName !== undefined) {
                user.name.last = lastName;
            }
            if (address !== undefined) {
                user.address = address;
            }
            if (email !== undefined) {
                user.email = email;
            }
            res.json({
                data: await user.save()
            });
        } else {
            res.status(404).json({
                msg: 'User not found'
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
        const user = await User.findById(id);
        if (user) {
            await user.delete();
            res.sendStatus(204);
        } else {
            res.status(404).json({
                msg: 'User not found'
            });
        }
    } catch (err) {
        res.status(400).json({
            data: err
        });
    }
});

module.exports = router;


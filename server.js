const express = require ('express');
const server = express();
const mongoose = require('mongoose');
const cors = require('cors');
//const bodyParser = require('body-parser');


require('dotenv').config();

const PORT = process.env.PORT;

const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/products.routes');
const cartRoutes = require ('./routes/cart.routes');


server.use('/static',express.static(__dirname + '/public'));
server.use('/uploads',express.static(__dirname + '/uploads'));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());

// server.use(bodyParser.urlencoded({ extended: false }));
// server.use(bodyParser.json());

server.use('/users', userRoutes);
server.use('/products', productRoutes);
server.use('/cart',cartRoutes);


(async function() {
  try{
      await mongoose.connect(process.env.DB_STRING);
      console.log("Database connection is successfull");
  }catch(err){
      console.log(err);
  }

})();

server.get('/', (req, res) => {
  res.json({
     'msg':'Hello Amazon'
  });
});

//wild card route
server.get('**',(req,res)=>{
  //res.status(404).send('Page Not Found !');
  res.sendStatus(404);

});

server.use((err,req,res,next)=>{
  res.sendStatus(500);
});

server.listen(PORT,()=>{
  console.log(`server is running on http://localhost:${PORT}`);
});


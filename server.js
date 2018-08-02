
// setting up the variables for modules
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');
const router = express.Router();
const port = process.env.PORT || 5000;

dotenv.config();

const app = express();

app.use(morgan('dev'));

app.use(bodyParse.urlencoded({extended: false}));
app.use(bodyParse.json());

//settings for views rendering
app.use(express.static('public'));
app.set('view engine', 'pug');
app.get('/', (req ,res)=>{
     res.render(__dirname + '/views/index.pug');
});


/* settings to render react client

app.use(express.static(path.join(__dirname + '/client/build/')));
app.get('/api/hello',(req,res)=>{

      res.sendFile(path.join(__dirname + '/client/build/index/.html') );

});

*/



mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MLAB_URI,{promiseLibrary: require('bluebird'), useNewUrlParser: true });
let db = mongoose.connection;

db.on('error', console.error.bind(console,'connection error for db'));

db.once('open',()=>{
    console.log('database running');
});

const api =  require('./routes/exercise');
app.use('/api/exercise/',api);

app.use((req,res,next)=>{
        return next({status: 404, message: 'not found man'});
});

//
app.use((err,erq,res,next)=>{
         let errCode, errMessage;
          //mongoose validation error
         if(err.errors){
              errCode = 400;
              const keys = Object.keys(err.errors);
              errMessage = err.errors[keys[0]].message
        } else {
            errCode = err.status || 500;
            errMessage = err.message || 'internal server error';
        }
        res.status(errCode).type('txt').send(errMessage);
});

 
app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});
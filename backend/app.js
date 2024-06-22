//start
const Joi = require('joi');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

//module file
//const testRouter = require('./module/test');

//start up with express
const app = express();
app.use(express.json());   //for post-express call
app.use(cors());
app.use(cookieParser());

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

//content
app.get('/', (req, res)=> {
    res.send('Hello World');
});



//content.login
//app.use('/test', testRouter);

//end
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening to PORT', port));

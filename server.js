const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 5000;


app.get('/api/hello',(req,res)=>{

      res.send({msg:'Hello!'});

});


app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});
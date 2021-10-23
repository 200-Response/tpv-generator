const express = require('express');
const app = express();
const port = 3200;
const fs = require('fs');


app.use(express.json({ strict: false, limit: "20mb" }));

    
app.get('/status',(req,res) =>{
    res.json('STATUS OK');
});

app.get('/comercio/:serialNumber',(req,res)=>{
    let serialNumber = req.params.serialNumber;
    let comercios = require('./comercios.json');
    console.log('serialNumber', serialNumber, 'totalComercios', comercios.length);
    let found = comercios.find( item => item.serialNumberTpv == serialNumber );
	if(!found){
		found = {};
	}
    res.json(found);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
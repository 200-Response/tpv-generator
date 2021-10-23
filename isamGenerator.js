const express = require('express');
var faker = require('faker');
const app = express();
const port = 3300;
const fs = require('fs');

faker.locale = "es_MX";

app.use(express.json({ strict: false, limit: "20mb" }));

    
app.get('/status',(req,res) =>{
    res.json('STATUS OK');
});
 
let estados =
[
	{name:'activo'},
	{name:'inactivo'},
	{name:'dañada'},
	{name:'en reparación'},
	{name:'nuevo'},
	{name:'reacondicionado'},
];
let modelo = [
	{name:"move2500"},
	 {name:"verifone"},
	 {name:"vx520"},
	 {name:"680"}
]
let equipo =[
	{name:"desktop"},
	{name:"portable"},
	{name:"retail"}
]

const getModelo = ()=>{
	return modelo[Math.floor( Math.random() * modelo.length ) ].name;
}

const getEquipo = ()=>{
	return equipo[Math.floor( Math.random() * equipo.length ) ].name;
}

const getEstado = () =>{
    //toDo filter allowed Status
    return estados[Math.floor(Math.random() * estados.length)].name;
};

app.post('/isamData',async (req, res) => {
    let total = req.body.total;
    let isamArray = [];
    let isam = {
       
    }
    
    for(let i=0;i<=total;i++){
        isam = {};
		isam.serie = `MX0000_${i}`;
		isam.equipo = getEquipo();
		isam.marca = "ingenico";
		isam.modelo = getModelo();
		isam.estatus = getEstado();
        isamArray.push(isam);
        console.log(isam);
    }

    let data = JSON.stringify(isamArray);
    fs.writeFileSync('isam.json', data, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
    res.json('finished');
})


app.get('/isam/:serialnumber',(req,res)=>{
    let serialNumber = req.params.serialnumber;
    let isam = require('./isam.json');
    console.log('serialnumber',serialNumber,'totalTPV',isam.length);
    let found = isam.find( item => item.serie == serialNumber );
    res.json(found);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
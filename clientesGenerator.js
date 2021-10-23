const express = require('express');
var faker = require('faker');
const app = express();
const port = 3100;
const AWS = require('aws-sdk');
const { fake } = require('faker');
const fs = require('fs');

faker.locale = "es_MX";

app.use(express.json({ strict: false, limit: "20mb" }));

    
app.get('/status',(req,res) =>{
    res.json('STATUS OK');
});
 
let estados =
[
	{
		"name": "Distrito Federal",
		"code": "MX-DIF",
		"subdivision": "federal district"
	},
	{
		"name": "Aguascalientes",
		"code": "MX-AGU",
		"subdivision": "state"
	},
	{
		"name": "Baja California",
		"code": "MX-BCN",
		"subdivision": "state"
	},
	{
		"name": "Baja California Sur",
		"code": "MX-BCS",
		"subdivision": "state"
	},
	{
		"name": "Campeche",
		"code": "MX-CAM",
		"subdivision": "state"
	},
	{
		"name": "Chiapas",
		"code": "MX-CHP",
		"subdivision": "state"
	},
	{
		"name": "Chihuahua",
		"code": "MX-CHH",
		"subdivision": "state"
	},
	{
		"name": "Coahuila",
		"code": "MX-COA",
		"subdivision": "state"
	},
	{
		"name": "Colima",
		"code": "MX-COL",
		"subdivision": "state"
	},
	{
		"name": "Durango",
		"code": "MX-DUR",
		"subdivision": "state"
	},
	{
		"name": "Guanajuato",
		"code": "MX-GUA",
		"subdivision": "state"
	},
	{
		"name": "Guerrero",
		"code": "MX-GRO",
		"subdivision": "state"
	},
	{
		"name": "Hidalgo",
		"code": "MX-HID",
		"subdivision": "state"
	},
	{
		"name": "Jalisco",
		"code": "MX-JAL",
		"subdivision": "state"
	},
	{
		"name": "Michoacán",
		"code": "MX-MIC",
		"subdivision": "state"
	},
	{
		"name": "Morelos",
		"code": "MX-MOR",
		"subdivision": "state"
	},
	{
		"name": "México",
		"code": "MX-MEX",
		"subdivision": "state"
	},
	{
		"name": "Nayarit",
		"code": "MX-NAY",
		"subdivision": "state"
	},
	{
		"name": "Nuevo León",
		"code": "MX-NLE",
		"subdivision": "state"
	},
	{
		"name": "Oaxaca",
		"code": "MX-OAX",
		"subdivision": "state"
	},
	{
		"name": "Puebla",
		"code": "MX-PUE",
		"subdivision": "state"
	},
	{
		"name": "Querétaro",
		"code": "MX-QUE",
		"subdivision": "state"
	},
	{
		"name": "Quintana Roo",
		"code": "MX-ROO",
		"subdivision": "state"
	},
	{
		"name": "San Luis Potosí",
		"code": "MX-SLP",
		"subdivision": "state"
	},
	{
		"name": "Sinaloa",
		"code": "MX-SIN",
		"subdivision": "state"
	},
	{
		"name": "Sonora",
		"code": "MX-SON",
		"subdivision": "state"
	},
	{
		"name": "Tabasco",
		"code": "MX-TAB",
		"subdivision": "state"
	},
	{
		"name": "Tamaulipas",
		"code": "MX-TAM",
		"subdivision": "state"
	},
	{
		"name": "Tlaxcala",
		"code": "MX-TLA",
		"subdivision": "state"
	},
	{
		"name": "Veracruz",
		"code": "MX-VER",
		"subdivision": "state"
	},
	{
		"name": "Yucatán",
		"code": "MX-YUC",
		"subdivision": "state"
	},
	{
		"name": "Zacatecas",
		"code": "MX-ZAC",
		"subdivision": "state"
	}
];

const getEstado = () =>{
    //toDo filter allowed Status
    return estados[Math.floor(Math.random() * estados.length)].name;
};

const getLastFour = (i) => {
	let a = 100000+i+1;
 	a = a.toString().substr(-5);
	return a;
}

app.post('/clientsData',async (req, res) => {
    let total = req.body.total;
    let clientsArray = [];
    let client = {
       
    }
    
    for(let i=0;i<=total;i++){
        client = {};
        client.bin = `4000-0012-3456-${getLastFour(i)}`;
        client.cliente_firstName = faker.name.firstName();
        client.cliente_lastName = faker.name.lastName();
        client.cliente_gender = faker.name.gender();
        client.cliente_phone = faker.phone.phoneNumber();
        client.cliente_account = faker.finance.account();
        client.cliente_accountName = faker.finance.accountName();
        client.cliente_street = faker.address.streetAddress();
        client.cliente_city = faker.address.city();
        client.cliente_state = getEstado();
        client.cliente_zipcode = faker.address.zipCode();
        client.cliente_country = 'MX';
        client.cliente_latitude = faker.address.latitude();
        client.cliente_longitude = faker.address.longitude();
        client.cliente_created = faker.date.past();

        clientsArray.push(client);
        console.log(client);
    }

    let data = JSON.stringify(clientsArray);
    fs.writeFileSync('clientes.json', data, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });


    res.json('finished');
})

app.get('/cliente/:bin',(req,res)=>{
    let bin = req.params.bin;
    let clientes = require('./clientes.json');
    console.log('bin',bin,'totalClientes',clients.length);

    let found = clientes.find( item => item.bin == bin );

    res.json(found);

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
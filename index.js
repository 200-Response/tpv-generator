const express = require('express');
var faker = require('faker');
const app = express();
const cors = require('cors');
var md5 = require('md5');
const port = 3000;
const AWS = require('aws-sdk');

AWS.config = new AWS.Config();
  
	AWS.config.update({
	  region: 'us-east-1'
	});

const kinesis = new AWS.Kinesis();

app.use(express.json({ strict: false, limit: "20mb" }));
app.use(cors());

let totalTpv = 0;
let totalMessages= 0;

const tpvStatus =[
    {        
        statusCode: "00",
        description: "Aprobada"
    },
    {
        statusCode: "01",
        description: "Referida"
    },
    {     
        statusCode: "03",
        description: "Negocio inválido"
    },
    {     
        statusCode: "04",
        description: "Recoger tarjeta"
    },
    {     
        statusCode: "05",
        description: "Rechazada"
    },
    {     
        statusCode: "06",
        description: "Reintente"
    },
    {     
        statusCode: "12",
        description: "Transacción no permitida"
    },
    {     
        statusCode: "13",
        description: "Monto inválido"
    },
    {     
        statusCode: "14",
        description: "Tarjeta inválida"
    },
    {     
        statusCode: "19",
        description: "Reintente"
    },
    {     
        statusCode: "30",
        description: "Error de Formato"
    },
    {     
        statusCode: "40",
        description: "Función no soportada"
    },
    {     
        statusCode: "41",
        description: "Recoger tarjeta"
    },
    {     
        statusCode: "54",
        description: "Tarjeta expirada"
    },
    {     
        statusCode: "55",
        description: "NIP incorrecto"
    },
    {     
        statusCode: "74",
        description: "Terminal NO Registrada"
    },
    {     
        statusCode: "75",
        description: "Número de intentos de NIP excedidos"
    },
    {     
        statusCode: "82",
        description: "CVV incorrecto"
    },
    {     
        statusCode: "83",
        description: "Rechazada"
    },
    {     
        statusCode: "94",
        description: "Declinada"
    }
]
    
    


app.post('/message',async (req, res) => {
    totalTpv = req.body.totalTpv;
    totalMessages = req.body.totalMessages;
    console.log('totalTpv',totalTpv);
    console.log('totalMessages',totalMessages);

    console.log(tpvStatus.length);
    console.log(Math.floor(Math.random() * tpvStatus.length) + 1 );

    let kinesisMessage = {
        ipAddress: '10.0.0.1',
        serialNumberTpv:'MX0001',
        bin:'1234123412341234',
        statusCode: '75',
        timestamp:123412341320491341324
    }
    
    for(let i=0;i<totalMessages;i++){
        console.log('mensaje ',i);
        let partitionKey = md5(Date.now());
        if(i%100==0){
            await sleep(500);
            console.log('------ bach of ten');
        }
        kinesisMessage.timestamp = Date.now();
        kinesisMessage.statusCode = `${getRandomEvent()}`;
        kinesisMessage.ipAddress = faker.internet.ip();
        kinesisMessage.serialNumberTpv = getRandomTPV();
        kinesisMessage.bin = faker.finance.creditCardNumber();
        kinesisMessage.timestamp+= 100;
        await sendToKinesis(kinesisMessage,partitionKey);
    }

    res.json('finished');
})

const sendToKinesis = (kinesisMessage,partitionKey) =>{
    new Promise((resolve,reject) => {
        console.log(kinesisMessage);
        var params = {
            Data: JSON.stringify(kinesisMessage),
            PartitionKey: partitionKey, 
            StreamName: 'bbva_stream_v1' 
          };
          kinesis.putRecord(params, function(err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred\
                reject(err);
            }
            else  {
                //console.log(data);
                resolve(data);          // successful response
            }   
          });
    })
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };


const getRandomTPV = ( ) =>{
    //toDo filter allowed Status
    return `MX0000_${Math.floor(Math.random() * totalTpv + 1)}`;
};

const getRandomEvent = ( allowedStatus  = [] ) =>{
    //toDo filter allowed Status
    return tpvStatus[Math.floor(Math.random() * tpvStatus.length)].statusCode;
};

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
const express = require('express');
var faker = require('faker');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(express.json({ strict: false, limit: "20mb" }));
app.use(cors());

let totalTpv = 0;
let totalMessages= 0;

const tpvStatus =[
    {
    statusCode: '51',
    description:'Saldo insuficiente'
    },
    {
    statusCode: '54',
    description:'Tarjeta expirada'
    }];
    


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

        if(i%10==0){
            await sleep(500);
            console.log('------ bach of ten');
        }

        kinesisMessage.timestamp = Date.now();
        kinesisMessage.statusCode = `${getRandomEvent()}`;
        kinesisMessage.ipAddress = faker.internet.ip();
        kinesisMessage.serialNumberTpv = getRandomTPV();
        kinesisMessage.bin = faker.finance.creditCardNumber();
        kinesisMessage.timestamp+= 100;

        sendToKinesis(kinesisMessage);

    }

})

const sendToKinesis = (kinesisMessage) =>{
    console.log(kinesisMessage);
    var params = {
        Data: Buffer.from('...') || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */, /* required */
        PartitionKey: 'STRING_VALUE', /* required */
        StreamName: 'STRING_VALUE', /* required */
        ExplicitHashKey: 'STRING_VALUE',
        SequenceNumberForOrdering: 'STRING_VALUE'
      };
      kinesis.putRecord(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });
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
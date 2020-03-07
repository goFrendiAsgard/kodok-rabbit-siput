// imports
const amqplib = require('amqplib');
const express = require('express');
const bodyParser = require('body-parser');

const serviceDesc = require('./serviceDesc');
const { createApp, startApp } = require('./helpers/express/expressHelper');
const { createConnection: createRmqConnection, sendToQueue, consume } = require('./helpers/amqp/amqpHelper');
const { logger, rmqEvent } = serviceDesc;

async function main() {
    const pesanMasuk = [];
    try {
        // Variables
        const app = createApp(serviceDesc, express, bodyParser);
        const rmq = await createRmqConnection(serviceDesc.rmq, amqplib);

        // Http routes
        app.all('/', (req, res) => {
            return res.send('Hai, di sini siput. Pesan masuk sejauh ini: ' + pesanMasuk.join(', '));
        });

        // Start Listening to rmqEvent
        await consume(serviceDesc, rmq, rmqEvent, (message) => {
            logger.log("Dapat pesan masuk:", message);
            pesanMasuk.push(message);
        });

        // Start HTTP Server
        startApp(serviceDesc, app);
    } catch (error) {
        logger.error(error);
    }
}

if (require.main == module) {
    main();
}

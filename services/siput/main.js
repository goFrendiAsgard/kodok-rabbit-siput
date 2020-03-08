// imports
const amqplib = require('amqplib');
const express = require('express');
const bodyParser = require('body-parser');

const serviceDesc = require('./serviceDesc');
const { createApp, startApp } = require('./helpers/express/expressHelper');
const { createRmq, sendToQueue, consume } = require('./helpers/amqp/amqpHelper');
const { logger, rmqEvent } = serviceDesc;

async function main() {
    const pesanMasuk = [];
    try {
        // Variables
        const app = createApp(serviceDesc, express, bodyParser);
        const rmq = await createRmq(serviceDesc, serviceDesc.rmq, amqplib);

        // Http routes
        app.all('/', (_, res) => {
            return res.send('Hai, di sini siput, pesan masuk sejauh ini: ' + pesanMasuk.join(', '));
        });

        // Start Listening to rmqEvent
        await consume(rmq, 'siput', (message) => {
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
// imports
const amqplib = require('amqplib');
const express = require('express');
const bodyParser = require('body-parser');

const serviceDesc = require('./serviceDesc');
const { createApp, startApp } = require('./helpers/express/expressHelper');
const { createRmq, sendToQueue } = require('./helpers/amqp/amqpHelper');
const { logger, rmqEvent } = serviceDesc;

async function main() {
    try {
        // Variables
        const app = createApp(serviceDesc, express, bodyParser);
        const rmq = await createRmq(serviceDesc, serviceDesc.rmq, amqplib);

        // Http routes
        app.all('/', (req, res) => {
            return res.send('Hai, di sini kodok');
        });

        app.all('/pesan-ke-siput', (req, res) => {
            // dapatkan pesan dari user
            const pesan = req.query['pesan'] ? req.query['pesan'] : 'kosong';
            // kirim pesan ke siput
            sendToQueue(rmq, 'siput', pesan);
            // kasih tahu ke user bahwa kita udah kirim pesan ke siput
            res.send('Hai user, pesanmu ke siput sudah dikirim');
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
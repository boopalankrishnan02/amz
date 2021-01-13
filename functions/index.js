const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51HTBz6HTr26yyJHdPV3Kycg5OSwWh8KB5vqpPYKnCvLEQOIC8KK824miAVZv8tAJ8Si8DMGnsL7wMlX55krCquEu00HDwMP0Ud');

//Api

//App config
const app = express();

//Middleware
app.use(cors({
    origin: true
}));
app.use(express.json())

//Api routes
app.get('/',(request,response) => response.status(200).send('helloWorld'))
// app.get('/bpg',(request,response) => response.status(200).send('whats up!!!!!!!!'))
app.post('/payments/create',async (request,response) => {
    const total = request.query.total;

    console.log('Payment Request received for this amount >>', total)

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "inr",
    })

    //Ok - created
    response.status(201).send({
        clientSecret : paymentIntent.client_secret,
    })
})

//Listen Command
exports.api = functions.https.onRequest(app)

//Example Endpoint
// http://localhost:5001/amz-challenge-5f737/us-central1/api

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

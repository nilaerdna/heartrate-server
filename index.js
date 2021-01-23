const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;
var urlencodedParser = bodyParser.urlencoded({ extended: false });

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.connection
    .once('open', () => {
        console.log('Connected to the server');

        const HeartRateSchema = mongoose.Schema({
            heartRate: Number,
            timeStamp: Number,
        });

        const HeartRate = mongoose.model('HeartRate', HeartRateSchema, 'heartRates');

        app.post('/send', urlencodedParser, async (req, res) => {
            const { hr } = JSON.parse(JSON.stringify(req.body));
            console.log(hr);

            const hrObj = {
                heartRate: hr,
                timeStamp: Date.now(),
            };

            HeartRate.collection.insertOne(hrObj, (err, docs) => {
                if (err) {
                    return console.error(error);
                } else {
                    console.log('A document was inserted in the database.');
                }
            });

            return res.send('Received a POST HTTP method');
        });
    })
    .on('error', (error) => {
        console.log(error);
    });

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});

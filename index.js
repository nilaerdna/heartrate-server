const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());

const port = process.env.PORT || 3000;
var urlencodedParser = bodyParser.urlencoded({ extended: false });

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.connection
    .once('open', () => {
        console.log('Connected to the server');

        const HeartRateSchema = mongoose.Schema(
            {
                heartRate: Number,
                timeStamp: Number,
            },
            { collection: 'heartRates' }
        );

        const HeartRate = mongoose.model('HeartRate', HeartRateSchema, 'heartRates');

        // SEND REQUEST
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

        // GET DATA
        app.get('/get/:n', (req, res) => {
            const numberOfDocs = +req.params.n;
            const cursor = HeartRate.collection.find().sort({ _id: -1 }).limit(numberOfDocs);

            const valueArray = [];

            cursor
                .forEach((doc) => {
                    const dataTeplate = {
                        hr: doc.heartRate,
                        time: doc.timeStamp, //new Date(doc.timeStamp).toGMTString(),
                    };
                    valueArray.push(dataTeplate);
                })
                .then(() => {
                    const responseJson = {
                        title: `Last ${numberOfDocs} heart rates`,
                        data: valueArray,
                    };

                    return res.send(JSON.stringify(responseJson));
                });
        });
    })
    .on('error', (error) => {
        console.log(error);
    });

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});

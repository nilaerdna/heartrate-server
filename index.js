const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = process.env.PORT || 3000;

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });


app.get('/', (req, res) => {
    return res.send('Received a GET HTTP method');
});


app.post('/send', urlencodedParser, (req, res) => {
    const { hr } = JSON.parse(JSON.stringify(req.body));
    console.log(hr);
    return res.send('Received a POST HTTP method');
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

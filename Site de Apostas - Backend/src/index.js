const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', (req, res) => {
    res.send('Site de apostas-API V1.0.0');
});
require('./app/controllers/index')(app);
app.listen(8000, () => console.log('Servidor rodando em http://localhost:8080'));
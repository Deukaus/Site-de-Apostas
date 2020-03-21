const express = require('express');

const router = express.Router();

const itens = require('../models/withdrawModel');


router.get('/', async (req, res) => {
    let name = "AWP%20%7C%20Asiimov%20%28Field-Tested%29";
    let dados = await itens.findOne({name});
    let link = `https://steamcommunity.com/market/listings/730/${dados.name}/render?start=0&count=1&currency=3&language=english&format=json`;
    try {
        return res.send({
            "link": link,
            dados
        })
        //return res.send(itens)
    } catch (err) {
        console.log(err)
    }
});

router.post('/add', async (req, res) => {
    const {price, id64} = req.body;
    let {name} = req.body;
    try {
        name = encodeURIComponent(name);
        await itens.create({
            name,
            price,
            id64
        });
        return res.send({
            name,
            price,
            id64
        });
    } catch (err) {
        console.log(err)
    }
});

module.exports = app => app.use('/withdraw', router);
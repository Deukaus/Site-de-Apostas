const express = require('express');

const router = express.Router();

const itens = require('../models/withdrawModel');


router.get('/', async (req, res) => {
    try {
        await itens.find()
            .then(function(dados){
                return res.send({items: dados})
            })
        } catch (err) {
            console.log(err);
        }
});

router.delete('/:id', async (req, res) => {
    itens.deleteOne({
        "_id":req.params.id
    }, (err, response) => {
		if(err) {
            throw err;
		}
    });
    return res.send({
        concluido: true
    })
});

router.post('/', async (req, res) => {
    let {name, price, id64, classId, img} = req.body;
    try {
        name = encodeURIComponent(name);
        await itens.create({
            name,
            price,
            id64,
            classId,
            img
        });
        return res.send({
            name,
            price,
            id64,
            classId,
            img
        });
    } catch (err) {
        console.log(err)
    }
});

module.exports = app => app.use('/withdraw', router);
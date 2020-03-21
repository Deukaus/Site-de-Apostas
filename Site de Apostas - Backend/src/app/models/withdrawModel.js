const mongoose = require('../../database/connectDB');

const withdrawSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    id64: {
        type: Number,
        required: true
    }
})

const Withdraw = mongoose.model('Withdraw', withdrawSchema);

module.exports = Withdraw;
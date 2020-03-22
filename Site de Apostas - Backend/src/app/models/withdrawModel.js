const mongoose = require('../../database/connectDB');

const withdrawSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    classId: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    id64: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    }
})

const Withdraw = mongoose.model('Withdraw', withdrawSchema);

module.exports = Withdraw;
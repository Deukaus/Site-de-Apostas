const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://teste:teste@teste-nfg5q.mongodb.net/hello?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = mongoose
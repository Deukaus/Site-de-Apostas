const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://teste:teste@teste-nfg5q.mongodb.net/hello?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
mongoose.Promise = global.Promise;

module.exports = mongoose
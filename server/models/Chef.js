const mongoose = require('mongoose');

const ChefSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
});

module.exports = mongoose.model('Chef', ChefSchema);
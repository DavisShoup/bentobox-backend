const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    steps: {
        type: String,
    },
    time: {
        type: String,
    },
    chefId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chef',
    },
});

module.exports = mongoose.model('Recipe', RecipeSchema);
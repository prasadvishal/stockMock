var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var countrySchema = new Schema({
        name: {
            type: String
        },
    }, {
        collection: 'user'
    }, {
        strict: false
    });

mongoose.model('users', countrySchema);
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var stockSchema = new Schema({
        stock_id: {
            type: Number
        },
        name: {
            type: String
        },
        symbol: {
            type: String
        },
        open: {
            type: Number
        },
        current_val: {
            type: Number
        },
        today_max: {
            type: Number
        },
        today_min: {
            type: Number
        },
        change_percent: {
            type: Number
        },
        status: {
            type: Number
        },
        market_fluctuation: {
            type: Array
        },
        up_count: {
            type: Number
        },
        down_count: {
            type: Number
        },
        no_change_count: {
            type: Number
        },
    }, {
        collection: 'stock'
    }, {
        strict: false
    });

mongoose.model('stocks', stockSchema);
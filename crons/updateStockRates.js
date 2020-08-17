const Config = require('./../backend/src/Config/config');
const Constants = require('./../backend/src/Config/constants');
require('./../backend/src/Models/stock');

const CronJob = require('cron').CronJob;
const moment = require('moment');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.connect(Config.DB_URL);
var stocksSchema = new Schema({
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

var Stocks = mongoose.model('stocks', stocksSchema);

var cronJob = new CronJob("0 */1 * * * * ", async function() { // Cron to update db data every 2mins past 08:00:00 till 16:00:00
    console.log("\n\n\nCRON running at----------------", new Date());
    await updateStocks(new Date());
});
cronJob.start();

//updateStocks(new Date());

async function updateStocks(updateDate){
    Stocks.find({
        }, async function(findErr, findRes) {
            if(findErr){
                console.log("Stocks Find Error ---> ", findErr);
                //return Response.sendErrorResponse(req,res);
            }else{
                console.log(" Stocks Resp : ",findRes);
                let updateClose = false;
                let updateOpen = false;
                if(updateDate.getHours() == 16 && updateDate.getMinutes() == 0){
                    updateClose = true;
                }
                if(updateDate.getHours() == 8 && updateDate.getMinutes() == 0){
                    updateOpen = true;
                }
                let id = 999
                for(stock of findRes){
                    id++;
                    let newVal = getRandomStockValue(stock.current_val);
                    let changePerecent = getChangePercent(newVal,stock.open);
                    if(updateClose == false && updateOpen == true){
                        stock.market_fluctuation = [];
                        stock.market_fluctuation.push({'time': updateDate, 'value': newVal});
                    }else{
                        stock.market_fluctuation.push({'time': updateDate, 'value': newVal});
                    }
                    let mfArr = stock.market_fluctuation;
                    let updateObj = {
                        'open' :      updateOpen ? stock.close : stock.open,
                        'close':      updateClose ? stock.current_val : null,
                        'current_val': newVal,
                        'today_max'  : (stock.today_max && stock.today_max < newVal) ? newVal : stock.today_max,
                        'today_min'  : (stock.today_min && stock.today_min > newVal) ? newVal : stock.today_min,
                        'change_percent' : changePerecent.toFixed(2),
                        'status' : (changePerecent == 0) ? 0 : (changePerecent < 0 ? -1 : 1),
                        'market_fluctuation' : mfArr,
                        'up_count' : (newVal > stock.current_val) ? stock.up_count + 1 : stock.up_count,
                        'down_count' : (newVal < stock.current_val) ? stock.down_count + 1 : stock.down_count,
                        'no_change_count' : (newVal == stock.current_val) ? stock.no_change_count + 1 : stock.no_change_count,
                    }
                    console.log("---------- Update Object ---------- ",updateObj);
                    await Stocks.update({
                        symbol: stock.symbol
                    }, {
                        $set: updateObj,
                    }, function(err, doc) {
                        if(err){
                            console.log("Stock Update Error ---> ",err);
                        }else{
                            console.log("Updated Record: ",doc)
                        }
                    });
                }
                //return Response.sendSuccessResponse(req,res,200,"Successfull",findRes);        
            }
        }).limit(100);
}

function getRandomStockValue(n){
    if(Math.floor((Math.random() * 5) + 1)%2 == 0){
        return n + (Math.floor((Math.random() * 50) + 1));
    }else{
        return n - (Math.floor((Math.random() * 50) + 1));
    }
    
}

function getChangePercent(newVal,startVal){
    let delta = Math.abs(newVal - startVal); 
    let deltaPercent = (delta/startVal) * 100;
    if(newVal > startVal){
        return deltaPercent;
    }else{
        deltaPercent = 0 - deltaPercent
        return deltaPercent;
    }
}
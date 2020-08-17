let Response = require('./../Services/responseService');
let Db = require('./../Services/dbService');
let stocksController = {};
let mongoose = require('mongoose');
let Users = mongoose.model('users');
let Stocks = mongoose.model('stocks');

stocksController.getStocks= async function (req, res) {
	try {
        if(req.query && req.query.stock_id){  // for a sinlge stock
            if(isNaN(parseInt(req.query.stock_id))){
                return Response.sendWrongParamResponse(req, res, 400, CONSTANTS.INVALID_PARAM_MSG, ['stock_id']);
            }
            Stocks.findOne({
                'stock_id' : req.query.stock_id
            }, function(findErr, stockData) {
                if(findErr){
                    console.log("Find Error ---> ", findErr);
                    return Response.sendErrorResponse(req,res);
                }else{
                    console.log(" Find Resp : ",stockData)
                    return Response.sendSuccessResponse(req,res,200,"Successfull",stockData);        
                }
            })
        }else{                          // for list of stock 
            let limit = req.query.limit && !isNaN(parseInt(req.query.limit)) ? parseInt(req.query.limit) : 20;
            let skip = req.query.page && !isNaN(parseInt(req.query.page)) ? limit * (parseInt(req.query.page) - 1)  : 0;
            Stocks.find({
            },{stock_id:1,name:1, symbol:1,current_val:1,open:1,close:1,today_max:1,today_min:1}, function(findErr, stockData) {
                if(findErr){
                    console.log("Find Error ---> ", findErr);
                    return Response.sendErrorResponse(req,res);
                }else{
                    console.log(" Find Resp : ",stockData)
                    return Response.sendSuccessResponse(req,res,200,"Successfull",stockData);        
                }
            }).limit(limit).skip(skip);
        }
        //return Response.sendSuccessResponse(req,res,200,"Successfully Inserted");
	} catch(e) {
		console.log("Exception --> ",e)
		return Response.sendErrorResponse(req,res, [e], []);
	}	
}

stocksController.getTopMovers= async function (req, res) {
	try {
        if(req.query && req.query.type && [CONSTANTS.MOVER_TYPE_GAINER, CONSTANTS.MOVER_TYPE_LOOSER].includes(req.query.type.toLowerCase())){  // for a sinlge stock                          // for list of stock 
            let limit = req.query.limit && !isNaN(parseInt(req.query.limit)) ? parseInt(req.query.limit) : 5;       // Show top 5 Gainers/Loosers by default
            Stocks.find({
                status: (req.query.type.toLowerCase() == CONSTANTS.MOVER_TYPE_GAINER) ? 1 : -1
            },
            {   stock_id:1,
                name:1, 
                symbol:1,
                current_val:1,
                open:1,
                close:1,
                today_max:1,
                today_min:1,
                change_percent: 1,
                status:1
            }, function(findErr, stockData) {
                if(findErr){
                    console.log("Find Error ---> ", findErr);
                    return Response.sendErrorResponse(req,res);
                }else{
                    console.log(" Find Resp : ",stockData)
                    return Response.sendSuccessResponse(req,res,200,"Successfull",stockData);        
                }
            }).sort({change_percent: (req.query.type.toLowerCase() == CONSTANTS.MOVER_TYPE_GAINER) ? -1 : 1}).limit(limit);
        }else{
            return Response.sendWrongParamResponse(req, res, 400, CONSTANTS.INVALID_PARAM_MSG, ['Stock Movement Type']);
        }
        //return Response.sendSuccessResponse(req,res,200,"Successfully Inserted");
	} catch(e) {
		console.log("Exception --> ",e)
		return Response.sendErrorResponse(req,res, [e], []);
	}	
}

stocksController.insertStocks = async function (req, res) {
	try {

        for(stock of CONSTANTS.STOCKS_DATA){
            let openPrice = Math.floor((Math.random() * 10) + 1) * Math.floor((Math.random() * 1000) + 1);
            let newVal = getRandomStockValue(openPrice);
            let stockObj = {
                "name": stock['Company Name'],
                "symbol": stock['Symbol'],
                "open" : openPrice,
                "current_val" : newVal,
                "today_max" : newVal,
                "today_min" : newVal,                        
                'change_percent' : 0.0,
                'status' : 0,
                'market_fluctuation' : [{'value':newVal,'time': new Date()}],
                'up_count' : 0,
                'down_count' : 0,
                'no_change_count' : 0,
            }
            let stockData = new Stocks(stockObj)
            await stockData.save(function(err, success) {
                //console.log("Saving New Industry")
                if (err) {
                    console.log("!!!! Error while Insertion : ",err);
                    return Response.sendErrorResponse(req,res);
                }else{
                    console.log("\n\nInsertion Done for : ",stockObj.symbol);
                }
            });
        }
        return Response.sendSuccessResponse(req,res,200,"Successfully Inserted");			
	} catch(e) {
		console.log("Exception --> ",e)
		return Response.sendErrorResponse(req,res, [e], []);
	}	
}

function getRandomStockValue(n){
    if(Math.floor((Math.random() * 5) + 1)%2 == 0){
        return n + (Math.floor((Math.random() * 50) + 1));
    }else{
        return n - (Math.floor((Math.random() * 50) + 1));
    }
    
}

module.exports = stocksController;

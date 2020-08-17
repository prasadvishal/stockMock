//const CONSTANTS = './../Config/Constants';

var sendSuccessResponse = function(req, res, code = 200, message = CONSTANTS.DEFAULT_SUCCESS_MSG, data = null, key =null) {
	let responseObj = { 'code' : code, 'message' : message }
    if(data){
        if(key){
            responseObj[key] = data;
        }else{
            responseObj['data'] = data;
        }
    }
	res.send(responseObj);
}

var sendErrorResponse = function(req, res, code = 500, message = CONSTANTS.DEFAULT_ERROR_MSG, data = null, key =null) {
	let responseObj = { 'code' : code, 'error' : message }
    if(data){
        if(key){
            responseObj[key] = data;
        }else{
            responseObj['data'] = data;
        }
    }
	res.send(responseObj);
}

var sendWrongParamResponse = function(req, res, code = 400, message = CONSTANTS.INVALID_PARAM_MSG, data = null, key =null) {
	let responseObj = { 'code' : code, 'error' : message }
    if(data){
        if(key){
            responseObj[key] = data;
        }else{
            responseObj['data'] = data;
        }
    }
	res.send(responseObj);
}

var sendResponseAsItIs = function(req, res, responseObj) {
	res.send(responseObj);
}

module.exports = {
	sendErrorResponse   : sendErrorResponse,
	sendSuccessResponse : sendSuccessResponse,
	sendWrongParamResponse : sendWrongParamResponse,
	sendResponseAsItIs : sendResponseAsItIs,
}
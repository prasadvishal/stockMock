//const CONSTANTS = './../Config/Constants';

var insertOne = function(Schema, insertObj) {
    return new Promise(async function(resolve, reject) {
        try{    
            Schema.insert(insertObj)

        }catch(er){
            console.log("!!!! Error while Insertion : ",er);
            reject(er);
        }
	});
}


module.exports = {
	insertOne   : insertOne,
}
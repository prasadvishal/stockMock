const config = require('./Config/config');
//let app = require('./app');
const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const app = express();    
const cors = require('cors')              //server instance
const bodyParser = require('body-parser');

require('./Models/user');
require('./Models/stock');
const routes = require('./Routes/routes');
global.CONSTANTS = require('./Config/constants');
app.use(cors())
app.use('/api', routes);
app.use(bodyParser.json({limit: '50mb'}));
app.get('/', function(req, res){
    res.send("I am Listening.")
});
app.listen(config.PORT, () => {
    // global.DBConnection = null;
    // sequelize.authenticate().then(() => {
    //     console.log('Connected to MySQL ' + mysql_db.database + ' database.');
    //     global.DBConnection = sequelize;
    // }).catch(err => {
    //     console.error('Unable to connect to the database ' + mysql_db.database + ' :', err);
    //     global.DBConnection = null;
    // });
    // var apiRoute = require('./routes/nseRoutes') (app, router);
    // // createDbConnection();

    // establish connection to mongodb
    mongoose.Promise = global.Promise; // Mongoose
    //console.log("db string", config.DB_URL)
    mongoose.connect(config.DB_URL, { useNewUrlParser: true }); // Connect to mongo

    var db = mongoose.connection; // Mongoose connection check

    db.on('error', (err) => { // Mongoose connection error
        console.log('Mongoose error', err);
        process.exit(1);
    });

    db.once('open', () => {
        console.log('mongo db connected to: ',config.DB_URL);
    });
    console.log('StockMock Server is listening on port ' + config.PORT);
});
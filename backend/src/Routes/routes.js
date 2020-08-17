const express = require('express');
const router = express.Router();
 
var stocksController = require('../Controllers/stocksController');
router.get('/stocks', stocksController.getStocks);
router.get('/top_movers', stocksController.getTopMovers);

module.exports = router;
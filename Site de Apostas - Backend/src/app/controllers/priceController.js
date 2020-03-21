const express = require('express');

const router = express.Router();

var request = require('request');

var options = {
    "errors": {
        "missing_params": "missing parameter(s)",
        "invalid_key": "insufficient privileges (unrecognized key)",
        "not_premium": "insufficient privileges (not premium)",
        "unknown_item": "unknown item"
    },
    "backpacktf_key": "",
    "update_time": 7200,
    "refresh_interval": 3600,
    "delete_old_interval": 9000
};

var lastCheck = 0;
var lastResult;


const Prices = require('../models/Prices');
const History = require('../models/History');


////////////////////
// On GET request //
////////////////////
router.post('/', function(req, res) {
	var query = req.body
	console.log(query.key);
	if (query.item === undefined) {
		res.json({ success: false, error: options.errors.missing_params });
		return;
	}

	Prices.findOne({
		item: query.item
	}, (err, prices) => {
		if(err) {
			throw err;
	}

	if(prices != null) {
		var current_price, avg_week_price, avg_month_price;

		if (prices.current_price !== undefined && prices.avg_week_price !== undefined && prices.avg_month_price !== undefined) {
			current_price = prices.current_price;
			avg_week_price = prices.avg_week_price;
			avg_month_price = prices.avg_month_price;
		}

		if (current_price !== undefined && avg_week_price !== undefined && avg_month_price !== undefined) {
			res.json({ success: true, current_price: current_price, avg_week_price: avg_week_price, avg_month_price: avg_month_price, lastupdate: prices.lastupdate });
		}					
	} else { // Se nao tiver esse item no nosso banco de dados ele procura no mercado
		request('http://steamcommunity.com/market/priceoverview/?country=US&currency=1&appid=730&market_hash_name=' + encodeURIComponent(query.item), function(error, response, body) {
			var json = '';
							
		try {
			json = JSON.parse(body);
		} catch (e) {
			res.json({ success: false, error: options.errors.unknown_item });
			return;
		}
							
		var current = Math.floor(Date.now() / 1000);
		if (!error && response.statusCode === 200 && json.lowest_price !== undefined && json.median_price !== undefined) {
			const a = new Prices({
			    "item": query.item,
				"current_price": json.lowest_price.replace('$', ''),
				"avg_week_price": json.median_price.replace('$', ''),
				"avg_month_price": json.median_price.replace('$', ''),
				"lastupdate": current	
			});

			a.save((err, response) => {
				if (err) {
				    throw err;
				}
			})

			const b = new History({
				item: query.item,
				current_price: json.median_price.replace('$', ''),
				time: current
			});

			b.save((err, response) => {
				if (err) {
					throw err;
				}
			})
						
			res.json({ 
				success: true, 
				current_price: json.lowest_price.replace('$', ''), 
				avg_week_price: json.median_price.replace('$', ''), 
				avg_month_price: json.median_price.replace('$', ''), 
				lastupdate: current
			});				
		} else {
			console.log('Attempting to use CSGOFAST-API for '+ query.item);

			request('https://api.csgofast.com/price/all', function(error, response, body) {
			var json = '';

			try {
				json = JSON.parse(body);
			} catch (e) {
				res.json({ success: false, error: options.errors.unknown_item });
				return;
			}

			var current = Math.floor(Date.now() / 1000);
		    if (!error && response.statusCode === 200 && (query.item in json)) {		
				const a = new Prices({
			    "item": query.item,
				"current_price": json[query.item].toString().replace('$', ''),
				"avg_week_price": json[query.item].toString().replace('$', ''),
				"avg_month_price": json[query.item].toString().replace('$', ''),
				"lastupdate": current	
			});

				a.save((err, response) => {
					if (err) {
						throw err;
					}
			    })

				const b = new History({
					item: query.item,
					current_price: json[query.item].toString().replace('$', ''),
					time: current
				});

				b.save((err, response) => {
					if (err) {
						throw err;
					}
				})
								
				res.json({
					success: true, 
					current_price: json[query.item].toString().replace('$', ''),
					avg_week_price: json[query.item].toString().replace('$', ''),
					avg_month_price: json[query.item].toString().replace('$', ''),
					lastupdate: current
				});							
			} else {
				res.json({ success: false, error: options.errors.unknown_item });
            }});
        }});
    }});
});



router.get('/all', function(req, res) {
	Prices.find({}, (err, prices) => {
		if(err) {
			throw err;
		}

		var output = {};

		prices.forEach(function(item) {
			output[item.item] = {
			current_price: item.current_price,
			};
		});

		res.json({ success: true, items: output });
    });
});


router.get('/backpacktf', function(req, res) {
	if (Math.floor(Date.now() / 1000) - lastCheck >= 120) {
		request('http://backpack.tf/api/IGetMarketPrices/v1/?key=' + options.backpacktf_key + '&appid=730', function(err, response, body) {
		if (err) {
			console.log("Error receiving backpack.tf prices");
		    res.json({ success: true, items: lastResult });
			return;
		}
						
		try {
			body = JSON.parse(body);
		} catch (e) {
			console.log("Error parsing JSON from backpack.tf");
			res.json({ success: true, items: lastResult });
			return;
		}
						
		if (body.response.success) {
			res.json({ success: true, items: body.response.items });
			lastResult = body.response.items;
		} else {
			res.json({ success: true, items: lastResult });
		}
	});
}});	


module.exports = app => app.use('/price', router);

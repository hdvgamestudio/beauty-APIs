var Product = require('../models/product');

exports.getProducts = function(req, res, next) {
	var classId = req.params.id;
	Product.find({ classification: classId })
		.exec(function(err, products) {
			if (err) return next(err);
			res.json(products);
	});
};

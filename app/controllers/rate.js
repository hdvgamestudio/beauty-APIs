var Product = require('../models/product');

exports.postRates = function(req, res, next) {
  var rate = req.body.rate;
  var productId = req.params.product_id;
  Product.findOne({ _id: productId, "rates.user_id": rate.user_id })
    .exec(function(err, product) {
      if (err) return next(err);
      if (!product) {
        Product.update(
          { _id: productId },
          { $push: { rates: rate } })
          .exec(function(err, result) {
            if (err) return next(err);
            res.json(result);
        });
      } else {
        Product.update(
          { _id: productId, "rates.user_id": rate.user_id },
          { $set: { "rates.$.value": rate.value } })
          .exec(function(err, result) {
            if (err) return next(err);
            res.json(result);
        });
      }
  });
}

exports.getRates = function(req, res, next) {
  var productId = req.params.product_id;
  Product.aggregate([
    { $unwind: "$rates" },
    { $project: { _id: 0, value: "$rates.value" } },
    { $group: { _id: "$value", count: { $sum: 1 } } }
  ])
    .exec(function(err, count) {
      if (err) return next(err);
      Product.aggregate([
        { $unwind: "$rates" },
        { $project: { _id: 0, value: "$rates.value" } },
        { $group: { _id: null, average: { $avg: "$value" } } }
      ])
        .exec(function(err, rating) {
          if (err) return next(err);
          var average_rating = Number(rating[0].average).toFixed(1);
          res.json({ rating_counts: count, average_rating: average_rating });
      })
  })
}


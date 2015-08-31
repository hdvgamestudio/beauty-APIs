var Product                 = require('../models/product');
var Classification          = require('../models/classification');
var Distributor             = require('../models/distributor');
var _                       = require('underscore');
var ApiErrors               = require('../../lib/apiError');
var Error400                = require('../../lib/errors/error400');

exports.postProducts = function(req, res, next) {

  var newProduct = req.body.product;
  if (!newProduct.name) {
    return next(new Error400(
        ApiErrors.PRODUCTNAME_REQUIRED.code,
        ApiErrors.PRODUCTNAME_REQUIRED.msg
    ));
  }
  if (!newProduct.code) {
    return next(new Error400(
        ApiErrors.PRODUCTCODE_REQUIRED.code,
        ApiErrors.PRODUCTCODE_REQUIRED.msg
    ));
  }

  Product.findOne({ $or: [
    { name: newProduct.name },
    { code: newProduct.code }]})
   .exec(function(err, product) {
     if (err) return next(err);
     if (product)
       return next(new Error400(
         ApiErrors.PRODUCTNAME_CODE_EXISTED.code,
         ApiErrors.PRODUCTNAME_CODE_EXISTED.msg
       ));

     product = new Product(newProduct);
     product.save(function(err, savedProduct) {
       if (err) return next(err);
       res.json(savedProduct);
     });
   });
}

exports.getProducts = function(req, res, next) {
  var fields;
  var skip = 0;
  var limit;
  var criteria = {};
  var sort = {};
  if (req.query.fields) {
    fields = req.query.fields.replace(/,/g, ' ');
  }
  if (req.query.q) {
    var expr = new RegExp('.*' + req.query.q + '.*');
    criteria.$or = [
      { name: expr },
      { code: expr },
      { information: expr },
      { country: expr }
    ];
  }
  if (req.query.name) {
    criteria.name = req.query.name;
  }
  if (req.query.company) {
    criteria.company = req.query.company;
  }
  if (req.query.country) {
    criteria.country = req.query.country;
  }
  if (req.query.tags) {
    var tags = req.query.tags.split(',');
    criteria.tags = {};
    criteria.tags.$elemMatch = {};
    criteria.tags.$elemMatch.$in = tags;
  }
  if(req.query.sort) {
    sort = req.query.sort.replace(/,/g, ' ');
  }
  if (req.query.offset) {
    skip = req.query.offset
  }
  if (req.query.limit) {
    limit = req.query.limit;
  }

  Product.find(criteria, fields)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('classifications')
    .populate('distributors')
    .exec(function(err, products) {
      if (err) return next(err);
      Product.count(criteria, function(err, count) {
        if (err) return next(err);
        var records = {};
        records.total = count;
        if (limit && (limit != 0)) {
          records.offset = skip;
          records.limit = limit;
          records.received_records = products.length;
          records.total_pages = Math.ceil(count/limit);
        }
        res.json({ products: products, records: records });
      });
  });
}

exports.editProducts = function(req, res, next) {

  var id = req.params.id;
  var updatedProduct = req.body.product;
  if (!updatedProduct.name) {
    return next(new Error400(
        ApiErrors.PRODUCTNAME_REQUIRED.code,
        ApiErrors.PRODUCTNAME_REQUIRED.msg
    ));
  }
  if (!updatedProduct.code) {
    return next(new Error400(
        ApiErrors.PRODUCTCODE_REQUIRED.code,
        ApiErrors.PRODUCTCODE_REQUIRED.msg
    ));
  }
  Product.findOne({ _id: { $ne: id },
    $or: [
      { name: updatedProduct.name },
      { code: updatedProduct.code }
    ]})
   .exec(function(err, product) {
     if (err) return next(err);
     if (product)
       return next(new Error400(
         ApiErrors.PRODUCTNAME_CODE_EXISTED.code,
         ApiErrors.PRODUCTNAME_CODE_EXISTED.msg
       ));
     Product.findOne({ _id: id })
      .exec(function(err, product) {
        if (err) return next(err);
        product = _.extend(product, updatedProduct)
        product.save(function(err, savedProduct) {
          if (err) return next(err);
          res.json(savedProduct);
        });
      });
   });
}

exports.showProducts = function(req, res, next) {
  var id = req.params.id;
  var fields;
  if (req.params.fields) {
    fields = req.query.fields.replace(/,/g, ' ');
  }
  Product.findOne({ _id: id }, fields)
    .populate('classifications')
    .populate('distributors')
    .exec(function(err, product) {
      if (err) return next(err);
      if (!product) res.json({});
      else res.json(product);
  });
}

exports.deleteProducts = function(req, res, next) {
  var id = req.params.id;
  Product.remove({ _id: id })
    .exec(function(err, product) {
      if (err) return next(err);
      // {"ok": 1, "n": 1}
      res.json(product);
  })
}

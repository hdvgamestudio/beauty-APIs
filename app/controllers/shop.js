// ------------------------
// DEPENDENCIES
// -------------------------
var Error400  = require('../../lib/errors/error400');
var ApiErrors = require('../../lib/apiError');
var _         = require('underscore');
var Shop      = require('../models/shop');

// Method get shop
exports.getShops = function(req, res, next) {
  var criteria = {};
  var offset   = req.query.offset;
  var limit    = req.query.limit;

  if (req.query.q) {
    var expr = new RegExp('.*' + req.query.q + '.*');
    criteria.$or = [
      { name: expr },
      { address: expr}
    ];
  }

  if (req.query.name) {
    criteria.name = req.query.name;
  }

  if (req.query.address) {
    criteria.address = req.query.address;
  }

  Shop.find(criteria)
    .skip(offset)
    .limit(limit)
    .exec( function(err, shops){
      if (err) return next(err);
      Shop.count(criteria, function(err, count){
        if(err) return next(err);
        var records = {};
        records.total = count;
        if(limit && (limit != 0)){
          records.offset         = offset;
          records.limit          = limit;
          records.total_pages    = Math.ceil(count/limit);
          if (!offset) offset = 0;
          records.current_page   = Math.floor(offset/limit) + 1;
        }
        records.received_records = shops.length;
        res.json({shops: shops, records: records });
      });
    });
}

// Method post shop
exports.postShops = function(req, res, next) {
  var reqShop = req.body.shop;

  if (!reqShop) return next(new Error400(
    ApiErrors.SHOPNAME_IS_REQUIRED.code,
    ApiErrors.SHOPNAME_IS_REQUIRED.msg
  ));

  Shop.findOne({ name  : reqShop.name })
    .exec( function(err, shop){
      if (err) return next(err);
      if (shop) return next(new Error400(
        ApiErrors.SHOP_ALREADY_EXISTED.code,
        ApErrors.SHOP_ALREADY_EXISTED.msg
        ));
      var newShop = new Shop(reqShop);
      newShop.save(function(err) {
        if (err) return next(err);
        res.json(newShop);
      });
    });
}

// Method put shop
exports.editShops = function(req, res, next) {
  var reqShop = req.body.shop;
  var id = req.params.id;
  if (!reqShop) return next(new Error400(
    ApiErrors.SHOPNAME_IS_REQUIRED.code,
    ApiErrors.SHOPNAME_IS_REQUIRED.msg));

  Shop.findOne({ name: reqShop.name })
    .exec(function(err, shop){
      if (err) return next(err);
      if (shop) return next(new Error400(
        ApiErrors.SHOP_ALREADY_EXISTED.code,
        ApiErrors.SHOP_ALREADY_EXISTED.msg
      ));
      Shop.findOne({ _id : id })
        .exec(function(err, shop){
          if (err) return next(err);
          if (!shop) return next(new Error400(
            ApiErrors.SHOP_NOT_FOUND.code,
            ApiErrors.SHOP_NOT_FOUND.msg
          ));
          _.extend(shop, reqShop);
          shop.save(function(err) {
            if (err) return next(err);
           res.json(shop);
          });
        });
    });
}

// Method delete shop
exports.deleteShops = function(req, res, next) {
  var id = req.params.id;
  Shop.remove({ _id: id })
    .exec(function(err, shop) {
      if(err) return next(err);
      res.json(shop);
    });
}

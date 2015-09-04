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
        var record = {};
        record.total = count;
        if(limit && (limit != 0)){
          record.offset         = offset;
          record.limit          = limit;
          record.totalPage      = Math.ceil(count/limit);
          record.CurrentPage    = Math.ceil(offset/limit);
        }
        record.receivedRecord = shops.length;
        res.json({shops: shops, record: record });
      });
    });
}

// Method post shop
exports.postShops = function(req, res, next) {
  var shop = req.body.shop;

  if (!shop) return next(new Error400(
    ApiErrors.SHOP_NAME_IS_EMPTY.code,
    ApiErrors.SHOP_NAME_IS_EMPTY.msg
  ));

  Shop.findOne({ name  : shop.name })
    .exec(function(err, sh){
      if (err) return next(err);
      if (sh) return next(new Error400(
        ApiErrors.SHOP_ALREADY_EXISTED.code,
        ApiErrors.SHOP_ALREADY_EXISTED.msg
        ));
      var newShop = new Shop(shop);
      newShop.save(function(err) {
        if (err) return next(err);
        res.json(newShop);
      });
    });
}

// Method put shop
exports.putShops = function(req, res, next) {
  var shop = req.body.shop;
  var id = req.params.id;
  if (!shop) return next(new Error400(
    ApiErrors.SHOPNAME_IS_REQUIRED.code,
    ApiErrors.SHOPNAME_IS_REQUIRED.msg));

  Shop.findOne({ _id : id })
      .exec(function(err, sh){
        if (err) return next(err);
        if (!sh) return next(new Error400(
          ApiErrors.SHOP_NOT_FOUND.code,
          ApiErrors.SHOP_NOT_FOUND.msg
        ));
        _.extend(sh, shop);
        sh.save(function(err) {
          if (err) return next(err);
         res.json(sh);
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

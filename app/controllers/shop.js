//--------------------------
// DEPENDENCE
// -------------------------
var Error400    = require('../../lib/errors/error400');
var ApiErrors    = require('../../lib/apiError');
var Shop        = require('../models/shop');

// Method get shop
exports.getShops = function(req, res, next) {
  var offset   = req.query.offset;
  var limit    = req.query.limit;
  var faddress = req.query.address;
  var fname    = req.query.name;
  if (faddress || fname){
    Shop.find({$or: [
    { name : { $regex: fname }},
    { address : {$regex: faddress }}
    ]})
    .exec( function(err, shops){
      if(err) next(err);
      else res.json(shops)
    })
    .skip(offset)
    .limit(limit);
  }
}

// Method post shop
exports.postShops = function(req, res, next) {
  var shop = req.body.shop;

  if (!shop.name) return next(new Error400(
    ApiErrors.SHOP_NAME_IS_EMPTY.code,
    ApiErrors.SHOP_NAME_IS_EMPTY.msg
  ));

  Shop.findOne({ name : shop.name })
    .exec(function(err, sh){
      if (err) return next(err);

      if (sh) return next();
      var newShop = new Shop({
        name: shop.name,
        address: shop.address,
        phone: shop.phone,
        GPS: shop.GPS
      });
      newShop.save(function(err) {
        if (err) return next(err);
        res.json({ message : 'saved success!'})
      });
    });
}

// Method put shop
exports.putShops = function(req, res, next) {
  var shop = req.body.shop;
  if (!shop.name) return next(new Error400(
    ApiErrors.SHOP_NAME_EMPTY.code,
    ApiErrors.SHOP_NAME_EMPTY.msg));

  Shop.findOne({ name : shop.name })
      .exec(function(err, sh){
        if (err) return next(err);
        if (!sh) return next(new Error400(
          ApiErrors.NOT_FIND_SHOP.code,
          ApiErrors.NOT_FIND_SHOP.msg
        ));
        if (shop.address) sh.address = shop.address;
        if (shop.email) sh.email = shop.email;
        if (shop.phone) sh.phone = shop.phone;
        sh.save(function(err) {
          if (err) return next(err);
          res.json({ message : 'ok'});
        });
      });
}

// Method delete shop
exports.deleteShops = function(req, res, next) {
  var id = req.body.shop.id;
  Shop.remove({_id: id})
    .exec(function(err, shop) {
      if(err) return next(err);
      res.json(shop);
    });
}

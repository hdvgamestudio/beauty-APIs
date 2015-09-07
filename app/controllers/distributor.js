//---------------------------------
//DEPENDENCIES
//---------------------------------

var Error400    = require('../../lib/errors/error400');
var ApiErrors   = require('../../lib/apiError');
var _           = require('underscore');
var Distributor = require('../models/distributor');

exports.getDistributors = function(req, res, next) {
  var id = req.params.id;
  var offset = req.query.offset ? req.query.offset : 0;
  var limit = req.query.limit;
  var criteria = {};

  if (req.query.q) {
    var expr = new RegExp('.*' + req.query.q + '.*');
    criteria.$or = [
      { name : expr },
      { information : expr },
      { email : expr },
      { phone : expr }
    ]
  }

  if (req.query.name) {
    criteria.name = req.query.name;
  }

  if (req.query.information) {
    criteria.information = req.query.information;
  }

  if (req.query.phone) {
    criteria.information = req.query.phone;
  }

  if (req.query.email) {
    criteria.email = req.query.email;
  }

  Distributor.find(criteria)
    .skip(offset)
    .limit(limit)
    .populate('shops')
    .exec(function(err, distributors) {
      if (err) return next(err);
      Distributor.count(criteria, function(err, count) {
        if (err) return next(err);
        var records = {};
        records.total = count;
        if (limit && (limit != 0)) {
          records.offset = offset;
          records.limit = limit;
          records.current_page = Math.floor(offset/limit) + 1;
          records.total_pages = Math.ceil(count/limit);
        }
        records.received_records = distributors.length;
        res.json({ distributors: distributors, records : records });
      });
    });
}

exports.postDistributors = function(req, res, next) {
  var reqDistributor = req.body.distributor;
  if (!reqDistributor) return next( new Error400(
    ApiErrors.DISTRIBUTOR_IS_REQUIRED.code,
    ApiErrors.DISTRIBUTOR_IS_REQUIRED.msg
    ));

  Distributor.findOne({ name : reqDistributor.name })
    .exec(function(err, distributor) {
      if (err) return next(err);
      if (distributor) return next(new Error400(
        ApiErrors.DISTRIBUTOR_ALREADY_EXISTED.code,
        ApiErrors.DISTRIBUTOR_ALREADY_EXISTED.msg
        ));

      var newDistributor = new Distributor(reqDistributor);
      newDistributor.save(function(err) {
        if (err) return next(err);
        res.json(newDistributor);
      });
    });
}

exports.editDistributors = function(req, res, next) {
  var id = req.params.id;
  var reqDistributor = req.body.distributor;
  if (!reqDistributor) return next( new Error400(
    ApiErrors.DISTRIBUTOR_IS_REQUIRED.code,
    ApiErrors.DISTRIBUTOR_IS_REQUIRE.msg
    ));

  Distributor.findOne({ name :reqDistributor.name })
    .exec(function(err, distributor) {
      if (err) return next(err);
      if (distributor) return next(new Error400(
         ApiErrors.DISTRIBUTOR_ALREADY_EXISTED.code,
         ApiErrors.DISTRIBUTOR_ALREADY_EXISTED.msg
      ));

      Distributor.findOne({ _id : id })
        .exec(function( err, distributor) {
          if (err) return next(err);
          if (!distributor) return next( new Error400(
            ApiErrors.DISTRIBUTOR_NOT_FOUND.code,
            ApiErrors.DISTRIBUTOR_NOT_FOUND.msg
          ));
          _.extend(distributor, reqDistributor);
          distributor.save(function(err) {
            if (err) return next(err);
            res.json(distributor);
          });
        });
    });
}

exports.deleteDistributors = function(req, res, next) {
  var id = req.params.id;
  Distributor.remove({ _id: id })
    .exec(function(err, distributor) {
      if (err) return next(err);
      res.json(distributor);
    });
}

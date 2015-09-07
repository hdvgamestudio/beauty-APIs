//---------------------------------
//DEPENDENCIES
//---------------------------------

var Error400    = require('../../lib/errors/error400');
var ApiErrors   = require('../../lib/apiError');
var _           = require('underscore');
var Distributor = require('../models/distributor');

exports.getDistributor = function(req, res, next) {
	var id = req.params.id;
	var offset = req.query.offset;
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
		.populate('shops','name address')
		.exec( function(err, dtbutors){
			if (err) return next(err);
			Distributor.count(criteria, function(err, count){
				if (err) return next(err);
				var record = {};
				record.total = count;
				if (limit && (limit != 0)) {
					record.offset = offset;
					record.limit = limit;
					record.currentPages = Math.ceil(offset/limit);
					record.totalPages = Math.ceil(count/limit);
				}
				record.receivedRecords = dtbutors.length;
				res.json({ distributors: dtbutors, record : record });
			});
		});
}

exports.postDistributor = function(req, res, next) {
	console.log("post");
  var distributor = req.body.distributor;
  if (!distributor) return next( new Error400(
    ApiErrors.DISTRIBUTOR_IS_REQUIRED.code,
    ApiErrors.DISTRIBUTOR_IS_REQUIRED.msg
    ));
	console.log('bug #1');
  Distributor.findOne({ name : distributor.name })
    .exec( function(err, distri) {
			console.log('bug #2');
      if (err) return next(err);
			console.log('bug #3');
      if (distri) return next(new Error400(
        ApiErrors.DISTRIBUTOR_ALREADY_EXISTED.code,
        ApiErrors.DISTRIBUTOR_ALREADY_EXISTED.msg
        ));

      var newDistributor = new Distributor(distributor);
			console.log(newDistributor);
      newDistributor.save( function(err) {
        if (err) return next(err);
        res.json(newDistributor);
      });
    });
}

exports.putDistributor = function(req, res, next) {
  var id = req.params.id;
  var distributor = req.body.distributor;
  if (!distributor) return next( new Error400(
    ApiErrors.DISTRIBUTOR_IS_REQUIRED.code,
    ApiErrors.DISTRIBUTOR_IS_REQUIRE.msg
    ));
  Distributor.findOne({ name : distributor.name })
    .exec( function(err, findDistri) {
      if (err) return next(err);
      if (findDistri) return next( new  Error400(
         ApiErrors.DISTRIBUTOR_ALREADY_EXISTED.code,
         ApiErrors.DISTRIBUTOR_ALREADY_EXISTED.msg
      ));
      Distributor.findOne({ _id : id })
        .exec( function( err, distri) {
          if (err) return next(err);
          if (!distri) return next( new Error400(
            ApiErrors.DISTRIBUTOR_NOT_FOUND.code,
            ApiErrors.DISTRIBUTOR_NOT_FOUND.msg
          ));
          _.extend( distri, distributor);
          distri.save( function(err) {
            if (err) return next(err);
            res.json(distri);
          });
        });
    });
}

exports.deleteDistributor = function(req, res, next) {
  var id = req.params.id;
  Distributor.remove({ _id: id })
    .exec( function(err, distri){
      if (err) return next(err);
      res.json(distri);
    });
}

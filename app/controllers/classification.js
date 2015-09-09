var Classification = require('../models/classification');
var _              = require('underscore');
var ApiErrors      = require('../../lib/apiError');
var Error400       = require('../../lib/errors/error400');

exports.postClassifications = function(req, res, next) {
  var newClassification = req.body.classification;
  Classification.findOne({ name: newClassification.name })
    .exec(function(err, classification) {
      if (err) return next(err);
      if (classification)
        return next(new Error400(
          ApiErrors.CLASSIFICATION_NAME_EXISTED.code,
          ApiErrors.CLASSIFICATION_NAME_EXISTED.msg
        ));
      var classification = new Classification(newClassification);
      classification.save(function(err, savedClass) {
        if (err) return next(err);
        res.json(savedClass);
      })
  })
}

exports.getClassifications = function(req, res, next) {
  Classification.find({})
    .exec(function(err, classifications) {
      if (err) return next(err);
      res.json(classifications);
  })
}

exports.editClassifications = function(req, res, next) {
  var updatedClassification = req.body.classification;
  var id = req.params.id;
  Classification.findOne({ name: updatedClassification.name, _id: { $ne: id }})
    .exec(function(err, classification) {
      if (err) return next(err);
      if (classification)
        return next(new Error400(
          ApiErrors.CLASSIFICATION_NAME_EXISTED.code,
          ApiErrors.CLASSIFICATION_NAME_EXISTED.msg
        ));
      Classification.findOne({ _id: id })
        .exec(function(err, classification) {
          if (err) return next(err);
          classification = _.extend(classification, updatedClassification);
          classification.save(function(err, savedClassification) {
            if (err) return next(err);
            res.json(savedClassification);
          });
      });
  });
}

exports.showClassifications = function(req, res, next) {
  var id = req.params.id;
  Classification.findOne({ _id: id })
    .populate('childs')
    .populate('parents')
    .exec(function(err, classification) {
      if (err) return next(err);
      res.json(classification);
  });
}

exports.deleteClassifications = function(req, res, next) {
  var id = req.params.id;
  Classification.remove({ _id: id })
    .exec(function(err, result) {
      if (err) return next(err);
      //{ "ok": 1, n: 1
      res.json(result);
  });
}

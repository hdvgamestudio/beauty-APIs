var Comment       = require('../models/comment');
var _             = require('underscore');

exports.postComments = function(req, res, next) {
	var newComment = req.body.comment;
	var comment = new Comment(newComment);
	comment.save(function(err, savedComment) {
		if (err) return next(err);
		res.json(savedComment);
	});
};

exports.getComments = function(req, res, next) {
	var id = req.params.id;
	var skip = 0;
	var limit;
	if (req.query.offset) {
		skip = req.query.offset;
	}
	if (req.query.limit) {
		limit = req.query.limit;
	}
	Comment.find({ product_id: id })
		.skip(skip)
		.limit(limit)
	  .exec(function(err, comments) {
			if (err) return next(err);
			Comment.count({ product_id: id }, function(err, count) {
				if (err) return next(err);
				var records = {};
				records.total = count;
				if (limit && (limit != 0)) {
					records.offset = skip;
					records.limit = limit;
					records.received_records = comments.length;
					records.total_pages = Math.ceil(count/limit);
				}
				res.json({comments: comments, records: records});
			});
	});
};

exports.showComments = function(req, res, next) {
	var id = req.params.comment_id;
	Comment.findOne({_id: id})
		.exec(function(err, comment) {
			if (err) return next(err);
			if (!comment) res.json({});
      else {
        res.json(comment);
      }
	});
};

exports.editComments = function(req, res, next) {
	var updatedComment = req.body.comment;
	console.log(JSON.stringify(req.params));
	Comment.findOne({ _id: req.params.comment_id })
		.exec(function(err, comment) {
			if (err) return next(err);
			comment = _.extend(comment, updatedComment);
			comment.save(function(err, savedComment) {
				if (err) return next(err);
				res.json(savedComment);
			});
	});
};

exports.deleteComments = function(req, res, next) {
	var id = req.params.comment_id;
	Comment.remove({ _id: id})
		.exec(function(err, comment) {
			if (err) return next(err);
			// {"ok": 1, "n": 1}
			res.json(comment);
	});
};

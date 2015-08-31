var Comment    = require('../models/comment');
var User       = require('../models/user');
var status     = {
	LIKED: "liked",
	UNLIKED: "unliked"
}

exports.postLikes = function(req, res, next) {
	var like = req.body.like;
	var productID = req.params.product_id;
	var commentID = req.params.comment_id;
	Comment.findOne({
		_id: commentID,
		"likes.users": like.user_id
	})
	.exec(function(err, comment) {
		if (err) return next(err);
		if (!comment) {
			Comment.update({ _id: commentID },
			 	{
					$push: { "likes.users": like.user_id },
					$inc: { "likes.count": 1 }
				})
				.exec(function(err, comment) {
					if (err) return next(err);
					Comment.findOne ({_id: commentID})
						.exec(function(err, comment) {
							if (err) return next(err);
							if (!comment) res.json({});
							else {
								res.json({
									comment_id: commentID,
									likes: comment.likes.count,
									user_id: like.user_id,
									status: status.LIKED
								})
							}
					});
			})
		} else {
			Comment.update({ _id: commentID },
				{
					$pull: { "likes.users": like.user_id },
					$inc: { "likes.count": -1 }
				})
				.exec(function(err, comment) {
					if (err) return next(err);
					Comment.findOne ({_id: commentID})
						.exec(function(err, comment) {
							if (err) return next(err);
							if (!comment) res.json({});
							else {
								res.json({
									comment_id: commentID,
									likes: comment.likes.count,
									user_id: like.user_id,
									status: status.UNLIKED
								})
							}
					});
			})
		}
	});
};

exports.getLikes = function(req, res, next) {
	var commentId = req.params.comment_id;
	Comment.findOne({_id: commentId})
		.populate('likes.users')
		.exec(function(err, comment) {
			if (err) return next(err)
			if (!comment) res.json({})
			else {
				res.json({
					product_id: comment.product_id,
					comment_id: commentId,
					likes: comment.likes
				});
			}
	})
};

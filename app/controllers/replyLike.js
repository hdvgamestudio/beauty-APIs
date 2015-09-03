var Comment    = require('../models/comment');
var User       = require('../models/user');
var like       = require('../models/like')

exports.postLikes = function(req, res, next) {
  var like = req.body.like;
  var commentID = req.params.comment_id;
  var replyID = req.params.reply_id;
  Comment.findOne({
    _id: commentID,
		"replies._id": replyID,
    "replies.likes.users": like.user_id
  })
  .exec(function(err, comment) {
    if (err) return next(err);
    if (!comment) {
      Comment.update({ _id: commentID, "replies._id": replyID },
        {
          $push: { "replies.$.likes.users": like.user_id },
          $inc: { "replies.$.likes.count": 1 }
        })
        .exec(function(err, comment) {
          Comment.findOne (
						{ _id: commentID, "replies._id": replyID },
						{ "replies.$": 1 })
            .exec(function(err, comment) {
              if (err) return next(err);
              if (!comment) res.json({});
              else {
                res.json({
                  comment_id: commentID,
                  reply_id: replyID,
                  likes: comment.replies[0].likes.count,
                  user_id: like.user_id,
                  status: like.LIKED
                })
              }
          });
      })
    } else {
      Comment.update({ _id: commentID, "replies._id": replyID },
        {
          $pull: { "replies.$.likes.users": like.user_id },
          $inc: { "replies.$.likes.count": -1 }
        })
        .exec(function(err, comment) {
          if (err) return next(err);
          Comment.findOne (
            { _id: commentID, "replies._id": replyID },
            { "replies.$": 1 })
            .exec(function(err, comment) {
              if (err) return next(err);
              if (!comment) res.json({});
              else {
                res.json({
                  comment_id: commentID,
									reply_id: replyID,
                  likes: comment.replies[0].likes.count,
                  user_id: like.user_id,
                  status: like.UNLIKED
                })
              }
          });
      })
    }
  });
};

exports.getLikes = function(req, res, next) {
  var commentId = req.params.comment_id;
  var replyID = req.params.reply_id;
	Comment.findOne(
		{ _id: commentId, "replies._id": replyID },
		{ "replies.$": 1 })
    .populate('replies.likes.users')
    .exec(function(err, comment) {
      if (err) return next(err);
      if (!comment) res.json({});
      else {
        res.json({
          comment_id: commentId,
          reply_id: replyID,
          users: comment.replies[0].likes.users,
          likes: comment.replies[0].likes.count
        });
      }
  })
};

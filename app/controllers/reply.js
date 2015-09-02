var Comment     = require('../models/comment')
var utils       = require('../../lib/utils');

exports.postReplies = function(req, res, next) {
  var comment_id = req.params.comment_id;
  var reply = req.body.reply;
  Comment.update(
    { _id: comment_id },
    {
      $push: { "replies": reply }
    })
    .exec(function(err, comment) {
      if (err) return next(err);
      res.json(comment);
  })
}

exports.getReplies = function(req, res, next) {
  var comment_id = req.params.comment_id;
  var offset = 0;
  if (req.query.offset) {
    offset = parseInt(req.query.offset);
  }
  var limit = parseInt(req.query.limit);
  if (limit) {
    Comment.findOne(
      { _id: comment_id },
      { _id: 1, replies: { $slice: [offset, limit] }})
      .exec(function(err, comment) {
        if (err) next(err);
        if (!comment) res.json({});
        else res.json(comment.replies);
    })
  } else {
    Comment.findOne(
      { _id: comment_id },
      { _id: 1, replies: 1})
      .exec(function(err, comment) {
        if (err) next(err);
        if (!comment) res.json({});
        else res.json(comment.replies);
    })
  }
};

exports.editReplies = function(req, res, next) {
  var reply_id = req.params.reply_id;
  var comment_id = req.params.comment_id;
  var reply = req.body.reply;
  Comment.update(
      { _id: comment_id, "replies._id": reply_id },
      {
        $set: {
          "replies.$.message": reply.message
        },
        $currentDate: {
          "replies.$.modified_at": true
        }
      })
    .exec(function(err, result) {
      if (err) return next(err);
      result.comment_id = comment_id;
      result.reply_id = reply_id;
      result.message = reply.message;
      res.json(result);
  });

}

exports.deleteReplies = function(req, res, next) {
  var comment_id = req.params.comment_id;
  var reply_id = req.params.reply_id;

  Comment.update( {_id: comment_id}, { $pull: { replies: { _id: reply_id }}})
    .exec(function(err, result) {
      if (err) return next(err);
      result.comment_id = comment_id;
      result.reply_id = reply_id;
      res.json(result);
  })
}

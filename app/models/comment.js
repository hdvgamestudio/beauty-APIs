var mongoose = require('mongoose');
var Schema = mongoose.Schema

var ReplySchema = new Schema({
	user_id: {
		type: Schema.ObjectId,
		require: true,
		ref: 'User'
	},
	username: {
		type: String,
		required: true
	},
	user_icon_url: {
		type: String
	},
	posted_at: {
		type: Date,
		"default": Date.now
	},
	message: {
		type: String,
		required: true
	},
	likes: {
		users: [{
			type: Schema.ObjectId,
			ref: 'User'
		}],
		count: {
			type: Number,
			"default": 0
		}
	}
});

var CommentSchema = new Schema({
  product_id: {
    type: Schema.ObjectId,
    required: true,
    ref: 'Product'
	},
	user_id: {
		type: Schema.ObjectId,
		require: true,
		ref: 'User'
	},
	username: {
		type: String,
		require: true
	},
	user_icon_url: {
		type: String
	},
	posted_at: {
		type: Date,
		"default": Date.now
	},
	message: {
		type: String,
		required: true
	},
	likes: {
		users: [{
			type: Schema.ObjectId,
			required: true,
			ref: 'User'
		}],
		count: {
			type: Number,
			"default": 0,
		}
	},
	replies: [ReplySchema]
});

module.exports = mongoose.model('Comment', CommentSchema);

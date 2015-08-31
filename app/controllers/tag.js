//body
/*
{
	tag: {
		"name": "nodejs";
	}
}
*/
var Error400 = require('../../lib/errors/error400');
var ApiErrors = require('../../lib/apiError');
var Tag = require('../models/tag');

var isValid;

exports.getTags = function( req, res, next){
	Tag.find( function(err, users) {
		if(err)
			res.send(err);
		else res.send(users);
	});
	console.log('hello');
}

// insert new tag
exports.postTags = function( req, res, next) {
	var tagName = req.body.tag.name;
  if( !tagName ) return next(new Error400(
		ApiErrors.TAG_IS_NULL.code,
		ApiErrors.TAG_IS_NULL.msg
		));
	Tag.findOne({ name : tagName },
		function(err, tag){
			if(err) return next(new Error(err.message));
			if(tag) return next(new Error400(
				ApiErrors.TAG_NAME_EXISTED.code,
				ApiErrors.TAG_NAME_EXISTED.msg
			));
			// To do save
			var newTag = new Tag({ name: tagName });
			newTag.save( function(err, savedTag){
				if(err) return next(new Error(err.message));
				res.json(savedTag);
			});
		});
}


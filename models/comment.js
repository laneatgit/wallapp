"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validator = require('../lib/validator');

var Comment = new Schema({
  content: {
    type: String,
    required: true,
    validate: validator.validate('isLength', 2, 255)
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Number,
    default: Date.now
  },
  belongToPost: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  
});


Comment.statics.getWith = function(opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  opts.limit = opts.limit || 20;
  var query = this.find({belongToPost:opts.belongToPost});

  if (opts.older) {
    query = query.where('createdAt').lte(opts.older);
  } else if (opts.newer) {
    query = query.where('createdAt').gte(opts.newer);
  }

  query.limit(opts.limit).populate({
    path: 'author',
    select: 'username email'
  })
  .sort('-createdAt')
  .exec(callback);
};



module.exports = mongoose.model('Comment', Comment);

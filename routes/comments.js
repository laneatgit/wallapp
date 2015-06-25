"use strict";

var errTo = require('errto');
var niceErr = require('nice-error');

exports.show = function(req, res, next) {
  var postid = req.params.postid;

  req.Post.findById(postid, function (err, post) {
    if (err) next(err);
    var opts = {belongToPost: post};
    var tpl = 'comment';
    req.Comment.getWith(opts, errTo(next, function(comments) {
    res.render(tpl, {
        postid: postid,
        comments: comments,
        user: req.user,
        successMsg: req.flash('success')[0],
        errorMsg: req.flash('error')[0]
      });
    }));
    
  });

 
};

exports.create = function(req, res, next) {
  
  var postid = req.body.postid;
  req.Post.findById(postid, function (err, post) {
    if (err) next(err);
    
    // if can not find?
    var comment = new req.Comment({
      content: req.body.content,
      author: req.user._id,
      belongToPost: post,
    });
    comment.save(function(err) {
      if (err) {
        if (err.name === 'ValidationError') {
          req.flash('error', 'Could not publish the comment, please make sure it has a length of 2-255 chars');
        } else {
          next(err);
        }
      } else {
        
        post.comments.push(comment);
        post.save(function(err){
          if (err) next(err);
          req.flash('success', 'Successfully published the comment');
        });

      }
      res.redirect('/');
    });
    
  }); 

  
};




"use strict";

var errTo = require('errto');
var niceErr = require('nice-error');

exports.new = function(req, res) {
  res.render('post', {user: req.user});
};

exports.index = function(req, res, next) {
  var opts = {};
  var tpl = 'index';

  if (req.query.partial) {
    opts.older = req.query.older;
    tpl = '_posts';
  }
  
 
  
  req.Post.getWith(opts, errTo(next, function(posts) {
    res.render(tpl, {
      posts: posts,
      user: req.user,
      successMsg: req.flash('success')[0],
      errorMsg: req.flash('error')[0]
    });
  }));
};

exports.create = function(req, res, next) {
  var post = new req.Post({
    content: req.body.content,
    //author: req.user._id
  });
  if (req.user) {
    post.author = req.user._id;
  }

  post.save(function(err) {
    if (err) {
      if (err.name === 'ValidationError') {
        req.flash('error', 'Could not publish the post, please make sure it has a length of 2-255 chars');
      } else {
        return next(err);
      }
    } else {
      req.flash('success', 'Successfully published the post');
      // creating another var so we can populate the author details
      var _author;
      if (req.user){
        _author = {
          username: req.user.username,
          email: req.user.email
        };
      }
      var _post = {
        _id: post._id,
        content: post.content,
        createdAt: post.createdAt,
        author: _author
      };
      
      if (req.user) {
          _post.author =   {
            username: req.user.username,
            email: req.user.email
          };
      } else{
          _post.author =   {
            username: 'anoymous',
            email: ''
          };
      }

      res.render('_posts', {
        posts: [_post]
      }, function(err, content) {
        if (!err) {
          // Note: this works fine for a single process, but when having
          // more processes a message bus (like Redis for example) is needed
          // (to listen for new events emitted by different processes and
          // broadcast them to the clients)
          return req.broadcast(content);
        }
        console.error(niceErr(err));
      });
    }

    res.redirect('/');
  });
};

exports.voteUp = function(req, res, next) {
  req.Post.findById(req.params.postid, function (err, post) {
  if (err) next(err);
  post.likes += 1;
  post.save(function (err) {
    if (err) next(err);
    res.redirect('/');
    });
  });
};


exports.voteDown = function(req, res, next) {
  req.Post.findById(req.params.postid, function (err, post) {
  if (err) next(err);
  post.dislikes += 1;
  post.save(function (err) {
    if (err) next(err);
    res.redirect('/');
    });
  });
};


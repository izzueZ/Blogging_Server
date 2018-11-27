var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

router.get('/:username', function(req, res, next) {
	const username = req.params.username;
	const db = req.app.get('db');
	const posts = db.collection('Posts');

  	if (req.cookies.jwt == null){
  		return res.status(401).send('JWT Cookie Authentication Failed.\n');
  	}
  	var d_token;
  	try {
  		d_token = jwt.verify(req.cookies.jwt, 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c');
  	} catch(e) {
  		return res.status(401).send('JWT Expired.\n');
  	}
	if (d_token.usr != username) {
		return res.status(401).send('Unauthorized.\n');
	}

	posts.find({
		username: username
	}).toArray(function(err, doc) {
		if(err) throw err;
		return res.status(200).json(doc);
	});

});

router.get('/:username/:postid', function(req, res, next) {
	const username = req.params.username;
	const postid = parseInt(req.params.postid);
	const db = req.app.get('db');
	const posts = db.collection('Posts');

  	if (req.cookies.jwt == null){
  		return res.status(401).send('JWT Cookie Authentication Failed.\n');
  	}
  	var d_token;
  	try {
  		d_token = jwt.verify(req.cookies.jwt, 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c');
  	} catch(e) {
  		return res.status(401).send('JWT Expired.\n');
  	}
	if (d_token.usr != username) {
		return res.status(401).send('Unauthorized.\n');
	}

	posts.findOne({
		username: username,
		postid: postid
	}, function(err, doc) {
		if(err) throw err;
		if(doc == null)
			return res.status(404).send('Not Found.\n');
		else {
			return res.status(200).json(doc);
		}
	});
});

router.post('/:username/:postid', function(req, res, next){
	const username = req.params.username;
	const postid = parseInt(req.params.postid);
	const db = req.app.get('db');
	const posts = db.collection('Posts');

	console.log(req.body);
  	var title = req.body.title;
  	var body = req.body.body;
  	if (title == null || body == null) {
  		return res.status(400).send('Title and body cannot be empty!');
  	}

  	if (req.cookies.jwt == null){
  		return res.status(401).send('JWT Cookie Authentication Failed. JWT not found.\n');
  	}
  	var d_token;
  	try {
  		d_token = jwt.verify(req.cookies.jwt, 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c');
  	} catch(e) {
  		return res.status(401).send('JWT Expired\n');
  	}
  	
	if (d_token.usr != username) {
		return res.status(401).send('Unauthorized.\n');
	}
	console.log("Passed jwt in POST.\n")
	var dateNow = new Date();
	var timeNow = dateNow.getTime();
	console.log(dateNow);
	console.log(timeNow);

	var new_post_object = {
		postid: postid,
		username: username,
	    created: timeNow,
	    modified: timeNow,
	    title: title,
	    body: body
  	};

  	var check_dup = false;

  	posts.findOne({
		username: username,
		postid: postid
	}, function(err, doc) {
		if(err) throw err;
		if(doc != null){
			check_dup = true;
			return res.status(400).send('Post Already Existed.\n');
		}
		else{
			posts.insertOne(
				new_post_object, function(err, doc) {
				if(err) throw err;
				return res.status(201).send();
			});
		}
	});
});

router.put('/:username/:postid', function(req, res, next){
	const username = req.params.username;
	const postid = parseInt(req.params.postid);
	const db = req.app.get('db');
	const posts = db.collection('Posts');
	//var reader = new commonmark.Parser();
  	//var writer = new commonmark.HtmlRenderer();
  	var title = req.body.title;
  	var body = req.body.body;

  	if (title == null || body == null) {
  		return res.status(400).send('Title and body cannot be empty!');
  	}

  	if (req.cookies.jwt == null){
  		return res.status(401).send('JWT Cookie Authentication Failed.\n');
  	}
  	var d_token;
  	try {
  		d_token = jwt.verify(req.cookies.jwt, 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c');
  	} catch(e) {
  		return res.status(401).send('JWT Expired.\n');
  	}
  	var dateNow = new Date();
	if (d_token.usr != req.params.username) {
		return res.status(401).send('Unauthorized.\n');
	}

	var post_locator = {
		postid: postid,
		username: username
	}
	var post_update = {
	    modified: dateNow.getTime(),
	    title: title,
	    body: body
  	};

  	posts.findOne({
		username: username,
		postid: postid
	}, function(err, doc) {
		if(err) throw err;
		if(doc == null)
			return res.status(400).send('Post Not Found.\n');
		else {
			posts.updateOne(
				post_locator, {$set: post_update}, function(err, doc) {
				if(err) throw err;
				return res.status(200).send('OK.\n');
			});
		}
	});
});

router.delete('/:username/:postid', function(req, res, next){
	const username = req.params.username;
	const postid = parseInt(req.params.postid);
	const db = req.app.get('db');
	const posts = db.collection('Posts');
	//var reader = new commonmark.Parser();
  	//var writer = new commonmark.HtmlRenderer();

  	if (req.cookies.jwt == null){
  		return res.status(401).send('JWT Cookie Authentication Failed.\n');
  	}
  	var d_token;
  	try {
  		d_token = jwt.verify(req.cookies.jwt, 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c');
  	} catch(e) {
  		return res.status(401).send('JWT Expired.\n');
  	}
	if (d_token.usr != req.params.username) {
		return res.status(401).send('Unauthorized.\n');
	}

	posts.findOne({
		username: username,
		postid: postid
	}, function(err, doc) {
		if(err) throw err;
		if(doc == null)
			return res.status(400).send('Post Not Found.\n');
		else {
			posts.deleteOne({
				username: username,
				postid: postid
			}, function(err, doc) {
				if(err) throw err;
				return res.status(204).send('No Content.\n');
			});
		}
	});
});


module.exports = router;
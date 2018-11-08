var express = require('express');
var commonmark = require('commonmark');
var router = express.Router();

router.get('/:username/:postid', function(req, res, next) {
	const username = req.params.username;
	const postid = parseInt(req.params.postid);
	const db = req.app.get('db');
	const posts = db.collection('Posts');
	var reader = new commonmark.Parser();
  	var writer = new commonmark.HtmlRenderer();

	posts.findOne({
		username: username,
		postid: postid
	}, function(err, doc) {
		if(err) throw err;
		if(!doc)
			res.sendStatus(404);
		else {//document exists
			var parsed_title = reader.parse(doc.title);
			var result_title = writer.render(parsed_title);
			var parsed_body = reader.parse(doc.body);
			var result_body = writer.render(parsed_body);

			res.render('blog', { 
				username: username,
				postid: postid,
				title: result_title,
				body: result_body,
				created: doc.created,
				modified: doc.modified
			}); //res.render
		}
	}); //posts.findOne
	
}); //router.get

router.get('/:username', function(req, res, next) {
	const username = req.params.username;
	var start_postid;
	if (req.query.start != null){
		start_postid = parseInt(req.query.start);
	} else {
		start_postid = 0;
	}
	const db = req.app.get('db');
	const posts = db.collection('Posts');
	var reader = new commonmark.Parser();
  	var writer = new commonmark.HtmlRenderer();
  	var length = 5;

	posts.find({
		username: username, 
		postid: {$gte: start_postid}	
	}).toArray(function(err, doc) {
		if(err) throw err;
		if(doc.length === 0)
			res.sendStatus(404);
		else {
			var result_titles = [];
			var result_bodys = [];
			var i = 0;
			if(doc.length < 5)
				length = doc.length;
			
			for (; i < length; i++){
				var parsed_title = reader.parse(doc[i].title);
				var result_title = writer.render(parsed_title);
				var parsed_body = reader.parse(doc[i].body);
				var result_body = writer.render(parsed_body);
				result_titles.push(result_title);
				result_bodys.push(result_body);
			}

			var next_postid = 0;
			if(doc.length > 5)
				next_postid = doc[i].postid;

			res.render('blog_list', { 
				username: username,
				start_postid: start_postid,
				next_postid: next_postid,
				titleArray: result_titles,
				bodyArray: result_bodys
			}); //res.render
		}
	}); //posts.find
	
});

module.exports = router;
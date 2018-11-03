var express = require('express');
var commonmark = require('commonmark');
var router = express.Router();


/* GET blog page. */
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
	}); //posts.findOne
	
}); //router.get

router.get('/:username', function(req, res, next) {
	const username = req.params.username;
	var start_postid;
	if (req.query.start != null){
		start_postid = req.query.start;
	}
	else{
		start_postid = 0;
	}
	const db = req.app.get('db');
	const posts = db.collection('Posts');
	var reader = new commonmark.Parser();
  	var writer = new commonmark.HtmlRenderer();
  	var length

	posts.find({
		username: username
	}, {}).toArray(function(err, doc) {
		var result_titles = [];
		var result_bodys = [];
		length = doc.length;
		for (var i = start_postid; i<doc.length; i++){
			var parsed_title = reader.parse(doc[i].title);
			var result_title = writer.render(parsed_title);
			result_titles.push(result_title);
			var parsed_body = reader.parse(doc[i].body);
			var result_body = writer.render(parsed_body);
			result_bodys.push(result_body);
		}
		res.render('blog_list', { 
			username: username,
			start_postid: start_postid,
			titleArray: result_titles,
			bodyArray: result_bodys,
			created: doc.created,
			modified: doc.modified
		}); //res.render
	}); //posts.find
	
});

module.exports = router;
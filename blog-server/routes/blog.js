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

module.exports = router;
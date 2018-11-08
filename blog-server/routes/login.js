var bcrypt = require('bcrypt');
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

router.get('/', function(req, res, next) {
	const redirect = req.query.redirect;

	res.render('login', {
		username: "",
		password: "",
		redirect: redirect
	});
});

router.post('/', function(req, res, next){
	const key = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";
	const options = { header: {
					  "alg": "HS256",
					  "typ": "JWT"
					}};
	const username = req.body.username;
	const password = req.body.password;
	const redirect = req.body.redirect;
	const db = req.app.get('db');
	const users = db.collection('Users');

	if(username == "" || password === "") {
		console.log("Username or password is empty");
		res.render('login', {
			username: "",
			password: "",
			redirect: redirect
		});
		return;
	}
	console.log(username);
	console.log(password);
	
	users.findOne({
		username: username
	}, function(err, doc){
		if (doc){
			bcrypt.compare(password, doc.password, function(err, match){
				if (match){
					console.log("Login Successfully");
					jwt.sign({
							  "exp": Math.floor(Date.now() / 1000) + (2 * 60 * 60),
							  "usr": "username"
							}, key, options, function(err, token) {
								res.cookie("jwt", token, {expires: 0});
								if(redirect) {
									res.redirect(redirect);
								}
								else {
									res.status(200).send("Authentication Successfully");
								}
							});
				} else {
					console.log("Password incorrect for user: " + username);
					res.status(401);
					res.render('login', {
						username: username,
						password: password,
						redirect: redirect
					});
				}
			});
		} else {
			console.log("Username doesn't exist in database.");
			res.render('login', {
				username: username,
				password: password,
				redirect: redirect
			});
		}
	});
});

module.exports = router;
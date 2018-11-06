var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	
});

router.post('/', function(req, res, next){
	const username = req.query.username;
	const password = req.query.password;
	const redirect = req.query.redirect;
	const db = req.app.get('db');
	const users = db.collection('Users');

	users.findOne({username:username},
		function(err, doc){
			if (doc != null){
				bcrypt.compare(doc.password, password,
					function(err, doc){
						if (doc == true){
							//TODO: Set Up JWT
						}
						else{
							//TODO: Login Failed: wrong password
						}
					});
			}
			else{
				//TODO: Login Filed: non-existent username
			}
		});
});

module.exports = router;
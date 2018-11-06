use BlogServer
var file = cat('./posts_test.json')
var o = JSON.parse(file)
db.Posts.insert(o)
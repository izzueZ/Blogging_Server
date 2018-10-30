use BlogServer
db.createCollection("Posts")
db.createCollection("Users")

var file = cat('./posts.json')
var o = JSON.parse(file)
db.Posts.insert(o)

file = cat('./users.json')
o = JSON.parse(file)
db.Users.insert(o)  
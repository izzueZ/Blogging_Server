#GET
#401 no cookie
curl -H "Accept:application/json" http://localhost:3000/api/cs144 
#200 /:username
curl -i -H "Accept:application/json" -b "jwt=" http://localhost:3000/api/cs144
#200 /:username:postid
curl -i -H "Accept:application/json" -b "jwt=" http://localhost:3000/api/cs144/1
#404: Post not in DB
curl -i -H "Accept:application/json" -b "jwt=" http://localhost:3000/api/cs144/9

#POST
#401 no cookie
curl -i -X POST -H "Content-Type:application/json" http://localhost:3000/api/cs144/10 -d '{"title":"Post 10","body":"this is the body for post 10"}'
#400 Bad Request (Invalid Syntax)
curl -i -b "jwt=" -d "title=post%2010&body=format%20not%20in%20json" http://localhost:3000/api/cs144/10
#404 (GET) Post not in DB
curl -i -H "Accept:application/json" -b "jwt=" http://localhost:3000/api/cs144/10
#201 
curl -i -X POST -H "Content-Type:application/json" -b "jwt=" http://localhost:3000/api/cs144/10 -d '{"title":"Post 10","body":"this is the body for post 10"}'
#400 Post Already Existed
curl -i -X POST -H "Content-Type:application/json" -b "jwt=" http://localhost:3000/api/cs144/10 -d '{"title":"Post 10 dup","body":"duplicated"}'
#200 (GET) content:{"title":"Post 10","body":"this is the body for post 10"}
#created_time = modified_time
curl -i -H "Accept:application/json" -b "jwt=" http://localhost:3000/api/cs144/10


#PUT
#401 no cookie
curl -i -X PUT -H "Content-Type:application/json" http://localhost:3000/api/cs144/10 -d '{"title":"Post 10 dup","body":"duplicated"}'
#400 Bad Request (Invalid Syntax)
curl -i -X PUT -b "jwt=" -d "title=post%2010&body=format%20not%20in%20json" http://localhost:3000/api/cs144/10
#200 
curl -i -X PUT -H "Content-Type:application/json" -b "jwt=" http://localhost:3000/api/cs144/10 -d '{"title":"Post 10 dup","body":"duplicated"}'
#400 Post not in DB
curl -i -X PUT -H "Content-Type:application/json" -b "jwt=" http://localhost:3000/api/cs144/9 -d '{"title":"Post 9","body":"body"}'
#200 (GET) content:{"title":"Post 10 dup","body":"duplicated"}
#created_time < modified_time
curl -i  -H "Accept:application/json" -b "jwt=" http://localhost:3000/api/cs144/10
#400 Post Already Existed
curl -i  -H "Accept:application/json" -b "jwt=" -d "title=post%2010&body=format%20not%20in%20json" http://localhost:3000/api/cs144/10

#DELETE
#400 no cookie
curl -i -X DELETE -b  http://localhost:3000/api/cs144/10
#200 (GET) content:{"title":"Post 10 dup","body":"duplicated"}
curl -i -H "Accept:application/json" -b "jwt=" http://localhost:3000/api/cs144/10
#204 
curl -i -X DELETE -b "jwt=" http://localhost:3000/api/cs144/10
#404 (GET) Post is Deleted
curl -i -H "Accept:application/json" -b "jwt=" http://localhost:3000/api/cs144/10
#400 Post not in DB
curl -i -X DELETE -b "jwt=" http://localhost:3000/api/cs144/9


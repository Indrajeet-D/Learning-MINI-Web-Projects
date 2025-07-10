const express=require("express")
const app=express()
const port=8080
const path=require("path")

//using UUID to generrate a unique id for posts
const {v4:uuidv4}  =require("uuid")
//to use this we use the func ::  uuidv4() -- create unique ids

//to use patch and delete as in case client can not send such request as html support only get and post request
const methodOverride=require("method-override")


app.use(express.urlencoded({extended:true}))

//will use overide method
app.use(methodOverride('_method'))

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

app.use(express.static(path.join(__dirname,"public")))

app.listen(port,()=>{
    console.log("listening at : 8080")
})

// app.get("/",(req,res)=>{    //checking server
//      res.send("server running well.........") 
// })


//creating a array for posts as we dont possess the database
let posts=[
    {   id:uuidv4(),
        username:"Indra",
        content:"hello , are you working well!!"
    },
    {   id:uuidv4(),
        username:"Rudra",
        content:" hard work paves agaian~"
    },
    {   id:uuidv4(),
        username:"Kushagra",
        content:"Time is very powerfull, dont waste it..!!"
    }
];

app.get("/posts",(req,res)=>{   //index route--used get request to get all posts (it get all data of all posts)
    res.render("index.ejs",{posts})
})

//creating new posts:
//have tow thing 1--serving the form 
//               2--taking the request by post and making a new post visible and adding it to array(database)   

app.get("/posts/new",(req,res)=>{ //get is used to send(render) from
    res.render("new.ejs")
})


//post is used to add new post (add new data)
app.post("/posts",(req,res)=>{
    // res.send("post iis workinng")
    let {username,content}=req.body //here we created a object with username as key and name coming from frontend is valuse for ex
    let id = uuidv4();
    posts.push({id,username,content})  //here we pass whole object as username and content as key and with their value
    //here we usr redirect to go to posts again
    //redirect send an get request on path /posts uses route not ejs pages
    res.redirect("/posts")

})

//to show a post by matching id which is requested
app.get("/posts/:id",(req,res)=>{
    let {id}=req.params
    let post=posts.find((p)=> id===p.id) // to store the founded post in variable post
    // console.log(post)
    res.render("show.ejs",{post})

})

//get request to serve form on /posts/:id/edit
app.get("/posts/:id/edit",(req,res)=>{
    let {id}=req.params
    let post=posts.find((p)=> id===p.id)
    res.render("edit.ejs",{post})
})

//to update the content not channging the id and username
//we use the patch 
app.patch("/posts/:id",(req,res)=>{
    let {id}=req.params
    let post=posts.find((p)=> id===p.id)
    let newContent=req.body.content
    post.content=newContent
    // console.log(post.content)
    // res.send("patch workking")
    res.redirect("/posts")

})


//making a delete operation
app.delete("/posts/:id",(req,res)=>{
    let {id}=req.params
    let post=posts.find((p)=> id===p.id)
    posts.pop(post)
    res.redirect("/posts")      //redirct wok with path not ejs files
    // res.send("delete is working")
})









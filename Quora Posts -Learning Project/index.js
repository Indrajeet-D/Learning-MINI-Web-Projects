const express=require("express")
const app=express()
const port=3000
const path=require("path")
const {v4:uuidv4}=require("uuid")
const methodOverride=require("method-override")

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

app.listen(port,()=>{
    console.log("listening on port : 3000")
})

// app.get("/",(req,res)=>{
//     res.send("listening you for request!..")
// })

let posts=[
{   id:uuidv4(),
    username:"Indrajeet",
    content:"Work hard to get success.."
},
{   id:uuidv4(),
    username:"Rudra",
    content:"Time is immportant use it wisely.."
},
{   id:uuidv4(),
    username:"Kushagra",
    content:"Success have it's different defination for different people.."
}

]

app.get("/posts",(req,res)=>{
    res.render("index.ejs",{posts})
})


app.get("/posts/new",(req,res)=>{
    res.render("new.ejs")
})

app.post("/posts",(req,res)=>{
    let {username,content}=req.body
    // console.log(username)
    let id = uuidv4()
    posts.push({id,username,content})
    res.redirect("/posts")
})

app.get("/posts/:id",(req,res)=>{
    let {id}=req.params
    let post=posts.find((p)=> id===p.id)
    // console.log(post)
    res.render("show.ejs",{post})
})

app.get("/posts/:id/edit",(req,res)=>{
    let {id}=req.params
    let post=posts.find((p)=> id===p.id)
    res.render("edit.ejs",{post})
})

app.patch("/posts/:id",(req,res)=>{
    let {id}=req.params
    let post=posts.find((p)=> id===p.id)
    // console.log(post)
    let newContent=req.body.content
    post.content=newContent
    // res.send("working for patch")
    res.redirect("/posts")
})

app.delete("/posts/:id",(req,res)=>{
    let {id}=req.params
    let post=posts.find((p)=> id===p.id)
    posts.pop(post)
    res.redirect("/posts")
})



//for new and show and all posts we use get and post request
//for updating and editing we use patch or put
//for deleting we use delete

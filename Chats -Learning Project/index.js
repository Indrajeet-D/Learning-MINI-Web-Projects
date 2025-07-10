const express=require("express")
const app=express();
const mongoose=require("mongoose")
const path=require("path")
//we would construct our model in models folder and require them
const Chat = require("./models/chats")
const methodOverride=require("method-override");
const { render } = require("ejs");

async function main(){
   await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp")
}

main().then(()=>{
    console.log("Connected to db")
}).catch((err)=>{
    console.log(err)
})

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))
app.use(methodOverride("_method"))


app.listen(8080,()=>{
    console.log("listening on 8080 port")
})

//testing server
app.get("/",(req,res)=>{
    res.send("root is working--->")
})

//inserting data in chat to test--
// let chat1= new Chat({
//     from:"Indra",
//     to:"Roop",
//     msg:"Hello, how are you?",
//     created_at:new Date()   //using the Date class to generate a random date
// })
// chat1.save().then((res)=>{
//     console.log(res)
// }).catch((err)=>{
//     console.log(err)
// })

//new route=====>
//getting req serve form
app.get("/chats/new",(req,res)=>{
    res.render("new.ejs")
})


//accepting chat
app.post("/chats",async (req,res)=>{
    let {from,to,msg}=req.body
    let newChat=new Chat({
        from:from,
        to:to,
        msg:msg,
        created_at:new Date()
    });
    await newChat.save()        //await and .then are not used parallely
    res.redirect("/chats")
})

//editing   :serving form
app.get("/chats/:id/edit", async(req,res)=>{
    let {id}=req.params
    Chat.findById(id).then((chat)=>{
        res.render("edit.ejs",{chat})
    })
})

//accepting changes(updates)
app.patch("/chats/:id",async (req,res)=>{
    let {id}=req.params;
    // console.log(msg)
    // res.send("working update")
    await Chat.findByIdAndUpdate(id,{msg:req.body.msg})
    res.redirect("/chats")
})

//delete route
app.delete("/chats/:id",async (req,res)=>{
    let {id}=req.params
    await Chat.findByIdAndDelete(id)
    res.redirect("/chats")
})

//index======>
app.get("/chats", async(req,res)=>{
    await Chat.find({}).then((chats)=>{
        // console.log(chats)
        res.render("chats.ejs",{chats})
    })
   
})


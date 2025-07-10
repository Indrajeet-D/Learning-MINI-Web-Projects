const mongoose=require("mongoose")
const Chat = require("./models/chats")

async function main(){
   await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp")
}

main().then(()=>{
    console.log("Connected to db")
}).catch((err)=>{
    console.log(err)
})

let allChats=[
    {
    from:"Kan",
    to:"Roop",
    msg:"Hello,send me js notes",
    created_at:new Date()   //using the Date class to generate a random date
},{
    from:"Sam",
    to:"Indra",
    msg:"teach, how to use ternery?",
    created_at:new Date()   //using the Date class to generate a random date
},{
    from:"Sam",
    to:"Kan",
    msg:"good night",
    created_at:new Date()   //using the Date class to generate a random date
},{
    from:"Tony",
    to:"Petre",
    msg:"send me arc reactor",
    created_at:new Date()   //using the Date class to generate a random date
},{
    from:"Petre",
    to:"Tony",
    msg:"sorry, i dont have it",
    created_at:new Date()   //using the Date class to generate a random date
},{
    from:"Tony",
    to:"Hulk",
    msg:"Show me your power",
    created_at:new Date()   //using the Date class to generate a random date
}
]


Chat.insertMany(allChats).then((res)=>{
    console.log(res)
})
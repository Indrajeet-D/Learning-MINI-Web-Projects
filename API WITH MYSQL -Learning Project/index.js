const express=require("express");
const app=express();
const mysql=require("mysql2")
const {faker}=require("@faker-js/faker")
const path=require("path")
const methodeOverride=require("method-override")
const {v4:uuidv4}=require("uuid")
const port=8080;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"public")))
app.use(methodeOverride("_method"))
app.use(express.urlencoded({extended:true}))


let connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"delta_app",
    password:"75979"
})

app.listen(port,()=>{
    console.log("listening on port 8080..")
})

//checking
// app.get("/",(req,res)=>{
//    res.send("on home page");
// })

//home page shows number of user of app
app.get("/",(req,res)=>{
    let q="SELECT count(*) FROM user;";
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            // console.log(result[0]["count(*)"]);
            let count=result[0]["count(*)"];
            res.render("home.ejs",{count});
        })
    }catch(err){
        console.log(err);
        res.send("some error in DB")
    }
    
})

//show route
app.get("/user",(req,res)=>{
    let q="SELECT id,username,email FROM user;"
     try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            // res.render("show.ejs",{result});    //this is made by me show.ejs  
            // console.log(result)
            res.render("showuser.ejs",{result})
        })
    }catch(err){
        console.log(err);
        res.send("some error in DB")
    }
})

//update route
//--to serve form to update
app.get("/user/:id/edit",(req,res)=>{
    let {id}=req.params
    let q=`SELECT id,username,email FROM user WHERE id="${id}"`
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            res.render("update_user.ejs",{result});
            // console.log(result);
        })
    }catch(err){
        console.log(err);
        res.send("some error in DB")
    }
})


//--to update using patch request
app.patch("/user/:id",(req,res)=>{
    let {id}=req.params;
     let q=`SELECT id,username,email,password FROM user WHERE id="${id}"`
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let pass_enter=req.body.password
            let username_enter=req.body.username
            
            if(pass_enter!=result[0].password)
            {   
                res.send("Wrong Password...")
            }
            else{
                result[0].username=username_enter;
                let new_q=`UPDATE user SET username="${username_enter}" WHERE id="${id}"`;
                    connection.query(new_q,(err,result)=>{
                    if(err) throw err;
                    // res.send(result);
                    res.redirect("/user")   //redirect work by sending request to path mentioned in it 
                    //redirect do not work with ejs files
                })
            }
        })
    }catch(err){
        console.log(err);
        res.send("some error in DB")
    }

})

//adding a new user
//--serving form
app.get("/user/new",(req,res)=>{
    res.render("new.ejs")
})

//--using form data to add new user
app.post("/user",(req,res)=>{
    // res.send("working post...")
    let {username:newUsername,password:newPassword,email:newEmail}=req.body;
    let id=uuidv4();
    let q="INSERT INTO user(id,username,email,password) VALUES (?,?,?,?)";
    let user=[id,newUsername,newEmail,newPassword]
    // console.log(id,newUsername,newEmail,newPassword)
    connection.query(q,user,(err,result)=>{
        if(err) throw err
        // res.send("user added")
        res.redirect("/user")
    })
    
})


//to delete account(user)
//--serving form

app.get("/user/:id/delete",(req,res)=>{
    let {id}=req.params;
    res.render("delete.ejs",{id})
})

//--taking form input to manuplate the database
app.delete("/user/:id",(req,res)=>{
    let {id}=req.params;

    //
     let q=`SELECT email,password FROM user WHERE id="${id}"`
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let pass_enter=req.body.password
            let email_enter=req.body.email
            
            if(pass_enter===result[0].password & email_enter===result[0].email )
            {   
                let q=`DELETE FROM user WHERE id="${id}"`
    connection.query(q,(err,result)=>{
        if(err) throw err;
        res.redirect("/user")
    })

            }
            else{
              res.send("Wrong Password or email")
            }
        })
    }catch(err){
        console.log(err);
        res.send("some error in DB")
    }
    
    //
})

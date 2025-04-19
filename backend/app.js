const express = require("express")
const {open} = require("sqlite")
const sqlite3 = require("sqlite3")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const path = require("path")
const cors = require("cors")
const { checkPrime } = require("crypto")
const { unsubscribe } = require("diagnostics_channel")

const app = express()
app.use(express.json())
app.use(cors())

const dbPath = path.join(__dirname,"myDatabase")

let db

const initilizeServer = async () =>{
    try{
        db = await open({
            filename:dbPath,
            driver:sqlite3.Database
        })
        app.listen(5000,()=>{
            console.log("server is running in localhost:5000")
        })
    }catch(e){
        console.log(`error is ${e}`)
        process.exit(1)
    }
}

initilizeServer()

const checkDetails = (request,response,next)=>{
    const {username,email,number,password} = request.body
    const regex = /\d/
    const regex2 = /^[0-9]+$/
    if(username===undefined){
        response.json({message:"Please enter username"})
    }else if(password===undefined){
        response.json({message:"please enter a password"})
    }else if(email===undefined){
        response.json({message:"Please enter email"})
    }else if(number===undefined){
        response.json({message:"please enter a number"})
    }
    else if(username.length>14 && regex.test(username)){
        response.json({message:"username is above 14 characters and contains numbers"})
    }
    else if(username.length>14){
        response.json({message:"username is above 14 characters"})
    }else if(regex.test(username)){
        response.json({message:"username contains numbers"})
    }else if(!email.endsWith("@gmail.com")){
        response.json({message:"Invalid email address"})
    }else if(number.length!==10){
        response.json({message:"Invalid Number"})
    }else if (!regex2.test(number)){
        response.json({message:"Number contains strings"})
    }else{
        next()
    }
}

   

app.post("/register/",async (request,response)=>{
    const {id,username,password,email,number} = request.body
    console.log("Received password from frontend:", password);
    const regex = /\d/
    const regex2 = /^[0-9]+$/
    if(username.length>14 && regex.test(username)){
        response.json({message:"username is above 14 characters and contains numbers"})
    }
    else if(username.length>14){
        response.json({message:"username is above 14 characters"})
    }else if(regex.test(username)){
        response.json({message:"username contains numbers"})
    }else if(!email.endsWith("@gmail.com")){
        response.json({message:"Invalid email address"})
    }else if(number.length!==10){
        response.json({message:"Invalid Number"})
    }else if (!regex2.test(number)){
        response.json({message:"Number contains strings"})}
    else{
    const hashPassword = await bcrypt.hash(password,10)
    console.log(hashPassword)
    const query = `
        insert into register(id,username,password,email,number) VALUES(
        ?,?,?,?,?
        );
    `;
     const datas = await db.run(query,[id,username,hashPassword,email,number])
    response.status(200).json({message:"success",datas})}
})

app.post("/login/", async (request,response)=>{
    const {username,password} = request.body
    if(username===undefined){
        response.json({message:"Please enter a username"})
    }else if(password===undefined){
        response.json({message:"Please enter a password"})
    }else{
    const isUsernameregistered = `select * from register where username=?;`
    const result = await db.get(isUsernameregistered,[username])
    if(result===undefined){
        response.json({message:"username doesn't exist"})
    }else{
        console.log(result.password)
        console.log(password)
        const checkPassword = await bcrypt.compare(password,result.password)
        console.log(checkPassword)
        if(checkPassword===true){
            const payload = {
                username: username
            }
            const token = jwt.sign(payload,"My_Secret_Token",{expiresIn:"2d"})
            response.status(200).json({message:"success",token})
        }else{ 
            response.json({message:"Invalid password"})
        }
    }
}
}) 

app.get("/user", async(request,response)=>{
    const query = `select * from register`
    const d = await db.all(query)
    response.send(d)
})


app.get("/user_data/",async (request,response)=>{
    const {username} =  request.query
    console.log(username)
    const getUserId =   `select id from register where username="${username}";`
    const id = await db.get(getUserId)
    console.log(id.id)
    if(id!==undefined){
        const userInputData = `select * from user where user_id="${id.id}";`;
        const userData = await db.all(userInputData)
        console.log(userData)
        response.json({data:userData,id:id.id})
    }
})

app.post("/user_input", async (request,response)=>{
    const {id,user_id,username,email,location,gender,occupation,number} = request.body
    if(username===undefined){
        response.json({message:"Please enter firstname and lastname"})
    }else if(email===undefined || !email.endsWith("@gmail.com")){
        response.json({message:"Invalid email"})
    }else if(location===undefined){
        response.json({message:"Please enter location"})
    }else if(gender===undefined){
        response.json({message:"Please enter gender"})
    }else if(occupation===undefined){
        response.json({message:"Please enter Occupation"})
    }else if(number===undefined || number.length!==10){
        response.json({message:"invalid number"})
    }else{
    const query = `insert into user(id,user_id,username,email,location,gender,occupation,number) values(
    "${id}",
    "${user_id}",
    "${username}",
    "${email}",
    "${location}",
    "${gender}",
    "${occupation}",
    "${number}"
    );`
    const v = await db.run(query)
    console.log(v)
    response.status(200).json({message:"success"})
    }
})

app.delete("/delete/:id",async (request,response)=>{
    const {id} = request.params
    const query = `DELETE FROM user where id="${id}"`
    await db.run(query)
    response.send("Deleted")
})

app.put("/update/", async (request,response)=>{
    const {id,user_id,username,email,location,gender,occupation,number} = request.body
    const query = `update user set
    user_id="${user_id}",
    username="${username}",
    email="${email}",
    location="${location}",
    gender="${gender}",
    occupation="${occupation}",
    number="${number}" where id="${id}";`
    await db.run(query)
    response.status(200).json({message:"success"})
}) 

app.delete("/delete/", async (request,response)=>{
    const query = `delete from register`
    await db.run(query)
    const query2 = `delete from user`
    await db.run(query2)
    response.send("data successfully deleted")
})
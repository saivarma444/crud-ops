const express = require("express")
const {open} = require("sqlite")
const sqlite3 = require("sqlite3")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const path = require("path")
const cors = require("cors")
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { v4: uuidv4 } = require("uuid");


const app = express()
app.use(express.json())
app.use(cors())
app.use(session({
    secret:"my_secret_key",
    resave:false,
    saveUninitialized:true,
}))
app.use(passport.initialize())
app.use(passport.session())


passport.use(new GoogleStrategy({
    clientID:"331613423535-f2pqt2o1re3btj79lv0b99joc693siu4.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:5000/auth/google/callback"
},
async (accessToken,refereshToken,profile,done)=>{
    const email = profile.emails[0].value
    const username = profile.displayName
    const number= "0000000000"
    const id = uuidv4()

    const userQuery = `select * from register where email=?`
    const isRegistered = await db.get(userQuery,[email])

    if(!isRegistered){
        const query = `
            INSERT INTO register(id,username,password,email,number) values(?,?,?,?,?);    
        `
        await db.run(query, [id,username,"google-auth",email,number])
    }
    return done(null, {email})
}
))

passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

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



   

app.post("/register/",async (request,response)=>{
    const {id,username,password,email,number} = request.body
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
        const checkIfExists = `select * from register where username=?;`
        const resultData = await db.get(checkIfExists,[username])
        console.log(resultData)
        if(resultData===undefined){
            const hashPassword = await bcrypt.hash(password,10)
        const query = `
            insert into register(id,username,password,email,number) VALUES(
            ?,?,?,?,?
            );
        `;
         const datas = await db.run(query,[id,username,hashPassword,email,number])
        response.status(200).json({message:"success",datas})
    }else{
            response.json({message:"username already exists"})
        }
    }
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
        
        const checkPassword = await bcrypt.compare(password,result.password)
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
    const {username,email} =  request.query
       if(username!==undefined && email!==undefined){
        
        const getUserId =   `select id from register where username="${username}";`
        const id = await db.get(getUserId)
        if(id!==undefined){
            const userInputData = `select * from user where user_id="${id.id}";`;
            const userData = await db.all(userInputData)
            response.json({data:userData,id:id.id})
        }
       }
        if(email!==undefined && username===undefined){
        
        const getUserIdFromemail = `select id from register where email=?;`
        const resultForMail  = await db.get(getUserIdFromemail,[email])
        
        if(resultForMail!==undefined){
            const userInputData = `select * from user where user_id="${id.id}";`;
            const userData = await db.all(userInputData)
            response.json({data:userData,id:id.id})
            
        }
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
    if(!email.endsWith("@gmail.com")){
        response.json({message:"please enter a valid email"})

    }else if(number.length!==10){
        response.json({message:"Please enter a valid number"})
    }
    else{
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
    }
}) 

app.delete("/delete/", async (request,response)=>{
    const query = `delete from register`
    await db.run(query)
    const query2 = `delete from user`
    await db.run(query2)
    response.send("data successfully deleted")
})

app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  
  app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    async (req, res) => {
      const userQuery = `select * from register where email=?;`
      const user = await db.get(userQuery)
      if (!user) {
        return res.redirect("http://localhost:3000/login?error=UserNotFound");
    }
      const payload = {username:user.username, email: user.email,id:user.id };
      const token = jwt.sign(payload, "My_Secret_Token", { expiresIn: "2d" });
      res.redirect(`http://localhost:3000/login?token=${token}&email=${user.email}&id=${user.id}`);
    }
  );
  

  app.post("/google-login/", async (request,response)=>{
    const {email} = request.body
    const isUserregistered = `select * from register where email=?`
    const userData = await db.get(isUserregistered,[email])

    if(userData!==undefined){
        const payload = {
            username:isUserregistered.username,
            email:isUserregistered.email
        }
        const token = jwt.sign(payload,"My_Secret_Token", {expiresIn: "2d"})
        response.status(200).json({
            message:"success",
            token,
            username:userData.username
        })
    }else{
        response.json({message:"User not registered"})
    }
  })

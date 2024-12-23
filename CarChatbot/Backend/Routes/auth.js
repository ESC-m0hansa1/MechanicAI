const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const User = require('../Models/User')
const { body, validationResult } = require('express-validator');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const fetchuser = require('../Middleware/fetchuser')

const secret  = "This is a secret";

//ROUTE:1 Creating a user using post request no authorization required endpoint: '/api/auth/createuser'
router.post('/createuser',[ 
body('name','name must be atleast 3 characters').isLength({ min: 3 }),
body('email','Enter a valid Email').isEmail(),
body('password','password must be atleast 5 characters').isLength({ min: 5 })
],
async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });}

//check if user already exists
try{
let user = await User.findOne({email:req.body.email})
if(user) 
{
     return res.status(400).json({success:false,error:"A user with this email already exists"})
}
//create new user
const saltRounds = await bcrypt.genSalt(10);
const secpassword = await bcrypt.hash(req.body.password,saltRounds)
user = await User.create({
    name: req.body.name,
    email:req.body.email,
    password: secpassword
  })
//   .then(user => res.json(user))  
//   .catch((err)=>{
//     console.log(err);
//     res.json({error:"please enter a unique value for Email"})
//   })
const data = {
    user:{
        id:user.id
    }
}
// const secret  = "This is a secret"
success = true;
var authtoken = jwt.sign(data, secret);
// res.send(user)
res.json({success:true,authtoken})

}
catch(error)
{
    console.error(error.message);
    res.status(500).json({success:false,error:"Some error occurred"})
}
})

//ROUTE:2 endpoint for user login /api/auth/login
//For CRUD operations we use login auth-token
router.post('/login',[ 
    body('email','Enter a valid Email').isEmail(),
    body('password','password cannot be blank').exists()
    ],
    
    
    async (req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });}
        
          const {email,password} = req.body;
          let success = false;
          try {
            
            let user = await User.findOne({email});
            if(!user)
            {
                success = false;
                return res.status(400).json({success,error:"please login with correct credentials"})
            }
            const passwordcompare = await bcrypt.compare(password,user.password);
            if(!passwordcompare)
             {
                    success = false;
                    return res.status(400).json({success,error:"please login with correct credentials"});
            }
            const data = {
                user:{
                    id:user.id
                }
            }
            // const secret  = "This is a secret"
            var authtoken = jwt.sign(data, secret);
            success = true;
            res.json({success,authtoken})
          } 
          catch(error)
          {
              console.error(error.message);
              res.status(500).send("Internal server error occured")
          }
        })

//ROUTE:3 Fetch user /api/auth/fetchuser
router.post('/fetchuser',fetchuser,
    async (req,res)=>{
        try {
            
            const userid = req.user.id;
            const user = await User.findById(userid).select("-password");
            res.send(user);
             
        } catch (error) 
        {
            console.error(error.message);
              res.status(500).send("Internal server error occured")
        }
        

    })
module.exports = router
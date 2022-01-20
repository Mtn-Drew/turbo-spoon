const router = require('express').Router()
const {check, validationResult} = require('express-validator')
const {users} = require('../db')

router.post('/signup',[
  check('email','Please provide a valid email').isEmail(),
  check('password', 'Passwords must be 8 characters or more').isLength({min:8})

],(req,res)=>{
  const {password, email}=req.body
// Validated the input
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }

// Validate if user doesn't already exist

  let user= users.find((user)=>{
    return user.email===email
  })
  if(user){
    res.status(400).json({
      "errors":[
        {
          "msg":"User already exists"
        }
      ]
    })
  }
  res.send("Validation Passed")
})

module.exports = router
const router = require('express').Router()


router.post('/signup',(req,res)=>{
  const {password, email}=req.body

  console.log(password, email)
  res.send("Auth route is working...")
})

module.exports = router
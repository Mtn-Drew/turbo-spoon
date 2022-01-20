const router = require("express").Router()
const { check, validationResult } = require("express-validator")
const { users } = require("../db")
const bcrypt = require("bcrypt")

router.post(
	"/signup",
	[
		check("email", "Please provide a valid email").isEmail(),
		check("password", "Passwords must be 8 characters or more").isLength({
			min: 8,
		}),
	],
	async (req, res) => {
		const { password, email } = req.body
		// Validated the input
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
			})
		}

		// Validate if user doesn't already exist

		let user = users.find((user) => {
			return user.email === email
		})
		if (user) {
			res.status(400).json({
				errors: [
					{
						msg: "User already exists",
					},
				],
			})
		}

		let hashedPassword = await bcrypt.hash(password, 10)

    users.push({
      email,
      password:hashedPassword
    })
    console.log('PW: ',hashedPassword)
		res.send("Validation Passed")
	}
)

router.get('/all', (req,res)=>{
  res.json(users)
})

module.exports = router

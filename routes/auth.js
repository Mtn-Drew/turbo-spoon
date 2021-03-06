const router = require("express").Router()
const { check, validationResult } = require("express-validator")
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")

const { users } = require("../db")

console.log("In Auth")
//Sign up
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
			return res.status(422).json({
				errors: errors.array(),
			})
		}
		// Validate if user doesn't already exist
		let user = users.find((user) => {
			return user.email === email
		})

		if (user) {
			return res.status(422).json({
				errors: [
					{
						msg: "User already exists",
					},
				],
			})
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		users.push({
			email,
			password: hashedPassword,
		})

		const token = await JWT.sign(
			{
				//this will need to be improved for security
				email,
			},
			"0innu8enfe8unmknwdbnwd",
			{
				//this should be in an env file
				expiresIn: 3600000,
			}
		)

		res.json({ token })
	}
)
//Login
router.post("/login", async (req, res) => {
	const { password, email } = req.body

	let user = users.find((user) => {
		return user.email === email
	})

	if (!user) {
		return res.status(422).json({
			errors: [
				{
					msg: "Invalid Credentials - no user",
				},
			],
		})
	}
	//check if pw is valid
	let isMatch = await bcrypt.compare(password, user.password)

	if (!isMatch) {
		return res.status(400).json({
			errors: [
				{
					msg: "Invalid Credentials - pw",
				},
			],
		})
	}
	//send the JWT
	const token = await JWT.sign(
		{
			//this will need to be improved for security
			email,
		},
		"0innu8enfe8unmknwdbnwd",
		{
			//this should be in an env file
			expiresIn: 3600000,
		}
	)

	res.json({ token })
})

router.get("/all", (req, res) => {
	res.json(users)
})

module.exports = router

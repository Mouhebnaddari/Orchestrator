const User = require("../models/user")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require('dotenv').config()




const initUserAPI = app => {
    app.post('/login', async (req, res) => {
        const {email, password} = req.body

        if (!email || !password) {
            return res.status(400).json({message: 'Error. Please enter the correct username and password'})
        }

        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({message: 'Error. Wrong login or password'})
        }
        const validPass = await bcrypt.compare(password, user.password)
        if (!validPass) {
            return res.status(400).send('invalid Password')
        }

        //Create token
        const token = jwt.sign({
            email: user.email,
            username: user.username
        }, process.env.TOKEN_SECRET, {expiresIn: '3 hours'})

        res.header('auth-token', token)
        return res.json({token})
    })

    app.post('/signup', (req, res) => {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
        });
        user.save((err, user) => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }
            res.send({message: "User was registered successfully!"});
        });
    });
}

exports.initUserAPI = initUserAPI;
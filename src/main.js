const express = require('express');
const {runJob} = require("./service/serviceSSH");
const config = require("config");
const {url} = config.get('database')
const run = require("./service/jobRepository")
const {connect} = require("./service/mongooseConfig")
const timestamp = require("./models/jobs");
const mongoose = require('mongoose')
const {getHistory} = require("./service/mongooseConfig")
const {getUpcoming} = require("./service/mongooseConfig")
const {scheduleJob} = require("./service/scheduler")
const {deleteJob} = require("./service/mongooseConfig")
const {saveUpcoming} = require("./service/upcomingSave");
const User = require("./models/user")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const verify = require("./service/verifyToken")
require('dotenv').config()
const app = express()
app.use(express.json())
app.get('/run', async (req, res) => {
    const job = req.query.job
    const hostname = req.query.hostname
    if (job === undefined || hostname === undefined) {
        res.send('bad request')
        return
    }
    try {
        const stdout = await runJob(job, hostname)
        res.send(stdout)
        await run.saveJob(job, hostname, timestamp, stdout)
    } catch (error) {
        console.log(error)
    }
})
app.get('/monitoring', async (req, res) => {
    try {
        const result = await getHistory()
        res.send(result)
    } catch (error) {
        console.log(error)
    }
})
app.get('/mon',  async (req, res) => {
    try {
        const info = await getUpcoming()
        res.send(info)
    } catch (error) {
        console.log(error)
    }
})
app.post('/schedule',  async (req, res) => {
    const job = req.body.job
    const hostname = req.body.hostname
    const cronExpression = req.body.cronExpression
    const order = 0
    const orchestration = [{order, job, hostname}]
    if (job === undefined || hostname === undefined) {
        res.send('bad request')
        return
    }
    try {
        await saveUpcoming(orchestration, cronExpression)
        console.log("upcoming job saved ")
        await scheduleJob(orchestration, cronExpression)
    } catch (error) {
        console.log(error)
    }
})
app.delete('/DeleteJob',  async (req, res) => {
    try {
        const id = req.body._id
        console.log(id)
        await deleteJob(id)
    } catch (error) {
        console.log(error)
    }
})
app.post('/Orchestrator',  async (req, res) => {
    const orchestration = req.body.orchestration
    const cronExpression = req.body.cronExpression
    try {
        await saveUpcoming(orchestration, cronExpression)
        console.log("upcoming jobs saved ")
        await scheduleJob(orchestration, cronExpression)
    } catch (error) {
        res.send(error)
    }
})
app.post('/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const user = await User.findOne({email})
    if (!user) return res.status(400).send("email or password is wrong")
    const validPass = await bcrypt.compare(password, user.password)
    if (!validPass) return res.status(400).send('invalid Password')
    if(validPass) res.redirect('/run')
    //Create token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET,{expiresIn:'1000000000s' })
    res.header('auth-token', token)
    res.send(token)
})
app.listen(8081, () => {
    console.log('Server is up')
})

connect(url);




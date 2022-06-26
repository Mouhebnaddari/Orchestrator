const {checkTokenMiddleware}  = require("../service/JWTMiddleware");
const {runJob} = require("../service/serviceSSH");
const run = require("../service/jobRepository")
const timestamp = require("../models/jobs");
const {getHistory} = require("../service/mongooseConfig")
const {getUpcoming} = require("../service/mongooseConfig")
const {scheduleJob} = require("../service/scheduler")
const {deleteJob} = require("../service/mongooseConfig")
const {saveUpcoming} = require("../service/upcomingSave");
require('dotenv').config()




const initOrchestratorAPI = app => {
    app.get('/run', checkTokenMiddleware,async (req, res) => {
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

    app.get('/monitoring',checkTokenMiddleware, async (req, res) => {
        try {
            const result = await getHistory()
            res.send(result)
        } catch (error) {
            console.log(error)
        }
    })

    app.get('/upcoming',checkTokenMiddleware, async (req, res) => {
        try {
            const info = await getUpcoming()
            res.send(info)
        } catch (error) {
            console.log(error)
        }
    })

    app.post('/schedule', checkTokenMiddleware,async (req, res) => {
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

    app.delete('/DeleteJob',checkTokenMiddleware, async (req, res) => {
        try {
            const id = req.body._id
            console.log(id)
            await deleteJob(id)
        } catch (error) {
            console.log(error)
        }
    })

    app.post('/Orchestrator', checkTokenMiddleware,async (req, res) => {
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
}

exports.initOrchestratorAPI = initOrchestratorAPI;
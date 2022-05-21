const express = require('express');
const {runJob} = require("./service/serviceSSH");
const config = require("config");
const {url} = config.get('database')
const run = require ("./service/jobRepository")
const {connect} =require ("./service/mongooseConfig")
const timestamp = require ("./models/jobs");
const {getHistory}=require ("./service/mongooseConfig")
const {scheduleJob}=require("./service/jobRepository")
const app = express()

app.get('/run', async (req, res) => {

    const job = req.query.job
    const hostname = req.query.hostname

    if (job === undefined || hostname === undefined) {
        res.send('bad request')
        return
    }


try {
        const stdout = await runJob(job,hostname)
    res.send(stdout)

    await run.saveJob(job,hostname,timestamp,stdout)
}catch (error){
        console.log(error)
}
})
app.get('/getHistory',async (req,res)=> {
    try {
      const result =  await getHistory()
        res.send(result)
    }catch (error){
        console.log(error)
    }
})
app.get('/scheduling',async (req,res)=>{
    const job = req.query.job
    const hostname = req.query.hostname
    const value = req.body.value

    if (job === undefined || hostname === undefined) {
        res.send('bad request')
        return
    }

    try {
       const result= await  scheduleJob(job,hostname,value)
        res.send(result)
    }catch (error){
        console.log(error)
    }
    })



app.listen(8080, () => {
    console.log('Server is up')
})
 connect(url);

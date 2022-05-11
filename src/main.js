const express = require('express');
const {runJob} = require("./service/serviceSSH");
const config = require("config");
const {url} = config.get('database')
const run = require ("./service/jobRepository")
const {connect} =require ("./service/mongooseConfig")
const timestamp = require ("./models/jobs");


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



app.listen(8080, () => {
    console.log('Server is up')
})
 connect(url);

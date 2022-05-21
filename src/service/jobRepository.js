const Job = require("../models/jobs");
const cron = require('node-cron');
const {runJob} = require("./serviceSSH");



exports.saveJob = async (job, hostname,timestamp,stdout) => new Job({job: job, hostname: hostname,timestamp:Date.now(),log:stdout}).save()


exports.scheduleJob= async (job,hostname,value) => {
    cron.schedule({value}, async () => {

        console.log('running a task every minute');
        await  runJob(job,hostname)
    });
}
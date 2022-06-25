const cron = require("node-cron");
const {runJob} = require("./serviceSSH");
const {saveJob} = require("./jobRepository");
const timestamp = require("../models/jobs");
exports.scheduleJob = async (orchestration, cronExpression) => {
    cron.schedule(cronExpression, async () => {
        console.log("start")
        for (let index = 0; index < orchestration.length; index++) {
            console.log(orchestration[index].job, orchestration[index].hostname)
            const stdout = await runJob(orchestration[index].job, orchestration[index].hostname)
            await saveJob(orchestration[index].job, orchestration[index].hostname, timestamp, stdout)
            console.log(stdout)
            if (stdout === '1') {
                break
            }
        }
        console.log("end")
    })
}
const Job = require("../models/jobs");




exports.saveJob = async (job, hostname,timestamp,stdout) => new Job({job: job, hostname: hostname,timestamp:Date.now(),log:stdout}).save()

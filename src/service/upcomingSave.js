const Upcoming = require("../models/comingjobs");
exports.saveUpcoming = async (orchestration, cronExpression) => new Upcoming({
    orchestration: orchestration,
    cronExpression: cronExpression
}).save()

const SecureShellProvider = require("./SecureShellProvider");
const config = require("config");
const jobsConfig = config.get('jobs')
const serversConfig = config.get('servers');

const runJob = async (job, hostname) => {
    const server = serversConfig.filter(server => server.hostname === hostname)[0]
    const {username, ip, privateKey, workspace} = server
    const {jobsRepo, jobsPath} = jobsConfig
    const ssp = new SecureShellProvider(ip, username, privateKey)
    const tmpWorkspace = `${workspace}/${Date.now()}`;
    console.info(`Creating temporary workspace ${tmpWorkspace}`)
    await ssp.mkdir(tmpWorkspace);
    console.info('Cloning jobs..')
    await ssp.clone(jobsRepo, tmpWorkspace);
    console.info('Running job..')
    const stdout = await ssp.run(job, `${tmpWorkspace}/${jobsPath}`);
    console.info('Done successfully');
    return stdout
}
exports.runJob = runJob


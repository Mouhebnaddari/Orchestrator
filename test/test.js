const SecureShellProvider = require("../src/service/SecureShellProvider");
const config = require("config");

const serversConfig = config.get('servers');
const jobsConfig = config.get('jobs')

const hostnameJob = `hostname.sh`;


(async () => {
    const {username, ip, privateKey, workspace} = serversConfig[1]
    const {jobsRepo, jobsPath} = jobsConfig

    const sshNode1 = new SecureShellProvider(ip, username, privateKey)
    try {
        const tmpWorkspace = `${workspace}/${Date.now()}`;
        console.info(`Creating temporary workspace ${tmpWorkspace}`)
        await sshNode1.mkdir(tmpWorkspace);

        console.info('Cloning jobs..')
        await sshNode1.clone(jobsRepo, tmpWorkspace);

        console.info('Running job..')
        const stdout = await sshNode1.run(hostnameJob, `${tmpWorkspace}/${jobsPath}`);
        console.info('Done successfully');
        console.info('Output =>', stdout);

    } catch (error) {
        console.error(error);
    }
    process.exit();

})()
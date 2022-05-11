const {NodeSSH} = require('node-ssh');

class SecureShellProvider {

    constructor(host, username, privateKey) {
        this.host = host;
        this.username = username;
        this.privateKey = privateKey;
        this.nodeSSH = new NodeSSH();
    }

    getConnection = () => this.nodeSSH.connection

    isConnected = () => this.nodeSSH.isConnected()

    clone = async (repo, cwd) => {
        await this.connect()
        return this.exec(`git clone ${repo}`, cwd)
    }


    run = async (script, cwd) => {
        await this.connect()
        await this.exec(`chmod +x ${script}`, cwd)
        return this.exec(`sh ${script}`, cwd)
    }

    mkdir = async (path) => {
        await this.connect()
        return this.exec(`mkdir -p ${path}`)
    }

    connect = () => this.isConnected() ? 'Already connected' : this.nodeSSH.connect({
        host: this.host,
        username: this.username,
        privateKey: this.privateKey
    })

    exec = async (cmd, cwd) => {
        const {code, signal, stdout, stderr} = await this.nodeSSH.execCommand(cmd, {cwd})
        if (code !== 0) {
            throw stderr
        }
        return stdout
    }
}

module.exports = SecureShellProvider;
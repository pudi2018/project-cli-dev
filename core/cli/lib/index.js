'use strict';

module.exports = core;

// 识别不了 README.md文件
// require能识别: .js/.json/.node文件
// .js -> module.exports/exports
// .json -> JSON.parse
// any -> 默认当成.js文件解析, README里面的内容不是 js 代码

const semver = require('semver');
const colors = require('colors');
const userHome = require('user-home');
const pathExists = require('path-exists');
const commander = require('commander');
const pkg = require('../package.json');
const log = require('@project-cli-dev/log');
const path = require('path');
const constant = require('./const');
const process = require('process');

let args, config;
const program = new commander.Command();
async function core() {
    try {
        checkPkgVersion();
        checkNodeVersion();
        checkRoot();
        checkUserHome();
        checkInputArgs();
        chekEnv();
       await checkGlobalUpdate();
       registerCommand
    } catch (error) {
        log.error(error)
    }
    
}
// 检查 node 版本号
function checkNodeVersion() {
    const currentVersion = process.version;
    const lowestVersion = constant.LOWEST_NODE_VERSION;
    if (!semver.gte(currentVersion, lowestVersion)) {
        throw new Error(colors.red(`project-cli 需要安装v${lowestVersion}以上版本的Node.js`))
    }
    console.log(process.version)
}
function checkPkgVersion() {
    log.notice('cli', pkg.version);
    
}
// 判断是否有权限是否是 root 登录
function checkRoot() {
    const rootCheck = require('root-check');
    rootCheck();
    console.log(process.geteuid())
}
// 判断目录文件
function checkUserHome() {
    if (!userHome || !pathExists(userHome)) {
        throw new Error(colors.red('当前登录用户目录不存在'));
    }
}

// 入参是否是--debug
function checkInputArgs() {
    const minimist =require('minimist');
    args = minimist(process.argv.slice(2));
    checkArgs();
}

function checkArgs() {
    if(args.debug) {
        process.env.LOG_LEVEL = 'verbose';
    } else {
        process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
}
// 检查环境变量
function chekEnv() {
    const dotenv = require('dotenv');
    const dotenvPath = path.resolve(userHome, '.env');
    if (pathExists(dotenvPath)) {
        config = dotenv.config({
            path: dotenvPath
        });
    }
    
    createDefaultConfig();
    log.verbose('环境变量', config, process.env.CLI_HOME_PATH);

}

function createDefaultConfig() {
    const cliConfig = {
        home: userHome,
    }
    if (process.env.CLI_HOME) {
        cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
    } else {
        cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME);
    }

    // 方案二
    process.env.CLI_HOME_PATH = cliConfig.cliHome;
    return cliConfig;
}
// 检查是否全局更新版本号
async function checkGlobalUpdate() {
    // 1 获取现在的版本号和模块号

    const currentVersion = pkg.version;
    const npmName = pkg.name;
    // 2 调用 npm API 获取所有版本号
    const { getNpmInfo } = require('@project-cli-dev/get-npm-info');
    
    const lasetVersion = await getNpmInfo(npmName);
    if (lasetVersion && semver.gt(lasetVersion, urrentVersion)) {
        log.warn('更新提示', colors.yellow(`请手动更新${npmName},当前版本: ${currentVersion}, 最新版本${lasetVersion}
        更新命令: npm install -g ${npmName}`));
    }
    // 3获取所有版本号,对比哪些版本号大于当前版本号
    // 4获取最新版本号,提示用户更新到该版本
}
// 命令的注册
function registerCommand() {
    program
        .version(pkg.version);
    program.parse(process.argv);
}
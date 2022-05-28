
const commander = require('commander');

const pkg = require('../package.json');
// 获取单例
// const { program } = commander;

// 也可以初始化一个Command实例
const program = new commander.Command();
program
    // .name(pkg.name)
    // .name('project-name')
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d', '--debug', '是否开启调试', false)
    .option('-d --env <envName>', '获取环境变量名称', false)
    .parse(pkg.env);

    console.log(program.debug);
    console.log(program.envName);

    program.outputHelp();
    console.log(program.opts()); // options信息打印出来

    // command 注册命令<必填项> [选填项]
    const clone =  program.command('clone <source> [destination]'); // 返回的是一个命令的对象不能是单例了,不能再连续 command 方法
    clone
        .description('clone a repository')
        .option('-f --force', '是否强制克隆')
        .action((source, destination) => {
        console.log('do clone', source, destination);
    })
    // addCommand 注册子命令
    const service = new commander.Command('service'); // 再注册一个子脚手架
    
    service
        .command('start [port]')
        .action((port) => {
            console.log('do service start', port)
        })
    service
        .command('stop')
        .description('stop service')
        .action(() => {
            console.log('do service stop')
        })
    program.addComand(service) // 脚手架传入就成了子命令


    // 厉害的功能
    program
        .arguments('<cmd> [option]') // 所有的命令都会经过这个
        .description('test command', {
            cmd: 'command to run',
            options: 'options for command'
        })
        .action(function(cmd, options) {
            console.log(cmd, options)
        })
    
    // command的第二第三个参数
    program
        .command('install [name]', 'install package', {
            executableFile: 'project-cli', // 多脚手架可直接运行其他的脚手架执行 project-cli-dev install init相当于执行 project-cli init
            isDefault: true,
            hidden: true
        }) // 可以传第二个参数,这个参数表示会把现有的命令加个-与 command 里的命令组成一个新的命令
        .alias('i') // 加别名
    
    // 高级定制1: 自定义help的信息
    program.helpInformation = function () {
        return '';
    }
    // 监听--help输入自己的 help
    program.on('--help', function(){
        console.log('your help inforamtion')
    })

    // 高级定制2: 实现 debug模式
    program.on('options debug', function(){
        // 进到这里面 debug 为 true
        if (program.debug) {
            process.env.LOG_LEVEL = 'verbose';
        }
    })
    // 高级定制3: 对未知命令监听
    program.on('command: *', function(obj) {
        console.log(obj);
        console.error('未知的命令;' + obj[0])
        console.log(program.commands[0].name()) 
        // 获取所有的命令
        const availableCommands = program.commands.map(cmd => cmd.name())
        console.log('可用命令' + availableCommands.join(','));
    })




    
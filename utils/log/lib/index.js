'use strict';


const log = require('npmlog');
// 定制自己的方法使用时就可以 log.success('test', 'info')
// 2000表示等级只有大于多少时才会执行
// log.level = 'verbose'; // 设置 level只有为什么的时候会执行大于2000 数字的值

log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info';
// 环境变量里的 level

log.heading = 'project'; /// 表示添加前缀
log.addLevel('success', 2000, { fg: 'green', bold: true });

module.exports = log;

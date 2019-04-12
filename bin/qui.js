#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const program = require('commander');
const inquirer = require('inquirer')
const download = require('download-git-repo');
const chalk = require('chalk');
const ora = require('ora');

program
  .version('1.1.0')
  .option('i, init', '初始化qui项目模板')

program
  .parse(process.argv);

const nameQuestion = {
  type: 'input',
  message: `请输入项目名称: `,
  name: 'name',
  default: 'qui-mobile-template'
};

if (program.init) {
  console.info('');
  inquirer.prompt([
    nameQuestion
  ]).then(function (answers) {
    const spinner = ora('正在下载qui项目模板,请耐心等待一会...').start();
    download('zhangliGit/qui-mobile-template', answers.name, function (err) {
      if (!err) {
        spinner.clear()
        console.info('');
        console.info(chalk.green('-----------------------------------------------------'));
        console.info('');
        spinner.succeed(['项目模板创建成功,请继续进行以下操作:'])
        console.info('');
        console.info(chalk.cyan(` -  cd ${answers.name}`));
        console.info(chalk.cyan(` -  npm install or yarn install`));
        console.info(chalk.cyan(` -  npm run dev`));
        console.info('');
        console.info(chalk.green('-----------------------------------------------------'));
        console.info('');

        fs.readFile(`${process.cwd()}/${answers.name}/package.json`, (err, data) => {
          if (err) throw err;
          let _data = JSON.parse(data.toString())
          _data.name = answers.name
          _data.version = answers.version
          _data.port = answers.port
          _data.template = answers.template ? "pug" : "html"
          _data.rem = answers.rem
          let str = JSON.stringify(_data, null, 4);
          fs.writeFile(`${process.cwd()}/${answers.name}/package.json`, str, function (err) {
            if (err) throw err;
            process.exit()
          })
        });
      } else {
        process.exit()
      }
    })
  });
}
### windows build tools  
```  
npm install --global --production windows-build-tools  
```  
  
### version of express  
```  
npm info express  
npm view express versions  
```  
### Reset packager cache  
```  
"rm -rf $TMPDIR/*" or "npm start -- --reset-cache"  
```  
### 查看全局安装的包  
```  
npm ls -g --depth 0   
```  
### postinstall linux下不生效bug修复  
```  
npm i --unsafe-perm # 添加--unsafe-perm  
```  
  
### tip  
```  
1、var 声明的变量会被提升到函数顶部，而let和const不会，所以提前使用let声明的变量会包未初始化错误，而使用var声明的变量,则值为：undefined  
2、function foo() { setTimeout(foo, 0); // 时间循环，不会导致堆栈溢出;  
3、for-in 可以遍历原型继承的属性 Object.keys只能遍历自身的可枚举属性  
4、isNaN('abc') 返回 true，而 Number.isNaN('abc') 返回 false   
5、cross-env   
```  
  
### llnode  
```  
npm install --unsafe-perm -g llnode  
```  
  
### 跨域  
```  
1、所有具有 src 属性的HTML标签都可以跨域 ，jsonp 通过src下载js，然后调用已经初始化好的函数  
2、服务器设置Access-Control-Allow-OriginHTTP响应头  
3、postMessage()方法允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递。  
```  
  
###正则  
```  
var a = '12345678909876543210';  
a.replace(/(7)8/g,'==$1==');             // () 捕获分组，78被替换且$1是第一个括号内的值  
  
var a = '12345678909876543210'  
a.replace(/(?:7)(8)/g,'==$1==');          // (?:expr) 不捕获分组，78被替换且$1匹配除了(?:expr)这种括号外的第一的括号内的值  
  
var a = '12345678909876543210'  
a.replace(/8(?=9)/g,'===');                // 只替换8后面是9的8  
  
var a = '12345678909876543210'  
a.replace(/8(?!9)/g,'===');                // 只替换8后面不是9的8  
  
var a = '12345678909876543210'  
a.replace(/(?<=7)8/g,'===');            // 只替换8前面是7的8  
  
var a = '12345678909876543210'  
a.replace(/(?<!7)8/g,'===');            // 只替换8前面不是7的8  
  
var a ='bbbbbbbbb'  
a.replace(/(b*)\1/,'$1')    // 删除一半的b  
  
var a ='bbbbbbbbbccccccccccccc'  
a.replace(/(b*)\1(c+)\2/,'$1$2') // 删除一半的c  
```  
  
### 标签声明  
```  
phase: {  
    let a = 11;  
    console.warn(a);  
    if (a >= 11)  
        break phase;  
    console.warn("hahahahha");  
}  
loop1: for (let i = 1; i < 10; i++) {  
    for (let j = 1; j < 10; j++) {  
        if (i > j)  
            break loop1;  
        console.log("i*j=",i * j);  
    }  
}  
```  
### 发布npm包  
```  
In most cases, you or one of your dependencies are requesting a package version that is forbidden by your security policy.  
  
可能1：npm网站上的邮箱没有认证  
可能2：npm registry的源错误  
```  
### js 字符编码  
  
#### 浏览器  
```ts  
/*Base64*/  
btoa("aaaaa") // "YWFhYWE=" String to Base64 // 该方法不能直接作用于Unicode字符串  
atob("YWFhYWE=")  // "aaaaa" Base64 to String  
btoa(encodeURIComponent('啊'))//JUU1JTk1JThB  
decodeURIComponent(atob("JUU1JTk1JThB"))//啊  
/* Uint8Array / []byte / Buffer */   
new TextEncoder().encode("哈") // Uint8Array(3) [229, 147, 136] 不支持IE  
new TextDecoder().decode(new Uint8Array([229, 147, 136])) // "哈"  
  
```  
  
#### Node  
```ts  
/*Base64*/  
Buffer("aaaaa").toString("base64") // "YWFhYWE=" String to Base64  
Buffer("YWFhYWE=","base64").toString()  // "aaaaa" Base64 to String  
  
/* Uint8Array / []byte / Buffer */  
Buffer("哈") // Buffer e5 93 88  
Buffer("哈").toString() // "哈"  
  
```  
  
#### 通用  
```ts  
/*URI*/  
encodeURI(" ") // "%20"  
decodeURI("%20") // " "  
  
/*进制装换*/  
var a = 0xf1 // 241  
a.toString(2) // "11110001"  
parseInt("11110001",2) // 241  
```  
### babel  
```json  
// .babelrc  
// npm i @babel/cli @babel/core @babel/preset-env -D  
// npm i @babel/polyfill core-js  
// npx babel src -d build // 将src中的js转换成目标代码并放入build中  
{  
    "presets": [  
        [  
            "@babel/preset-env",  
            {  
                "useBuiltIns": "usage", // 按需polyfill  
                "corejs": 3, // useBuiltIns 需要用到的corejs 版本  
                "targets": {  
                    "ie": 9 // 目标浏览器  
                }  
            }  
        ]  
    ]  
}  
```  
### webpack  
```  
const path = require('path');  
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');  
const HtmlWebpackPlugin = require('html-webpack-plugin');  
const { CleanWebpackPlugin } = require('clean-webpack-plugin');  
  
const babelLoaderConfig = {  
  loader: 'babel-loader',  
  options: {  
    presets: [  
      [  
        "@babel/preset-env",  
        {  
          "useBuiltIns": "usage", // 按需polyfill  
          "corejs": 3, // useBuiltIns 需要用到的corejs 版本  
          "targets": {  
            "ie": 9 // 目标浏览器  
          }  
        }  
      ]  
    ]  
  }  
}  
  
module.exports = {  
  entry: './index.ts',  
  module: {  
    rules: [  
      {  
        test: /\.m?js$/,  
        use: babelLoaderConfig  
      },  
      {  
        test: /\.tsx?$/,  
        // exclude: /node_modules/,  
        use: [ // 倒序调用  
          babelLoaderConfig, // 再用babel转换  
          {  
            loader: "ts-loader" //先加载ts loader  
          },  
        ]  
      }  
    ],  
  },  
  output: {  
    filename: `index.bundle.js`,  
    path: path.resolve(__dirname, 'dist'),  
  },  
  plugins: [  
    new CleanWebpackPlugin(),  
    new UglifyJsPlugin(),  
    new HtmlWebpackPlugin({  
      title: 'Output Management',  
      hash: true,  
      template: path.resolve(__dirname, 'index.html'),  
      myPageHeader: 'Hello World',  
    })  
  ],  
  mode: 'none'  
};  
```  
### Debug  
#### VScode  
  
```json  
{  
    // Use IntelliSense to learn about possible Node.js debug attributes.  
    // Hover to view descriptions of existing attributes.  
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387  
    "version": "0.2.0",  
    "configurations": [  
    	// Server  
        {  
            "type": "node",  
            "request": "launch",  
            "name": "Server",  
            "program": "${workspaceRoot}/app.js",  
            "cwd": "${workspaceRoot}"  
        },  
        // Scheduler  
        {  
            "type": "node",  
            "request": "launch",  
            "name": "Scheduler",  
            "program": "${workspaceRoot}/scheduler.js",  
            "cwd": "${workspaceRoot}"  
        },  
        // Mocha  
        {  
            "type": "node",  
            "request": "launch",  
            "name": "Mocha",  
            "program": "${workspaceRoot}/node_modules/mocha/bin/_mocha",  
            "args": [  
                "-u",  
                "tdd",  
                "--timeout",  
                "999999",  
                "--colors",  
                "${workspaceRoot}/test"  
            ],  
            "env": {  
                "NODE_ENV": "test"  
            },  
            "internalConsoleOptions": "openOnSessionStart"  
        },  
        // Forntend  
        {  
            "type": "chrome",  
            "request": "launch",  
            "name": "Frontend",  
            "url": "http://localhost:4201",  
            "webRoot": "${workspaceRoot}"  
        },  
        // Backend  
        {  
            "args": [],  
            "cwd": "${workspaceRoot}",  
            "name": "Backend",  
            // compiled file  
            "outFiles": [  
                "${workspaceRoot}/backend-built/**/*"  
            ],  
            // launch entry  
            "program": "${workspaceRoot}/backend-built/Application.js",  
            "request": "launch",  
            "sourceMaps": true,  
            "env": {  
                "NODE_ENV": "development"  
            },  
            "type": "node"  
        },  
        // Current TS File  
        {  
            "type": "node",  
            "request": "launch",  
            "name": "Current TS File",  
            "args": [  
                "${workspaceFolder}/index.ts"  
            ],  
            "runtimeArgs": [  
                "-r",  
                "ts-node/register"  
            ],  
            "internalConsoleOptions": "openOnSessionStart",// 跳到 debug console 控制台  
            "protocol": "inspector"  
        },  
        // Jest  
        {  
            "type": "node",  
            "request": "launch",  
            "protocol": "inspector",  
            "name": "Jest Debug",  
            "program": "${workspaceRoot}/node_modules/jest/bin/jest",  
            "stopOnEntry": false,  
            "runtimeArgs": [  
                "--inspect-brk"  
            ],  
            "cwd": "${workspaceRoot}",  
            "sourceMaps": true,  
            "console": "integratedTerminal"  
}  
    ],  
    // Debugging 'Server' and 'Scheduler' at the same time.  
    "compounds": [  
        {  
            "name": "Server/Scheduler",  
            "configurations": [  
                "Server",  
                "Scheduler"  
            ]  
        }  
    ]  
}  
```  
#### debug in terminal  
We can debug the code when it has released in production envirment.  
  
node debug entry.js 开启调试  
  
如果程序已经启动   
ps 查看pid  
kill -SIGUSR1 nodePid 使程序进入调试状态  
node debug localhost:5858 连接并进入调试  
  
可选项   | 用途  
----    | ---  
run	    | 执行脚本,在第一行暂停  
restart	| 重新执行脚本  
cont, c	| 继续执行,直到遇到下一个断点  
next, n	| 单步执行  
step, s	| 单步执行并进入函数  
out, o	| 从函数中步出  
pause	|  暂停  
setBreakpoint(), sb()                   | 当前行设置断点  
setBreakpoint(‘f()’), sb(...)           | 在函数f的第一行设置断点  
setBreakpoint(‘script.js’, 20), sb(...)	| 在 script.js 的第20行设置断点  
clearBreakpoint, cb(...)                | 清除所有断点  
backtrace, bt       | 显示当前的调用栈  
list(5)	            | 显示当前执行到的前后5行代码  
watch(expr)         | 把表达式 expr 加入监视列表  
unwatch(expr)       | 把表达式 expr 从监视列表移除  
watchers            | 显示监视列表中所有的表达式和值  
repl                | 在当前上下文打开即时求值环境  
exec expr           | Execute an expression in debugging script's context  
kill                | 终止当前执行的脚本  
scripts         	| 显示当前已加载的所有脚本  
version	            | 显示v8版本  
  
#### pm2 debug  
```  
{  
    "apps": [  
        {  
            "name": "master",  
            "script": "app.js",   
            "args": [ // process.argv.  
                "serverType=master",  
                "id=master-server-1",  
                "host=127.0.0.1",  
                "port=3005",  
                "env=development",  
                "mode=stand-alone"  
            ],  
            "watch": false,  
            "out_file": "./logs/master-server-1_app.log",  
            "error_file": "./logsmaster-server-1_error.log",  
            "cwd": "E:\\GitLab\\dwcV2.5\\built",//路径  
            "merge_logs": true,  
            "exec_mode": "fork_mode",//独立启动  
            "node_args": ["--inspect=13005"]// 添加node启动参数，如调试  
        }  
     ]  
}  
  
pm2 start my_app.js --node-args="--harmony"  // 这边的node-args不是下划线注意  
```  
### 随机数  
```ts  
const randomFactory = (seed: number) => {  
  
    function* RandomIterator() {  
        const interval = Math.PI / 10000;  
        while (true) {  
            seed = (1 / interval) * (seed % interval);  
            yield seed;  
        }  
    }  
  
    const randomIterator = RandomIterator();  
    return () => randomIterator.next().value as number;  
};  
```  
### 执行顺序  
  
```ts  
console.log("start")  
  
setTimeout(() => {  
  console.log(1)  
  Promise.resolve().then(() => {  
    console.log(2)  
  })  
  setTimeout(() => {  
    console.log(3)  
  })  
  setImmediate(() => {  
    console.log(4)  
  })  
  process.nextTick(() => {  
    console.log(5)  
  })  
})  
  
setTimeout(() => {  
  console.log(6)  
  Promise.resolve().then(() => {  
    console.log(7)  
  })  
  setTimeout(() => {  
    console.log(8)  
  })  
  setImmediate(() => {  
    console.log(9)  
  })  
  process.nextTick(() => {  
    console.log(10)  
  })  
})  
  
process.nextTick(() => {  
  console.log(11)  
})  
  
console.log("end")  
// Node11.0 之前NextTick慢于Promise Micro Queen "11 1 6 5 10 2 7 4 9 3 8" 或者 "11 1 6 5 10 2 7 3 8 4 9"  
// Node11.0 之后NextTick快于Promise Micro Queen "11 1 5 2 6 10 7 4 9 3 8" 或者 "11 1 5 2 6 10 7 3 8 4 9"  
```  
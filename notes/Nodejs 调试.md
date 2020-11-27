## VScode  
  
``` javascript  
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
``` javascript  
{  
    // Use IntelliSense to learn about possible Node.js debug attributes.  
    // Hover to view descriptions of existing attributes.  
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387  
    "version": "0.2.0",  
    "configurations": [  
    	// forntend  
        {  
            "type": "chrome",  
            "request": "launch",  
            "name": "Frontend",  
            "url": "http://localhost:4201",  
            "webRoot": "${workspaceRoot}"  
        },  
        // backend  
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
        }  
    ]  
}  
```  
## debug in terminal  
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
## pm2 debug  
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
## Current TS File  
```  
{  
            "name": "Current TS File",  
            "type": "node",  
            "request": "launch",  
            "program": "${workspaceRoot}/node_modules/ts-node/dist/bin.js",  
            "args": [  
                "${relativeFile}"  
            ],  
            "sourceMaps": true,  
            "cwd": "${workspaceRoot}",  
            "protocol": "inspector",  
            "console": "integratedTerminal",  
            "internalConsoleOptions": "neverOpen"  
}  
```  
## jest  
```  
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
```  
### Install windows node build tools  
```  
npm install --global --production windows-build-tools  
```  
  
### View all of the version of express  
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
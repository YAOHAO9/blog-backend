### Vscode extensions  
```  
Remote SSH   
REST Client  
Source maps navigator  
Git (Submodule) Assistant  
Git History  
GitLens  
Turbo Console Log (1、选中变量 2、Ctrl+Alt+L：自动打印 3、Shift+Alt+D：删除所有自动生成的打印记录)  
Auto Close Tag  
Import Cost 统计导入文件的大小  
Code Runner 运行代码  
Comment Translate 翻译注释  
```  
### Chrome extensions  
```  
ElasticSearch Head  
```  
  
### 软件  
```  
Beyond compare  
FScapture  
Another redis desktop manager  
XlsxToLua  
批量下载（chrome插件）  
ShoeBox 字体制作、切图、合成图片和plist等 http://renderhjs.net/shoebox/  
TexturePacker 多张图片和为1，并生成plist.json文件  
ScreenToGif  
snipaste 截图工具  
webtorrent.io  
npm i whistle // nodejs 抓包工具   
sentinel-golang 限流  
DBeaver 开源数据库工具，支持大多数数据库   
Aptoide、apkpure、APKpure、9Apps、svlapk、GetJar、Uptodown、F-Droid安卓应用中心  
topology 在线画图工具  
Copper k8s yaml校验工具 https://juejin.im/post/6890796624465887239  
https://kube-score.com/ k8s yaml配置建议  
```  
  
### npm packages  
```  
npx  
yo  
windows-build-tools  
anyproxy  
Ip2region ip查询库  
FFCreator 简单视频制作工具  
```  
  
### 模拟器  
```  
夜神  
```  
### GSAP，专业的Web动画库  
```  
tween  
```  
### Code snippets  
```  
function getProperty<T, K extends keyof T>(obj: T, key: K) {  
    return obj[key];  
}  
```  
```  
// Object.preventExtensions(...) < Object.seal() < Object.freeze()  
// 不能新增 < 且不能配置 < 且不能写  
```  
```  
当我们在用 addEventListener 注册事件监听器时，可以传递第三个参数，指定这个事件要在什么阶段触发：  
  
elem.addEventListener('click', eventHandler) // 未指定，预设为冒泡  
elem.addEventListener('click', eventHandler, false) // 冒泡  
elem.addEventListener('click', eventHandler, true) // 捕获  
elem.addEventListener('click', eventHandler, {  
  capture: true // 是否为捕获。 IE、Edge 不支援。其他属性请参考 MDN  
})  
```  
  
```  
// { prototype: any } 非抽象类 // { prototype: any } 抽象类  
function applyMixins<T extends new (...args: any[]) => any>(...baseCtors: ({ prototype: any } | (new (...args: any[]) => {}))[]) {  
    return (derivedCtor: T) => {  
        baseCtors.forEach(baseCtor => {  
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {  
                derivedCtor.prototype[name] = baseCtor.prototype[name];  
            });  
        });  
        class New extends derivedCtor {  
            constructor(...args: any[]) {  
            	  baseCtors.forEach(baseCtor => {  
                    baseCtor.prototype.constructor.call(this, ...args);  
                });  
                super(...args);  
            }  
        }  
        return New;  
    };  
}  
```  
```  
    // 计算垂点  
    private getVerticalCrossPoint(point1: cc.Vec2, point2: cc.Vec2, point3: cc.Vec2): cc.Vec2 {  
        const dx = point2.x - point1.x;  
        const dy = point2.y - point1.y;  
  
        // 垂直x轴  
        if (dx === 0) {  
            return new cc.Vec2(point1.x, point3.y);  
        }  
        // 垂直y轴  
        if (dy === 0) {  
            return new cc.Vec2(point1.y, point3.x);  
        }  
  
        // 斜率k1  
        const k1 = dy / dx;  
        // 常数c1  
        const c1 = point1.y - (k1 * point1.x);  
  
        // 斜率k2  
        const k2 = -1 / k1;  
        // 常数c1  
        const c2 = point3.y - (k2 * point3.x);  
  
        // 求垂点  
        const x = (c1 - c2) / (k2 - k1);  
        const y = k1 * x + c1;  
  
        return new cc.Vec2(x, y);  
    }  
```  
  
## magic website  
```  
https://tinypng.com/ #图片压缩  
https://flourish.studio/ #Flourish:数据可视化，你可以快速地把表格数据转换为各种各样好看的图表，并且还支持动态可视化  
https://www.crx4chrome.com/ #crx4chrome:下载Chrome浏览器插件  
https://apkpure.com/cn/ #Apkpure:安卓安装包下载  
https://www.draw.io/ #在线流程图工具  
https://tophub.today/ #今日热榜:你关心的热点  
https://www.kapwing.com/ #Kapwing:一个用于创建图像，视频和GIF的协作平台  
https://jex.im/regulex/ 可视化正则表达式  
uusign.net // 签名  
```  
  
## 其他  
```  
链接:https://pan.baidu.com/s/1ZQEKJBgtYle3v-1LimcSwg 密码:wjk6 大神笔记  
```  
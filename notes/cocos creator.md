### destroy 和 removeFromParent 的区别  
```  
调用一个节点的 removeFromParent 后，它不一定就能完全从内存中释放，因为有可能由于一些逻辑上的问题，导致程序中仍然引用到了这个对象。因此如果一个节点不再使用了，请直接调用它的 destroy 而不是 removeFromParent。destroy 不但会激活组件上的 onDestroy，还会降低内存泄露的几率，同时减轻内存泄露时的后果  
```  
  
### android真机调试  
```  
1、连接  
2、adb logcat|grep  "chrome-devtools"  
3、根据输出编辑这条命令并执行：adb forward tcp:6086 tcp:6086  
4、devtools://devtools/bundled/inspector.html?v8only=true&ws=127.0.0.1:6086/00010002-0003-4004-8005-000600070008 // 将RUL输chrome开始调试（js_app.html=>inspector.html ,localhost=>127.0.0.1）  
```  
  
### HTTP  
```  
const makeRequest = async (url, method = "GET", data = null): Promise<any> => {  
  
    let result;  
    try {  
        result = await new Promise((resolve, reject) => {  
  
            const request = new XMLHttpRequest();  
  
            request.onerror = (e: ProgressEvent) => {  
                // if (e) {  
                //     reject(e);  
                //     return;  
                // }  
                // reject(new Error(`Http request failed`));  
            };  
  
            request.onreadystatechange = () => {  
  
                if (request.readyState !== 4) {  
                    return;  
                }  
  
                if (request.status >= 200 && request.status < 300) {  
                    resolve(JSON.parse(request.responseText));  
                    return;  
                }  
  
                if (request.status) {  
                    const e = new Error(JSON.stringify({  
                        status: request.status,  
                        statusText: request.statusText,  
                    }));  
                    reject(e);  
                }  
            };  
  
            if (cc.sys.isNative && (request as any).openRequest) {  
                (request as any).openRequest(method, url, true);  
            } else {  
                request.open(method, url, true);  
            }  
  
            request.setRequestHeader("Content-type", "application/json; charset=utf-8");  
  
            data ? request.send(JSON.stringify(data)) : request.send();  
  
        });  
    } catch (e) {  
        console.error(e);  
    }  
  
    return result;  
};  
  
export default class Http {  
  
    public static post(url, data) {  
        return makeRequest(url, "POST", data);  
    }  
  
    public static get(url, data = null) {  
        return makeRequest(url, "GET", data);  
    }  
  
    public static delete(url) {  
        return makeRequest(url, "DELETE");  
    }  
  
    public static put(url, data) {  
        return makeRequest(url, "DELETE", data);  
    }  
}  
```  
### 统一错误收集  
```  
  
if (cc.sys.isNative) {  
    const global: any = window;  
    global.__errorHandler = (file, source, message, stack, error) => {  
        console.error(JSON.stringify({  
            file,  
            message,  
            stack,  
            source,  
            error,  
        }, null, 2));  
    };  
} else if (cc.sys.isBrowser) {  
    window.onerror = (message, source, lineno, colno, error) => {  
        console.error(JSON.stringify({  
            source,  
            lineno,  
            colno,  
            message,  
            error,  
        }, null, 2));  
    };  
}  
```  
### pomelo  
```  
import { pomelo, Session } from "pomelo2-creator";  
import CommonTools from "../utils/tools";  
import DwcConst from "../base/baseConst";  
import SceneManager from "../scene/SceneManager";  
import { Config } from "../utils/config";  
  
class Logger {  
    public trace(message, body) {  
        // console.log.call(this, "%c[TRACE] %s:%j", "color:#87CEEB;", message, body);  
    }  
    public info(message, body) {  
        // console.log.call(this, "%c[INFO] %s:%j", "color:#228B22;", message, body);  
    }  
    public debug(message, body) {  
        // console.log.call(this, "%c[DEBUG] %s:%j", "color:#0000FF;", message, body);  
    }  
    public warn(message, body) {  
        // console.log.call(this, "%c[WARN] %s:%j", "color:#FFD700;", message, body);  
    }  
    public error(message, body) {  
        // console.log.call(this, "%c[ERROR] %s:%j", "color:#DC143C;", message, body);  
    }  
    public fatal(message, body) {  
        // console.log.call(this, "%c[FATAL] %s:%j", "color:#9400D3;", message, body);  
    }  
}  
  
export default class Pomelo {  
    public static uid: string;  
    private static myInstance: Pomelo;  
    private static session: Session;  
    private static isConnected: boolean;  
    private static isConnecting: boolean;  
  
    public listenersMap: {  
        [tag: string]: Array<{  
            event: string | symbol,  
            listener: (...args: any[]) => void,  
        }>,  
    } = {};  
  
    public static get instance() {  
        if (!this.myInstance) {  
            this.myInstance = new Pomelo();  
        }  
        return this.myInstance;  
    }  
  
    private constructor() { }  
  
    private async auth(): Promise<object | undefined> {  
        if (!Pomelo.uid) {  
            Pomelo.uid = localStorage.getItem("uid");  
        }  
        const token = localStorage.getItem("token");  
        const result = await Pomelo.session.request(`connector.entryHandler.enterPlat`, { token });  
        if (result && result.code) {  
            if (result.code === DwcConst.ErrCode.INVAILD_TOKEN) {  
                SceneManager.change(SceneManager.SceneMap.LoginScene);  
                return;  
            }  
            console.warn(result);  
            return;  
        }  
        Pomelo.isConnected = true;  
        return {};  
    }  
  
    public async init() {  
  
        if (Pomelo.isConnecting) {  
            await CommonTools.sleep(100);  
            return;  
        }  
        Pomelo.isConnecting = true;  
  
        if (Pomelo.session) {  
            this.auth();  
            return;  
        }  
        Pomelo.session = pomelo.create(Config.server.pomelo, {  
            /// 认证函数( 自动重连 )  
            auth: this.auth,  
  
            localstorage: {  
                setItem: localStorage.setItem.bind(localStorage),  
                getItem: localStorage.getItem.bind(localStorage),  
            },  
            /// 重试次数  
            retry: Infinity,  
            logger: new Logger(),  
        });  
  
        /// 认证通过了  
        Pomelo.session.on("ready", () => {  
            console.warn("连接成功");  
            Pomelo.isConnected = true;  
        });  
  
        Pomelo.session.on("error", () => {  
            console.log("error");  
            Pomelo.isConnected = false;  
        });  
        Pomelo.session.on("disconnect", () => {  
            console.log("disconnect");  
            Pomelo.isConnected = false;  
        });  
        Pomelo.session.on("reconnect", () => {  
            console.log("reconnect");  
            Pomelo.isConnected = true;  
        });  
        Pomelo.session.on("kickout", () => {  
            console.log("kickout");  
            Pomelo.isConnected = false;  
        });  
  
        while (!Pomelo.isConnected) {  
            await CommonTools.sleep(100);  
        }  
    }  
  
    public async request(route: string, msg: any): Promise<any> {  
        while (!Pomelo.isConnected) {  
            await Pomelo.instance.init();  
        }  
        return Pomelo.session.request(route, msg);  
    }  
  
    public async notify(route: string, msg: any): Promise<any> {  
        while (!Pomelo.isConnected) {  
            await Pomelo.instance.init();  
        }  
        return Pomelo.session.notify(route, msg);  
    }  
  
    public async addListener(event: string | symbol, listener: (...args: any[]) => void, tag: string = "default") {  
        while (!Pomelo.isConnected) {  
            await Pomelo.instance.init();  
        }  
        if (!this.listenersMap[tag]) {  
            this.listenersMap[tag] = [];  
        }  
        this.listenersMap[tag].push({  
            event,  
            listener,  
        });  
        (Pomelo.session as any as NodeJS.EventEmitter).addListener(event, listener);  
    }  
  
    public async removeListener(tag: string = "default") {  
        while (!Pomelo.isConnected) {  
            await Pomelo.instance.init();  
        }  
        if (!this.listenersMap[tag]) {  
            return;  
        }  
  
        this.listenersMap[tag].forEach((item) => {  
            (Pomelo.session as any as NodeJS.EventEmitter).removeListener(item.event, item.listener);  
        });  
        this.listenersMap[tag] = [];  
    }  
  
}  
  
```  
### 加密  
```  
import * as Crypto from "crypto-browserify";  
import { Buffer } from "buffer";  
  
const algorithm = "aes-256-cbc";  
const iv = "1111111111111111";  
  
export default class MyCrypto {  
  
    public static cryptoDecode(base64Data: string, key: string) {  
        const data = Buffer.from(base64Data, "base64").toString();  
  
        const decipher = Crypto.createDecipheriv(algorithm, this.hash(this.hash(key).slice(-6)), iv);  
        const decoded = decipher.update(data, "hex", "utf8") + decipher.final("utf8");  
  
        return JSON.parse(decoded);  
    }  
  
    public static hash(key) {  
        return Crypto.createHash("md5").update(key).digest("hex");  
    }  
  
    public static cryptoEncode(data: any) {  
        const key = (Date.now()).toString(16).slice(-6);  
  
        const cipher = Crypto.createCipheriv(algorithm, this.hash(this.hash(key).slice(-6)), iv);  
        const encoded = cipher.update(JSON.stringify(data), "utf8", "hex") + cipher.final("hex");  
  
        const base64Data = Buffer.from(encoded).toString("base64");  
  
        return { base64Data, key };  
    }  
}  
  
```  
### 问题  
```  
https://www.cnblogs.com/sessionbest/articles/8689082.html  
已知问题：粒子系统的 plist 所引用的贴图不会被自动释放。如果要自动释放粒子贴图，请从 plist 中移除贴图信息，改用粒子组件的 Texture 属性来指定贴图。  
```  
### 贝塞尔曲线工具  
```  
const { ccclass, property } = cc._decorator;  
import Bluebird from "bluebird";  
import CommonTools from "../../utils/tools";  
  
const Color = {  
    Selected: cc.color(0xF5, 0x2F, 0x47),  
    Normal: cc.color(0x73, 0xAF, 0xF0),  
};  
  
enum KeyCode {  
    Left = 37,  
    Up = 38,  
    Right = 39,  
    Down = 40  
}  
@ccclass  
export default class NewClass extends cc.Component {  
  
    @property(cc.Node)  
    private canvas: cc.Node = null;  
    @property(cc.Graphics)  
    private graphics: cc.Graphics = null;  
    @property(cc.Layout)  
    private editLayout: cc.Layout = null;  
    @property(cc.EditBox)  
    private xEditBox: cc.EditBox = null;  
    @property(cc.EditBox)  
    private yEditBox: cc.EditBox = null;  
    @property(cc.Node)  
    private tortoise: cc.Node = null;  
  
    private pointArray: cc.Node[] = [];  
    private clickPos: cc.Vec2;  
    private isMoving: boolean = false;  
    private selectedNode: cc.Node = null;  
    private destPos: cc.Vec2;  
    private Spped: number = 500;  
    private lastClickTime: number = 0;  
    start() {  
  
        // 监听touch start事件  
        this.canvas.on(cc.Node.EventType.TOUCH_START, (event: cc.Touch) => {  
            this.isMoving = true;  
            this.destPos = this.canvas.convertToNodeSpaceAR(event.getLocation());  
            if (this.editLayout.node.getBoundingBoxToWorld().contains(event.getLocation())) {  
                this.updateSelectPoint(this.editLayout.node);  
                return;  
            }  
            let selectedPoint = null;  
            for (let i = this.pointArray.length - 1; i >= 0; i--) {  
                const point = this.pointArray[i];  
                if (point.getBoundingBoxToWorld().contains(event.getLocation())) {  
                    selectedPoint = point;  
                    break;  
                }  
            }  
            const now = Date.now();  
            if (selectedPoint && (now - this.lastClickTime) < 200) {  
                this.pointArray.splice(this.pointArray.indexOf(selectedPoint), 1);  
                this.updateSelectPoint(null);  
                selectedPoint.destroy();  
                this.rename();  
                this.draw();  
                return;  
            }  
            this.clickPos = this.canvas.convertToNodeSpaceAR(event.getLocation());  
            this.lastClickTime = now;  
            this.updateSelectPoint(selectedPoint);  
        });  
        // 监听touch move事件  
        this.canvas.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Touch) => {  
            this.destPos = this.canvas.convertToNodeSpaceAR(event.getLocation());  
            this.updateEditPosition();  
        });  
        // 监听touch end事件  
        this.canvas.on(cc.Node.EventType.TOUCH_END, async (event: cc.Touch) => {  
  
            const vec2 = this.canvas.convertToNodeSpaceAR(event.getLocation());  
            if (this.clickPos && vec2.sub(this.clickPos).mag() < 20 && !this.selectedNode) {  
  
                const loadRes = Bluebird.promisify<cc.Node, string, typeof cc.Asset>(cc.loader.loadRes, { context: cc.loader });  
  
                const prefab = await loadRes("prefabs/tools/Point", cc.Prefab);  
  
                const point: cc.Node = cc.instantiate(prefab);  
  
                point.x = vec2.x;  
                point.y = vec2.y;  
                this.canvas.addChild(point);  
                this.pointArray.push(point);  
                point.name = this.pointArray.length.toString();  
                point.getChildByName("num").getComponent(cc.Label).string = point.name;  
                this.updateSelectPoint(point);  
                this.draw();  
            }  
            this.isMoving = false;  
            this.clickPos = null;  
            this.destPos = null;  
        });  
        // 监听方向键  
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (event: cc.Event.EventKeyboard) => {  
  
            if (!this.selectedNode) {  
                return;  
            }  
            const speed = 1;  
            switch (event.keyCode) {  
                case KeyCode.Left:  
                    this.selectedNode.x -= speed;  
                    break;  
                case KeyCode.Up:  
                    this.selectedNode.y += speed;  
                    break;  
                case KeyCode.Right:  
                    this.selectedNode.x += speed;  
                    break;  
                case KeyCode.Down:  
                    this.selectedNode.y -= speed;  
                    break;  
            }  
            this.draw();  
            this.updateEditPosition();  
        });  
        // 小乌龟开游  
        let isSwimming = false;  
        setInterval(() => {  
            if (this.pointArray.length < 3) {  
                return;  
            }  
            if (isSwimming) {  
                return;  
            }  
            isSwimming = true;  
            this.tortoise.x = this.pointArray[0].x;  
            this.tortoise.y = this.pointArray[0].y;  
  
            const tween = cc.tween(this.tortoise);  
  
            const pointList = this.pointArray.map(point => [point.x, point.y]);  
            const interval = 0.02;  
            let lastAngle: number = null;  
            for (let i = 2; i < this.pointArray.length; i += 2) {  
  
                const [x1, y1] = pointList[i - 2];  
                const [cx, cy] = pointList[i - 1];  
                const [x2, y2] = pointList[i];  
                let lastPoint = [x1, y1];  
                Array.from({ length: 100 }).forEach((_, index) => {  
                    const t = (index + 1) / 100;  
                    const x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2;  
                    const y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;  
                    const [lastX1, lastY1] = lastPoint;  
                    let tan;  
                    const dx = x - lastX1;  
                    const dy = y - lastY1;  
                    let direction = 0;  
                    if (dx === 0) {  
                        if (dy >= 0) {  
                            tan = Infinity;  
                        } else {  
                            tan = -Infinity;  
                        }  
                    } else {  
                        tan = dy / dx;  
                    }  
                    if (dx < 0) {  
                        direction = 180;  
                    }  
                    let angle = direction + Math.atan(tan) * 180 / Math.PI;  
                    if (lastAngle) {  
                        const da = angle - lastAngle;  
                        let dp = Math.round(da / 360);  
                        const dr = da % 360;  
                        if (dr >= 180 && dr < 270) {  
                            dp -= 1;  
                        }  
                        angle -= dp * 360;  
                    }  
  
                    lastAngle = angle;  
  
                    tween.to(interval, { x, y, angle });  
                    lastPoint = [x, y];  
                });  
  
            }  
            tween  
                .call(() => {  
                    isSwimming = false;  
                })  
                .start();  
        }, 1000 * 5);  
    }  
  
    // update  
    update(dt: number) {  
        if (!this.isMoving || !this.selectedNode) {  
            return;  
        }  
        if (this.selectedNode.getBoundingBox().contains(this.destPos)) {  
            return;  
        }  
        const sourcePos = this.selectedNode.getPosition();  
        const vertor = this.destPos.sub(sourcePos);  
        let newPos: cc.Vec2;  
        if (vertor.mag() > (this.Spped * dt)) {  
            const direction = vertor.normalize();  
            newPos = sourcePos.add(direction.mul(this.Spped * dt));  
        } else {  
            newPos = sourcePos.add(vertor);  
        }  
        this.selectedNode.setPosition(newPos);  
        this.draw();  
    }  
  
    // 绘制  
    private draw() {  
        this.adjustPosition();  
        this.updateEditPosition();  
        const g = this.graphics;  
        g.clear();  
        if (this.pointArray.length < 3) {  
            return;  
        }  
        const pointList = this.pointArray.map(point => [point.x, point.y]);  
        g.moveTo(...pointList[0]);  
  
        for (let i = 2; i < pointList.length; i += 2) {  
            const point2 = pointList[i - 1];  
            const point3 = pointList[i] || [];  
            g.quadraticCurveTo(...point2, ...point3);  
        }  
        g.stroke();  
    }  
  
    // 重命名  
    private rename() {  
        this.pointArray.forEach((point, index) => {  
            point.name = (index + 1).toString();  
            point.getChildByName("num").getComponent(cc.Label).string = point.name;  
        });  
    }  
  
    // 打印位置  
    private updateEditPosition() {  
        if (!this.selectedNode) {  
            return;  
        }  
        this.xEditBox.string = this.selectedNode.x.toString();  
        this.yEditBox.string = this.selectedNode.y.toString();  
    }  
  
    // 计算垂点  
    private getVerticalCrossPoint(point1: cc.Vec3, point2: cc.Vec3, point3: cc.Vec3): cc.Vec2 {  
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
  
    // 调整位置  
    private adjustPosition() {  
        if (this.pointArray.length < 4) {  
            return;  
        }  
  
        for (let i = 3; i < this.pointArray.length; i += 2) {  
            const point = this.pointArray[i - 1];  
            const newPosition = this.getVerticalCrossPoint(this.pointArray[i - 2].position, this.pointArray[i].position, point.position);  
            point.x = newPosition.x;  
            point.y = newPosition.y;  
        }  
    }  
  
    // 设置选中的点  
    private updateSelectPoint(point: cc.Node) {  
  
        if (this.selectedNode) {  
            this.selectedNode.color = Color.Normal;  
        }  
        this.selectedNode = point;  
        if (!this.selectedNode) {  
            return;  
        }  
        this.selectedNode.color = Color.Selected;  
        this.updateEditPosition();  
    }  
  
    // 坐标输入框值变化  
    public textChanged() {  
        if (!this.selectedNode) {  
            return;  
        }  
        if (!CommonTools.isNumber(this.xEditBox.string) || !CommonTools.isNumber(this.yEditBox.string)) {  
            return;  
        }  
        this.selectedNode.x = +this.xEditBox.string;  
        this.selectedNode.y = +this.yEditBox.string;  
        this.draw();  
    }  
}  
  
```  
### 热更  
```  
  
source=$1  
if [ -z $source ]  
then  
    echo "请输入热更文件所在文件夹"  
    exit 1  
fi  
  
if [ ! -d $source ]  
then  
    echo "$source 不是一个文件夹"  
    exit 1  
fi  
  
CocosCreator.exe --path . --build "platform=android;debug=true"  
  
temp=${source}src/temp.js  
project=${source}src/project.dev.js  
if [ ! -e $project ]  
then  
    project=$source/src/project.js  
    if [ ! -e $project ]  
    then      
        echo project.js or project.dev.js does not exit  
        exit   
    fi  
fi  
  
echo "(function () {  
    if (typeof window.jsb === 'object') {  
        var hotUpdateSearchPaths = localStorage.getItem('HotUpdateSearchPaths');  
        if (hotUpdateSearchPaths) {  
            jsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths));  
        }  
    }  
})();" >> $temp  
echo $project  
cat $project >> $temp  
cat $temp > $project  
rm -rf $temp  
  
remoteAddr=http://192.168.3.107/hotUpdate/  
hash=`git log --format="%h" -n 1`  
version=`ts-node scripts/node/get_version`  
ts-node scripts/node/version_gen -v $version -u $remoteAddr -s $source -d assets/  
  
archiveName=hotUpdate  
mkdir $archiveName  
cp -rf ${source}res $archiveName  
cp -rf ${source}src $archiveName  
cp assets/project.manifest $archiveName  
cp assets/version.manifest $archiveName  
  
tar -czvf  ${archiveName}.tar.gz $archiveName  
  
scp -P 3000 ${archiveName}.tar.gz root@192.168.3.107:/data/nginx/nginx2/  
  
ssh -p 3000 root@192.168.3.107 << EOF  
    cd /data/nginx/nginx2/  
    tar -xzvf ${archiveName}.tar.gz  
EOF  
  
rm -rf ${archiveName} ${archiveName}.tar.gz  
```  
```  
        if (!cc.sys.isNative) {  
            return;  
        }  
        if (typeof jsb === "object") {  
            const destDir = jsb.fileUtils.getWritablePath() + "hotUpdate/";  
            const searchPaths = jsb.fileUtils.getSearchPaths();  
            if (!searchPaths.includes(destDir)) {  
                const newSearchPaths = [destDir, ...jsb.fileUtils.getSearchPaths()];  
                jsb.fileUtils.setSearchPaths(newSearchPaths);  
                localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(newSearchPaths));  
            }  
            const tempDir = destDir.replace(/\/$/, "_temp/");  
            jsb.fileUtils.removeDirectory(tempDir);  
            // assetsManager  
            const assetsManager = jsb.AssetsManager.create(jsb.fileUtils.getWritablePath(), destDir);  
            // 比较函数  
            assetsManager.setVersionCompareHandle((localVersion, remoteVersion) => {  
                Alert.warn(`JS Custom Version Compare: localVersion is ${localVersion} + remoteVersion is ${remoteVersion}`, 5);  
                const vA = localVersion.split(".");  
                const vB = remoteVersion.split(".");  
                for (let i = 0; i < vA.length; ++i) {  
                    const a = parseInt(vA[i], 10);  
                    const b = parseInt(vB[i] || "0", 10);  
                    if (a === b) {  
                        continue;  
                    }  
                    else {  
                        return a - b;  
                    }  
                }  
                if (vB.length > vA.length) {  
                    return -1;  
                } else {  
                    return 0;  
                }  
            });  
  
            // 事件监听  
            assetsManager.setEventCallback(async (event) => {  
                switch (event.getEventCode()) {  
                    case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:  
                        Alert.warn("找不到本地Manifest");  
                        break;  
                    case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:  
                        Alert.warn("无法下载Manifest");  
                        break;  
                    case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:  
                        Alert.warn("Manifest 解析失败");  
                        break;  
                    case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:  
                        Alert.warn("已经更新了最新的远程版本");  
                        break;  
                    case jsb.EventAssetsManager.NEW_VERSION_FOUND:  
                        Alert.warn("找到新版本, 请尝试更新");  
                        if (assetsManager.getState() === jsb.AssetsManager.State.UPDATING) {  
                            return;  
                        }  
                        assetsManager.update();  
                        break;  
                    case jsb.EventAssetsManager.UPDATE_PROGRESSION:  
                        Alert.warn("正在更新：" + event.getAssetId());  
                        break;  
                    case jsb.EventAssetsManager.ASSET_UPDATED:  
                        Alert.warn("更新完成：" + event.getAssetId());  
                        break;  
                    case jsb.EventAssetsManager.ERROR_UPDATING:  
                        Alert.warn("更新失败:" + event.getAssetId());  
                        jsb.fileUtils.removeFile(`${tempDir}${event.getAssetId()}.tmp`);  
                        break;  
                    case jsb.EventAssetsManager.UPDATE_FINISHED:  
                        Alert.warn("更新完成，即将重启");  
                        jsb.fileUtils.removeDirectory(tempDir);  
                        await CommonTools.sleep(2000);  
                        cc.game.restart();  
                        break;  
                    case jsb.EventAssetsManager.UPDATE_FAILED:  
                        Alert.warn("更新失败");  
                        break;  
                    case jsb.EventAssetsManager.ERROR_DECOMPRESS:  
                        Alert.warn("解压失败");  
                        break;  
                }  
            });  
  
            // 是否需要更新  
            assetsManager.setVerifyCallback((filePath, asset) => {  
                Alert.warn(`filePath ${filePath}`);  
                const md5 = MyCrypto.hash(jsb.fileUtils.getDataFromFile(filePath).toString());  
                return md5 === asset.md5;  
            });  
  
            const localManifest = assetsManager.getLocalManifest();  
            if (!localManifest || !localManifest.isLoaded()) {  
                const manifestPath = destDir + "project.manifest";  
                let manifest;  
                if (jsb.fileUtils.isFileExist(manifestPath)) {  
                    manifest = new jsb.Manifest(jsb.fileUtils.getStringFromFile(manifestPath), "");  
                } else {  
                    manifest = new jsb.Manifest(JSON.stringify(defaultManifest), "");  
                }  
  
                assetsManager.loadLocalManifest(manifest, destDir);  
            }  
  
            assetsManager.checkUpdate();  
        }  
```  
### 子游戏  
```  
var searchPaths = JSON.parse(localStorage.getItem("HotUpdateSearchPaths"))  
  
var settings = null  
searchPaths.forEach(path => {  
    if (path === "@assets/") {  
        path = ""  
    } else {  
  
    }  
    window.require(`${path}src/settings.js`)  
  
    if (!window._CCSettings) {  
        return  
    }  
  
    if (window._CCSettings.jsList) {  
        window._CCSettings.jsList = window._CCSettings.jsList.map(subPath => `${path}src/${subPath}`)  
    } else {  
        window._CCSettings.jsList = []  
    }  
    window._CCSettings.jsList.push(`${path}src/project.dev.js`)  
  
    if (path === "") {  
        window._CCSettings.jsList = []  
    }  
  
    if (!settings) {  
        settings = window._CCSettings  
        return  
    }  
  
    settings.rawAssets.assets = { ...settings.rawAssets.assets, ...window._CCSettings.rawAssets.assets }  
    settings.rawAssets.internal = { ...settings.rawAssets.internal, ...window._CCSettings.rawAssets.internal }  
    settings.scenes = [...settings.scenes, ...window._CCSettings.scenes]  
    settings.packedAssets = { ...settings.packedAssets, ...window._CCSettings.packedAssets }  
    settings.jsList = [...settings.jsList, ...window._CCSettings.jsList]  
})  
  
if (settings) {  
    if (!settings.debug) {  
        var uuids = settings.uuids;  
  
        var rawAssets = settings.rawAssets;  
        var assetTypes = settings.assetTypes;  
        var realRawAssets = settings.rawAssets = {};  
        for (var mount in rawAssets) {  
            var entries = rawAssets[mount];  
            var realEntries = realRawAssets[mount] = {};  
            for (var id in entries) {  
                var entry = entries[id];  
                var type = entry[1];  
                // retrieve minified raw asset  
                if (typeof type === 'number') {  
                    entry[1] = assetTypes[type];  
                }  
                // retrieve uuid  
                realEntries[uuids[id] || id] = entry;  
            }  
        }  
  
        var scenes = settings.scenes;  
        for (var i = 0; i < scenes.length; ++i) {  
            var scene = scenes[i];  
            if (typeof scene.uuid === 'number') {  
                scene.uuid = uuids[scene.uuid];  
            }  
        }  
  
        var packedAssets = settings.packedAssets;  
        for (var packId in packedAssets) {  
            var packedIds = packedAssets[packId];  
            for (var j = 0; j < packedIds.length; ++j) {  
                if (typeof packedIds[j] === 'number') {  
                    packedIds[j] = uuids[packedIds[j]];  
                }  
            }  
        }  
  
        var subpackages = settings.subpackages;  
        for (var subId in subpackages) {  
            var uuidArray = subpackages[subId].uuids;  
            if (uuidArray) {  
                for (var k = 0, l = uuidArray.length; k < l; k++) {  
                    if (typeof uuidArray[k] === 'number') {  
                        uuidArray[k] = uuids[uuidArray[k]];  
                    }  
                }  
            }  
        }  
    }  
  
    cc.AssetLibrary.init({  
        libraryPath: 'res/import',  
        rawAssetsBase: 'res/raw-',  
        rawAssets: settings.rawAssets,  
        packedAssets: settings.packedAssets,  
        md5AssetsMap: settings.md5AssetsMap,  
        subpackages: settings.subpackages  
    });  
      
    settings.jsList.forEach(js => {  
        window.require(js)  
    })  
  
    var option = {  
        id: 'GameCanvas',  
        scenes: settings.scenes,  
        debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,  
        showFPS: settings.debug,  
        frameRate: 60,  
        jsList: settings.jsList,  
        groupList: settings.groupList,  
        collisionMatrix: settings.collisionMatrix,  
    };  
  
    cc.game.run(option, () => cc.loader.downloader._subpackages = settings.subpackages);  
}  
```  
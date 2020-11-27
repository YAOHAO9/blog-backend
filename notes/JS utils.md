### 常用工具函数  
``` javascript  
let utils = {  
    underlineToCamel(s) {  
        return s.toLowerCase().replace(/_\w/g, function (x) { return x.slice(1).toUpperCase() })  
    },  
    camelToUnderline(s) {  
        return s.replace(/([A-Z])/g, "_$1").toLowerCase()  
    },  
    strikethroughToCamel(s) {  
        return s.toLowerCase().replace(/-\w/g, function (x) { return x.slice(1).toUpperCase() })  
    },  
    camelToStrikethrough(s) {  
        return s.replace(/([A-Z])/g, "-$1").toLowerCase()  
    },  
    captionToCamel(s) {  
        return s.toLowerCase().replace(/ \w/g, function (x) { return x.slice(1).toUpperCase() })  
    },  
    camelToCaption(s) {  
        s = s.replace(/([A-Z])/g, " $1").toLowerCase()  
        return s[0].toUpperCase() + s.slice(1)  
    },  
    initConsole() {  
       let error = console.error  
       let warn = console.warn  
       let log = console.log  
       console.error = function () {  
           let now = (new Date()).toLocaleString() + ':'  
           error(now)  
           error(...arguments)  
       }  
       console.warn = function () {  
           let now = (new Date()).toLocaleString() + ':'  
           warn(now)  
           warn(...arguments)  
       }  
       console.log = function () {  
           let now = (new Date()).toLocaleString() + ':'  
           log(now)  
           log(...arguments)  
       }  
   }  
}  
      
let formatNumber = (num, precision = 2) => Number((Math.ceil(Math.round(num * 100, precision)) / 100).toFixed(precision))  
  
let isNumber = (value) => value !== '' && typeof +value === 'number' && !isNaN(+value) && +value >= 0 && ((/(^\d*$)/u).test(value));  
  
/**  
 * 列出ES6的一个Class实例上的所有方法，但不包括父类的  
 * @param objInstance   
 */  
export function listEs6ClassMethods(objInstance: {[key:string]:any})  
{  
    let names: string[] = [];  
    let methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(objInstance)).concat(Object.getOwnPropertyNames(objInstance));  
    for (let name of methodNames)  
    {  
        let method = objInstance[name];  
        // Supposedly you'd like to skip constructor  
        if (!(method instanceof Function) || name == "constructor") continue;  
        names.push(name);  
    }  
    return names;  
}  
  
```  
  
### 工具类  
```  
import * as v8 from "v8";  
import * as os from "os";  
import * as fs from "fs";  
import * as path from "path";  
export { fs, path };  
  
export interface CpuUsage extends NodeJS.CpuUsage {  
    time?: number;  
    percent?: number;  
}  
export default class CommonTools {  
    // 返回数值包括最大最小值  
    public static getRandomArea(min: number, max: number) {  
        return Math.floor(Math.random() * (max - min + 1) + min);  
    }  
    // 约束小数点到两位，最后一位会四舍五入  
    public static setFloatNum(value: number) {  
        return Math.round(value * 100) / 100;  
    }  
    public static setParseInt(value: string) {  
        return parseInt(value, 10);  
    }  
    // 抽水后的值  
    public static setChoushuiNum(value: string) {  
        return parseInt(value, 10);  
    }  
    public static getCurTimestamp() {  
        const date = new Date();  
        return parseInt((date.getTime() / 1000).toString(), 10);  
  
    }  
    public static promisify(inner, ...args) {  
        return new Promise((resolve, reject) => inner(...args, (err, res) => {  
            if (err) {  
                reject(err);  
            } else {  
                resolve(res);  
            }  
        }),  
        );  
    }  
    public static sleep(timestamp) {  
        return new Promise((resolve) => {  
            setTimeout(() => resolve(), timestamp);  
        });  
    }  
  
    // 根据首位两个值求等差数列  
    public static getArithmeticProgressionArr(first, last, total) {  
  
        const arr = [first];  
  
        if (first === last) {  
            return arr;  
        }  
  
        // 求出等差数列公差  
        const distance = (last - first) / (total - 1);  
  
        // 从第二个开始算，到最后一个前一个  
        for (let n = 2; n < total; n++) {  
            const value = first + distance * (n - 1);  
            arr.push(Math.floor(value));  
        }  
  
        arr.push(Math.floor(last));  
        return arr;  
    }  
  
    /******************************************************************  
     * 更新一个对象保留前三名，百人场结算使用  
     * topThree:{}更新的对象  
     * logicId：传入的玩家logicId  
     * gold:该玩家输赢的金币  
    *******************************************************************/  
    public static updateTopthree(topThree: { [key: string]: any }, logicId: string, winningCoin: number, uid: string, nickname: string) {  
        // if(gold < 0) return;  
        const len = Object.keys(topThree).length;  
        if (len < 3) {  
            topThree[uid] = {  
                logicId,  
                nickname,  
                winningCoin,  
            };  
        } else {  
            for (const id in topThree) {  
                if (topThree[id].winningCoin < winningCoin) {  
  
                    const leastCoinUid = this.findTheLeastCoinUid(topThree);  
                    topThree[leastCoinUid] = null;  
                    delete topThree[leastCoinUid];  
  
                    topThree[uid] = {  
                        logicId,  
                        nickname,  
                        winningCoin,  
                    };  
                    break;  
                }  
            }  
        }  
    }  
  
    // 找出最少钱的player的uid  
    public static findTheLeastCoinUid(topThree) {  
        let leastCoinUid = null;  
        for (const uid in topThree) {  
            if (leastCoinUid === null) {  
                leastCoinUid = uid;  
                continue;  
            }  
            if (topThree[leastCoinUid].winningCoin > topThree[uid].winningCoin) {  
                leastCoinUid = uid;  
            }  
        }  
        return leastCoinUid;  
    }  
    // 乱序排序  
    public static shuffle(array) {  
  
        if (!(array instanceof Array)) {  
            return;  
        }  
        if (array.length === 0) {  
            return;  
        }  
        for (let i = array.length - 1; i; i--) {  
            const x = array[i];  
            const j = parseInt(Math.random() * (i + 1) + "", 10);  
            array[i] = array[j];  
            array[j] = x;  
        }  
        return array;  
    }  
  
    public static isNumber(value) { return value !== "" && typeof +value === "number" && !isNaN(+value) && +value >= 0 && ((/(^\d*$)/u).test(value)); }  
  
    // 根据权重选择一个区域  
    public static getLuckyField(winWeightMap) {  
        let totalWinWight = 0;  
        for (const key in winWeightMap) {  
            totalWinWight += winWeightMap[key];  
        }  
        const randomWight = Math.random() * totalWinWight;  
        totalWinWight = 0;  
        for (const key in winWeightMap) {  
            totalWinWight += winWeightMap[key];  
            if (randomWight <= totalWinWight) {  
                return key;  
            }  
        }  
    }  
  
    // 解析命令行参数  
    public static parseArgs(args) {  
        const argsMap: any = {};  
        let mainPos = 1;  
  
        while (args[mainPos].indexOf("--") > 0) {  
            mainPos++;  
        }  
        argsMap.main = args[mainPos];  
  
        for (let i = (mainPos + 1); i < args.length; i++) {  
            const arg = args[i];  
            const sep = arg.indexOf("=");  
            const key = arg.slice(0, sep);  
            let value = arg.slice(sep + 1);  
            if (!isNaN(Number(value)) && (value.indexOf(".") < 0)) {  
                value = Number(value);  
            }  
            argsMap[key] = value;  
        }  
  
        return argsMap;  
    }  
  
    // 判断是否是有效的ip或者域名  
    public static isHost(value) {  
        if (!value) {  
            return false;  
        }  
        if (value.match(/^([-a-zA-Z0-9]+\.)+[a-z]+$/u)) {  
            return true;  
        }  
        if (value.match(/^((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3}$/u)) {// 匹配ip  
            return true;  
        }  
        return false;  
    }  
  
    // cpu使用百分比  
    public static getCpuUsage(lastCpuUsage: CpuUsage) {  
        const now = Date.now();  
  
        if (!lastCpuUsage) {  
            lastCpuUsage = process.cpuUsage();  
            lastCpuUsage.time = now;  
            lastCpuUsage.percent = 0;  
            return lastCpuUsage;  
        }  
  
        const cpuUsage: CpuUsage = process.cpuUsage();  
        cpuUsage.time = now;  
  
        cpuUsage.percent = ((cpuUsage.user + cpuUsage.system) - (lastCpuUsage.user + lastCpuUsage.system)) / (cpuUsage.time - lastCpuUsage.time) / 1000;  
  
        lastCpuUsage = cpuUsage;  
        return cpuUsage;  
    }  
  
    // 内存使用百分比  
    public static getMemoryUsage() {  
        const heapInfo = v8.getHeapStatistics();  
  
        const leftMemPertageOfSystem = os.freemem() / os.totalmem();  
        const leftMemPertageOfProcess = heapInfo.total_heap_size / heapInfo.heap_size_limit;  
  
        return leftMemPertageOfSystem > leftMemPertageOfProcess ? leftMemPertageOfSystem : leftMemPertageOfProcess;  
    }  
  
}  
```  
```  
const { ccclass, property } = cc._decorator;  
import CommonTools from "./tools";  
  
class PointData { constructor(public point: cc.Node, public time = 2) { } }  
  
class ChildFishLine {  
    public fish: cc.Node;  
    constructor(  
        public reverseX: boolean = false,  
        public reverseY: boolean = false,  
        public offsetX: number = 0,  
        public offsetY: number = 50,  
    ) {  
  
    }  
}  
  
const Color = {  
    Selected: cc.color(0x73, 0xAF, 0xF0),  
    Normal: cc.color(0xFF, 0x30, 0x30),  
    Gray: cc.Color.GRAY,  
    Red: cc.Color.RED  
};  
  
const ScreenBorderColor = cc.color(0x36, 0x64, 0x8B);  
  
const Colors: cc.Color[] = CommonTools.shuffle([  
    cc.color(0x66, 0x8B, 0x8B),  
    cc.color(0x00, 0xF5, 0xFF),  
    cc.color(0x00, 0x86, 0x8B),  
    cc.color(0x97, 0xFF, 0xFF),  
    cc.color(0xC1, 0xFF, 0xC1),  
    cc.color(0x54, 0xFF, 0x9F),  
    cc.color(0x2E, 0x8B, 0x57),  
    cc.color(0x00, 0x8B, 0x45),  
    cc.color(0x69, 0x8B, 0x22),  
    cc.color(0xFF, 0xF6, 0x8F),  
    cc.color(0xFF, 0xFF, 0xE0),  
    cc.color(0xFF, 0xFF, 0x00),  
    cc.color(0xFF, 0xD7, 0x00),  
    cc.color(0xFF, 0xB9, 0x0F),  
    cc.color(0x8B, 0x65, 0x8B),  
    cc.color(0xCD, 0x9B, 0x9B),  
    cc.color(0xFF, 0x6A, 0x6A),  
    cc.color(0xFF, 0xD3, 0x9B),  
    cc.color(0xFF, 0x7F, 0x24),  
    // cc.color(0xFF, 0x30, 0x30), // red  
    cc.color(0xCD, 0x70, 0x54),  
    cc.color(0xFF, 0xA5, 0x00),  
    cc.color(0xCD, 0x10, 0x76),  
    cc.color(0xFF, 0x34, 0xB3),  
    cc.color(0xCD, 0x69, 0xC9),  
    cc.color(0xAB, 0x82, 0xFF),  
    cc.color(0x00, 0x8B, 0x8B),  
    cc.color(0x90, 0xEE, 0x90),  
    cc.color(0x00, 0xBF, 0xFF),  
    cc.color(0x10, 0x4E, 0x8B),  
    cc.color(0x48, 0x76, 0xFF),  
    cc.color(0x83, 0x6F, 0xFF),  
    cc.color(0xFF, 0xDE, 0xAD),  
    cc.color(0xFF, 0x45, 0x00),  
    cc.color(0x8B, 0x45, 0x13),  
]);  
  
enum KeyCode {  
    Left = 37,  
    Up = 38,  
    Right = 39,  
    Down = 40  
}  
  
enum MouseBtn {  
    Left = 0,  
    Middle = 1,  
    Right = 2,  
}  
@ccclass  
export default class NewClass extends cc.Component {  
  
    @property(cc.Node)  
    private canvas: cc.Node = null;  
    @property(cc.Graphics)  
    private graphics: cc.Graphics = null;  
    @property(cc.Layout)  
    private menu: cc.Layout = null;  
    @property(cc.EditBox)  
    private xEditBox: cc.EditBox = null;  
    @property(cc.EditBox)  
    private yEditBox: cc.EditBox = null;  
    @property(cc.ScrollView)  
    private fishLinesRecord: cc.ScrollView = null;  
    @property(cc.Node)  
    private fishLinesRecordContent: cc.Node = null;  
    @property(cc.Node)  
    private selectFishPanel: cc.Node = null;  
    @property(cc.Node)  
    private childFishLinePanel: cc.Node = null;  
  
  
    @property(cc.Prefab)  
    private tableRowPrefab: cc.Prefab = null;  
    @property(cc.Prefab)  
    private tableCellPrefab: cc.Prefab = null;  
    @property(cc.Prefab)  
    private editableCellPrefab: cc.Prefab = null;  
    @property(cc.Prefab)  
    private pointPrefab: cc.Prefab = null;  
    @property(cc.Prefab)  
    private childFishLinePanelItemPrefab: cc.Prefab = null;  
    @property([cc.Prefab])  
    private fishPrefabs: cc.Prefab[] = [];  
  
  
    private fish1: cc.Node = null;  
    private fish2: cc.Node = null;  
    private fish1Tween: cc.Tween = null;  
    private fish2Tween: cc.Tween = null;  
  
    private editingPointArray: PointData[] = [];  
    private selectedPointArrayList: PointData[][] = [this.editingPointArray];  
    private allPointArrayList: PointData[][] = [this.editingPointArray];  
    private childFishLineMap: Map<PointData[], ChildFishLine[]> = new Map([[this.editingPointArray, []]]);  
    private selectedFishPrefab: cc.Prefab = null;  
  
    private clickPos: cc.Vec2;  
    private isMoving: boolean = false;  
    private selectedNode: cc.Node = null;  
    private destPos: cc.Vec2;  
    private lastClickTime: number = 0;  
  
    private addChildFishCB = () => undefined;  
  
    // start  
    async start() {  
        // 监听touch start事件  
        this.canvas.on(cc.Node.EventType.MOUSE_DOWN, (event: cc.Event.EventMouse) => {  
            switch (event.getButton()) {  
                case MouseBtn.Left:  
                    if (this.menu.node.getBoundingBoxToWorld().contains(event.getLocation())) {  
                        const addFishLineBtn = this.menu.node.getChildByName("addFishLineBtn");  
                        const showFishLinesRecordMenuBtn = this.menu.node.getChildByName("showFishLinesRecordMenuBtn");  
                        const showAllFishLinesBtn = this.menu.node.getChildByName("showAllFishLinesBtn");  
                        const clearFishLinesBtn = this.menu.node.getChildByName("clearFishLinesBtn");  
                        const exportFishLinesBtn = this.menu.node.getChildByName("exportFishLinesBtn");  
                        // 新增鱼线  
                        if (this.xEditBox.node.getBoundingBoxToWorld().contains(event.getLocation()) || this.yEditBox.node.getBoundingBoxToWorld().contains(event.getLocation())) { //  
                        } else if (addFishLineBtn.getBoundingBoxToWorld().contains(event.getLocation())) {  
                            if (this.editingPointArray.length !== 0) {  
                                this.addPointArray();  
                            }  
                            // 显示鱼线记录  
                        } else if (showFishLinesRecordMenuBtn.getBoundingBoxToWorld().contains(event.getLocation())) {  
                            this.fishLinesRecord.node.active = !this.fishLinesRecord.node.active;  
                            this.updateFishLinesRecord();  
                            // 显示所有鱼线  
                        } else if (showAllFishLinesBtn.getBoundingBoxToWorld().contains(event.getLocation())) {  
                            this.selectedPointArrayList = [...this.allPointArrayList];  
                            this.updateFishLinesRecord();  
                            // 清空鱼线  
                        } else if (clearFishLinesBtn.getBoundingBoxToWorld().contains(event.getLocation())) {  
                            this.clearFishLines();  
                            this.addPointArray();  
                        } else if (exportFishLinesBtn.getBoundingBoxToWorld().contains(event.getLocation())) {  
                            this.downLoadFile();  
                        } else {  
                            this.updateSelectPoint(this.menu.node);  
                        }  
                        event.stopPropagation();  
                        this.drawFishLines();  
                        return;  
                    }  
                    let selectedPointData: PointData = null;  
                    for (let i = this.editingPointArray.length - 1; i >= 0; i--) {  
                        const pointData = this.editingPointArray[i];  
                        if (pointData.point.getBoundingBoxToWorld().contains(event.getLocation())) {  
                            selectedPointData = pointData;  
                            break;  
                        }  
                    }  
                    const now = Date.now();  
                    if (selectedPointData && (now - this.lastClickTime) < 200) {  
                        this.editingPointArray.splice(this.editingPointArray.indexOf(selectedPointData), 1);  
                        this.updateSelectPoint(null);  
                        selectedPointData.point.removeFromParent();  
                        this.rename();  
                        this.drawFishLines();  
                        this.updateFishLinesRecord();  
                        event.stopPropagation();  
                        return;  
                    }  
                    this.clickPos = this.canvas.convertToNodeSpaceAR(event.getLocation());  
                    this.lastClickTime = now;  
                    this.updateSelectPoint(selectedPointData && selectedPointData.point);  
                    break;  
                case MouseBtn.Middle:  
  
                    break;  
  
                case MouseBtn.Right:  
                    this.selectFishPanel.removeAllChildren();  
                    this.selectFishPanel.active = true;  
                    this.fishPrefabs.forEach((prefab) => {  
                        const fish = cc.instantiate(prefab);  
                        this.selectFishPanel.addChild(fish);  
                        fish.on(cc.Node.EventType.MOUSE_DOWN, (event: cc.Event.EventMouse) => {  
                            event.stopPropagation();  
                            this.selectedFishPrefab = prefab;  
                            this.fish1.removeFromParent();  
                            this.fish1 = cc.instantiate(prefab);  
                            this.fish1.x = 3000;  
                            this.node.addChild(this.fish1);  
  
                            this.fish2.removeFromParent();  
                            this.fish2 = cc.instantiate(prefab);  
                            this.fish2.x = 3000;  
                            this.node.addChild(this.fish2);  
  
                            this.startSwimming();  
                            this.stopFish2Tween();  
                            this.selectFishPanel.active = false;  
                        });  
                    });  
                    break;  
            }  
  
        });  
        // 监听touch move事件  
        this.canvas.on(cc.Node.EventType.MOUSE_MOVE, (event: cc.Event.EventMouse) => {  
            switch (event.getButton()) {  
                case MouseBtn.Left:  
                    if (  
                        (this.xEditBox.node.getBoundingBoxToWorld().contains(event.getLocation()) ||  
                            this.yEditBox.node.getBoundingBoxToWorld().contains(event.getLocation())  
                        ) && this.selectedNode !== this.menu.node) {  
                        return;  
                    }  
                    this.isMoving = true;  
                    this.destPos = this.canvas.convertToNodeSpaceAR(event.getLocation());  
                    this.destPos = this.canvas.convertToNodeSpaceAR(event.getLocation());  
                    this.updateEditPosition();  
                    break;  
                case MouseBtn.Middle:  
  
                    break;  
  
                case MouseBtn.Right:  
  
                    break;  
            }  
  
        });  
        // 监听touch end事件  
        this.canvas.on(cc.Node.EventType.MOUSE_UP, async (event: cc.Event.EventMouse) => {  
            switch (event.getButton()) {  
                case MouseBtn.Left:  
                    const vec2 = this.canvas.convertToNodeSpaceAR(event.getLocation());  
                    if (this.clickPos && vec2.sub(this.clickPos).mag() < 20 && !this.selectedNode) {  
  
                        const point: cc.Node = cc.instantiate(this.pointPrefab);  
  
                        point.x = Math.round(vec2.x);  
                        point.y = Math.round(vec2.y);  
                        this.canvas.insertChild(point, 3 + this.editingPointArray.length);  
                        this.editingPointArray.push(new PointData(point));  
                        point.name = this.editingPointArray.length.toString();  
                        point.getChildByName("num").getComponent(cc.Label).string = point.name;  
                        this.updateSelectPoint(point);  
                        this.drawFishLines();  
                        this.updateFishLinesRecord();  
                    }  
                    this.isMoving = false;  
                    this.clickPos = null;  
                    this.destPos = null;  
                    break;  
                case MouseBtn.Middle:  
  
                    break;  
  
                case MouseBtn.Right:  
  
                    break;  
            }  
  
        });  
        // 监听方向键  
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (event: cc.Event.EventKeyboard) => {  
  
            if (!this.selectedNode) {  
                return;  
            }  
            const speed = 1;  
            switch (event.keyCode) {  
                case KeyCode.Left:  
                    this.selectedNode.x = Math.round(this.selectedNode.x - speed);  
                    break;  
                case KeyCode.Up:  
                    this.selectedNode.y = Math.round(this.selectedNode.y + speed);  
                    break;  
                case KeyCode.Right:  
                    this.selectedNode.x = Math.round(this.selectedNode.x + speed);  
                    break;  
                case KeyCode.Down:  
                    this.selectedNode.y = Math.round(this.selectedNode.y - speed);  
                    break;  
            }  
            this.drawFishLines();  
            this.updateEditPosition();  
        });  
        // 关闭监听  
        cc.find("Header/closeBtn", this.childFishLinePanel).on(cc.Node.EventType.MOUSE_DOWN, (event: cc.Event.EventMouse) => {  
            this.childFishLinePanel.active = false;  
            event.stopPropagation();  
        });  
        // 关闭监听  
        cc.find("Footer/addBtn", this.childFishLinePanel).on(cc.Node.EventType.MOUSE_DOWN, (event: cc.Event.EventMouse) => {  
            event.stopPropagation();  
            if (!this.childFishLinePanel.active) {  
                return;  
            }  
            if (!this.addChildFishCB) {  
                return;  
            }  
            this.addChildFishCB();  
        });  
        // 小龟开游  
        this.startSwimming();  
        // 画鱼线  
        this.drawFishLines();  
        // 初始化鱼  
        const fishIndex = CommonTools.getRandomArea(0, this.fishPrefabs.length - 1);  
        this.fish1 = cc.instantiate(this.fishPrefabs[fishIndex]);  
        this.fish2 = cc.instantiate(this.fishPrefabs[fishIndex]);  
        this.selectedFishPrefab = this.fishPrefabs[fishIndex];  
        this.fish1.x = 3000;  
        this.fish2.x = 3000;  
        this.node.addChild(this.fish1);  
        this.node.addChild(this.fish2);  
    }  
  
    // 小龟开游  
    private async startSwimming() {  
        if (this.fish1Tween) {  
            this.fish1Tween.stop();  
        }  
        this.fish1Tween = cc.tween(this.fish1);  
        if (this.editingPointArray.length < 3) {  
            await CommonTools.sleep(100);  
            this.startSwimming();  
            return;  
        }  
        this.singleFishSwim(this.fish1, this.fish1Tween, this.editingPointArray);  
  
        this.childFishLineMap.get(this.editingPointArray).forEach(childFishLine => {  
            if (childFishLine.fish) {  
                childFishLine.fish.removeFromParent();  
            }  
            childFishLine.fish = cc.instantiate(this.selectedFishPrefab);  
            this.node.addChild(childFishLine.fish);  
            const tween = cc.tween(childFishLine.fish);  
  
            this.singleFishSwim(childFishLine.fish, tween, this.editingPointArray.map(({ point, time }) => {  
                const node = new cc.Node();  
                node.x = point.x * (childFishLine.reverseX ? -1 : 1) + childFishLine.offsetX;  
                node.y = point.y * (childFishLine.reverseY ? -1 : 1) + childFishLine.offsetY;  
                return new PointData(node, time);  
            }));  
            tween.start();  
        });  
  
        this.fish1Tween  
            .call(() => {  
                this.fish1Tween = null;  
                this.startSwimming();  
            })  
            .start();  
    }  
  
    private singleFishSwim(fish: cc.Node, tween: cc.Tween, pointArray: PointData[]) {  
        fish.x = pointArray[0].point.x;  
        fish.y = pointArray[0].point.y;  
        const pointList = pointArray.map(({ point }) => [point.x, point.y]);  
        let lastAngle: number = null;  
        for (let i = 2; i < pointArray.length; i += 2) {  
            const [x1, y1] = pointList[i - 2];  
            const [cx, cy] = pointList[i - 1];  
            const [x2, y2] = pointList[i];  
            lastAngle = this.BezierCurveAni({  
                x1, y1, cx, x2, cy, y2,  
                lastAngle,  
                tween,  
                interval: pointArray[i - 1].time / 100  
            });  
        }  
    }  
  
    // 贝塞尔动画  
    private BezierCurveAni(data: { x1: number, y1: number, cx: number, x2: number, cy: number, y2: number, lastAngle: number, tween: cc.Tween, interval: number }) {  
        const { x1, y1, cx, x2, cy, y2, tween, interval } = data;  
        let lastAngle = data.lastAngle;  
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
                }  
                else {  
                    tan = -Infinity;  
                }  
            }  
            else {  
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
        return lastAngle;  
    }  
  
    // update  
    public update(dt: number) {  
        if (!this.isMoving || !this.selectedNode) {  
            return;  
        }  
        if (this.selectedNode.getBoundingBox().contains(this.destPos)) {  
            return;  
        }  
        const Spped = 500;  
        const sourcePos = this.selectedNode.getPosition();  
        const vertor = this.destPos.sub(sourcePos);  
        let newPos: cc.Vec2;  
        if (vertor.mag() > (Spped * dt)) {  
            const direction = vertor.normalize();  
            newPos = sourcePos.add(direction.mul(Spped * dt));  
        } else {  
            newPos = sourcePos.add(vertor);  
        }  
        newPos.x = Math.round(newPos.x);  
        newPos.y = Math.round(newPos.y);  
        this.selectedNode.setPosition(newPos);  
        this.drawFishLines();  
    }  
  
    private removeChildFish(pointArray) {  
        if (!pointArray) {  
            return;  
        }  
        this.childFishLineMap.get(pointArray).forEach(childfishline => {  
            // if (childfishline.tween) {  
            //     childfishline.tween.stop();  
            //     childfishline.tween = null;  
            // }  
            if (childfishline.fish) {  
                childfishline.fish.removeFromParent();  
                childfishline.fish = null;  
            }  
        });  
    }  
  
    // 添加鱼线数据点  
    private addPointArray() {  
        this.removeChildFish(this.editingPointArray);  
        this.selectedNode = null;  
        this.editingPointArray = [];  
        this.selectedPointArrayList.push(this.editingPointArray);  
        this.allPointArrayList.push(this.editingPointArray);  
        this.childFishLineMap.set(this.editingPointArray, []);  
  
        this.updateFishLinesRecord();  
    }  
  
    // 显示编辑子鱼线面板  
    private showChildFishLinePanel(pointArray) {  
        this.childFishLinePanel.active = true;  
        const content = cc.find("ScrollView/view/Content", this.childFishLinePanel);  
        content.removeAllChildren();  
        const childFishLineArray = this.childFishLineMap.get(pointArray);  
        childFishLineArray.forEach((childFishLine, index) => {  
            const item = cc.instantiate(this.childFishLinePanelItemPrefab);  
            content.addChild(item);  
            cc.find("ChildFishLineId/Label", item).getComponent(cc.Label).string = `子鱼线 ${index.toString().padStart(3, "0")}：`;  
            // ReverseX  
            const reverseX = cc.find("ReverseX/Toggle", item).getComponent(cc.Toggle);  
            reverseX.isChecked = childFishLine.reverseX;  
            reverseX.node.on("toggle", () => {  
                childFishLine.reverseX = reverseX.isChecked;  
                this.drawFishLines();  
            });  
            // ReverseX  
            const reverseY = cc.find("ReverseY/Toggle", item).getComponent(cc.Toggle);  
            reverseY.isChecked = childFishLine.reverseY;  
            reverseY.node.on("toggle", () => {  
                childFishLine.reverseY = reverseY.isChecked;  
                this.drawFishLines();  
            });  
            // OffsetX  
            const OffsetX = cc.find("OffsetX/EditBox", item).getComponent(cc.EditBox);  
            OffsetX.string = childFishLine.offsetX.toString();  
            OffsetX.node.on("text-changed", (data) => {  
                childFishLine.offsetX = Number(data.string);  
                this.drawFishLines();  
            });  
            // OffsetY  
            const OffsetY = cc.find("OffsetY/EditBox", item).getComponent(cc.EditBox);  
            OffsetY.string = childFishLine.offsetY.toString();  
            OffsetY.node.on("text-changed", (data) => {  
                childFishLine.offsetY = Number(data.string);  
                this.drawFishLines();  
            });  
        });  
  
        this.addChildFishCB = () => {  
            childFishLineArray.push(new ChildFishLine());  
            this.showChildFishLinePanel(pointArray);  
            this.startSwimming();  
            this.drawFishLines();  
        };  
    }  
  
    // 绘制  
    private drawFishLines() {  
        this.adjustPosition();  
        this.updateEditPosition();  
        const g = this.graphics;  
        g.clear();  
  
        const screenHalfWidth = 960;  
        const screenHalfHeight = 540;  
  
        const peaks = [  
            cc.v2(-screenHalfWidth, screenHalfHeight),  
            cc.v2(screenHalfWidth, screenHalfHeight),  
            cc.v2(screenHalfWidth, -screenHalfHeight),  
            cc.v2(-screenHalfWidth, -screenHalfHeight),  
            cc.v2(-screenHalfWidth, screenHalfHeight)  
        ];  
  
        g.strokeColor = ScreenBorderColor;  
        for (let i = 1; i <= peaks.length - 1; i++) {  
            const pointA = peaks[i - 1];  
            const pointB = peaks[i];  
  
            const vec2 = pointB.sub(pointA);  
            const distance = vec2.len();  
            const direction = vec2.normalize();  
  
            let startPoint = cc.v2(pointA.x, pointA.y);  
  
            const step = 10;  
            for (let len = step; len < distance; len += 2 * step) {  
                g.moveTo(startPoint.x, startPoint.y);  
                const dest = startPoint.add(direction.mul(step));  
                g.lineTo(dest.x, dest.y);  
                startPoint = dest.add(direction.mul(step));  
                g.stroke();  
            }  
        }  
  
        const drawSingleFishLine = (pointArray: PointData[], strokeColor: cc.Color) => {  
  
            g.strokeColor = strokeColor;  
  
            const pointList = pointArray.map(({ point }) => {  
                if (pointArray === this.editingPointArray) {  
                    if (this.selectedNode !== point) {  
                        point.color = Color.Normal;  
                    }  
                } else {  
                    if (this.selectedNode === point) {  
                        this.selectedNode = null;  
                    }  
                    point.color = Color.Gray;  
                }  
                point.active = true;  
                return [point.x, point.y];  
            });  
  
            if (pointArray.length < 3) {  
                return;  
            }  
  
            g.moveTo(...pointList[0]);  
  
            for (let i = 2; i < pointList.length; i += 2) {  
                const point2 = pointList[i - 1];  
                const point3 = pointList[i] || [];  
                g.quadraticCurveTo(...point2, ...point3);  
            }  
            g.stroke();  
        };  
  
        this.selectedPointArrayList.forEach((pointArray) => {  
            const pointArrayList = this.childFishLineMap.get(pointArray).map(childFishLine => {  
                return pointArray.map(({ point }) => {  
                    const node = new cc.Node();  
                    node.x = point.x * (childFishLine.reverseX ? -1 : 1) + childFishLine.offsetX;  
                    node.y = point.y * (childFishLine.reverseY ? -1 : 1) + childFishLine.offsetY;  
                    return new PointData(node);  
                });  
  
            });  
  
            const color = Colors[this.allPointArrayList.indexOf(pointArray) % Colors.length];  
            const childFishLineColor = color.clone();  
            childFishLineColor.a = 64;  
  
            pointArrayList.forEach((pointArray) => {  
                drawSingleFishLine(pointArray, childFishLineColor);  
            });  
            drawSingleFishLine(pointArray, color);  
        });  
    }  
  
    // 重命名  
    private rename() {  
        this.editingPointArray.forEach(({ point }, index) => {  
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
  
    // 调整位置  
    private adjustPosition() {  
        if (this.editingPointArray.length < 4) {  
            return;  
        }  
  
        for (let i = 3; i < this.editingPointArray.length; i += 2) {  
            const point1 = this.editingPointArray[i - 2].point;  
            const point2 = this.editingPointArray[i - 1].point;  
            const point3 = this.editingPointArray[i].point;  
            // const newPosition = this.getVerticalCrossPoint(point1.position, point2.position, point3.position);  
            // point3.x = newPosition.x;  
            // point3.y = newPosition.y;  
  
  
            const vec = point3.position.sub(point1.position);  
            const direction = vec.normalize();  
            const vec2 = point2.position.sub(point1.position);  
            const destVec = point1.position.add(direction.mul(vec2.len() < vec.len() ? vec2.len() : vec.len()));  
            point2.x = destVec.x;  
            point2.y = destVec.y;  
        }  
    }  
  
    // 设置选中的点  
    private updateSelectPoint(point: cc.Node) {  
  
        if (this.selectedNode && this.selectedNode !== point) {  
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
        this.drawFishLines();  
    }  
  
    // 清空鱼线  
    public clearFishLines() {  
        this.selectedPointArrayList.forEach(pointArray => {  
            pointArray.forEach(({ point }) => {  
                point.active = false;  
            });  
        });  
        this.selectedPointArrayList = [];  
    }  
  
    // 鱼线记录  
    public updateFishLinesRecord() {  
        if (!this.fishLinesRecord.node.active) {  
            return;  
        }  
        this.fishLinesRecordContent.children.forEach(child => {  
            child.destroy();  
        });  
        this.fishLinesRecordContent.removeAllChildren();  
        let maxLengthOfTableCell = 0;  
        this.allPointArrayList.forEach((pointArray, index) => {  
  
            if (pointArray.length + 2 > maxLengthOfTableCell) {  
                maxLengthOfTableCell = pointArray.length + 2;  
            }  
  
            const fishLineId = index.toString().padStart(6, "0");  
  
            const tableRow = cc.instantiate(this.tableRowPrefab);  
  
            tableRow.color = Colors[index % Colors.length];  
  
            const operateNode = tableRow.children[0];  
  
            // 设置checkbox状态  
            const toggle = operateNode.getChildByName("toggle").getComponent(cc.Toggle);  
            if (this.selectedPointArrayList.includes(pointArray)) {  
                toggle.isChecked = true;  
            } else {  
                toggle.isChecked = false;  
            }  
  
            const editBtn = operateNode.getChildByName("editBtn").getComponent(cc.Button);  
            const delBtn = operateNode.getChildByName("delBtn").getComponent(cc.Button);  
            const editChildFishLineBtn = operateNode.getChildByName("editChildFishLineBtn").getComponent(cc.Button);  
            // toggle监听  
            toggle.node.on("toggle", () => {  
                if (toggle.isChecked) {  
                    if (!this.selectedPointArrayList.includes(pointArray)) {  
                        this.selectedPointArrayList.push(pointArray);  
                    }  
                } else {  
                    if (this.selectedPointArrayList.length === 1) {  
                        toggle.isChecked = true;  
                        return;  
                    }  
                    this.selectedPointArrayList.splice(this.selectedPointArrayList.indexOf(pointArray), 1);  
                    pointArray.forEach(({ point }) => {  
                        point.active = false;  
                    });  
                    if (this.editingPointArray === pointArray) {  
                        this.removeChildFish(this.editingPointArray);  
                        this.editingPointArray = this.selectedPointArrayList[0];  
                        this.startSwimming();  
                        this.stopFish2Tween();  
                    }  
  
                }  
                this.drawFishLines();  
                this.updateFishLinesRecord();  
            });  
  
            // 编辑按钮监听  
            editBtn.node.on("click", () => {  
                if (!this.selectedPointArrayList.includes(pointArray)) {  
                    this.selectedPointArrayList.push(pointArray);  
                }  
                toggle.isChecked = true;  
                this.removeChildFish(this.editingPointArray);  
                this.editingPointArray = pointArray;  
                this.startSwimming();  
                this.stopFish2Tween();  
                this.drawFishLines();  
                this.updateFishLinesRecord();  
            });  
  
            // 删除按钮监听  
            delBtn.node.on("click", () => {  
                if (this.selectedPointArrayList.includes(pointArray)) {  
                    this.selectedPointArrayList.splice(this.selectedPointArrayList.indexOf(pointArray), 1);  
                }  
                if (this.allPointArrayList.includes(pointArray)) {  
                    this.allPointArrayList.splice(this.allPointArrayList.indexOf(pointArray), 1);  
                }  
                pointArray.forEach(({ point }) => {  
                    point.removeFromParent();  
                    point.destroy();  
                });  
                if (this.editingPointArray === pointArray) {  
                    if (this.selectedPointArrayList.length !== 0) {  
                        this.removeChildFish(this.editingPointArray);  
                        this.editingPointArray = this.selectedPointArrayList[0];  
                        this.startSwimming();  
                        this.stopFish2Tween();  
                    } else if (this.allPointArrayList.length !== 0) {  
                        this.removeChildFish(this.editingPointArray);  
                        this.editingPointArray = this.allPointArrayList[0];  
                        this.startSwimming();  
                        this.stopFish2Tween();  
                        this.selectedPointArrayList.push(this.editingPointArray);  
                    } else {  
                        this.addPointArray();  
                    }  
                }  
                this.drawFishLines();  
                this.updateFishLinesRecord();  
            });  
  
            // 编辑子鱼线  
            editChildFishLineBtn.node.on("click", () => {  
                if (!this.selectedPointArrayList.includes(pointArray)) {  
                    this.selectedPointArrayList.push(pointArray);  
                }  
                toggle.isChecked = true;  
                this.removeChildFish(this.editingPointArray);  
                this.editingPointArray = pointArray;  
                this.startSwimming();  
                this.stopFish2Tween();  
                this.drawFishLines();  
                this.updateFishLinesRecord();  
                // ===============  
                this.showChildFishLinePanel(pointArray);  
            });  
            const tableCell = cc.instantiate(this.tableCellPrefab);  
            tableCell.getChildByName("label").getComponent(cc.Label).string = fishLineId;  
            tableRow.addChild(tableCell);  
            if (this.editingPointArray === pointArray) {  
                tableCell.color = cc.Color.RED;  
  
            }  
  
            pointArray.forEach((pointdata, index) => {  
                const point = pointdata.point;  
                let tableCell = cc.instantiate(this.tableCellPrefab);  
                tableCell.getChildByName("label").getComponent(cc.Label).string = [Math.round(point.position.x), Math.round(point.position.y)].join(",");  
  
                if (this.editingPointArray === pointArray) {  
                    if (index % 2 === 1) {  
                        tableCell = cc.instantiate(this.editableCellPrefab);  
                        const editBox = tableCell.getChildByName("label").getComponent(cc.EditBox);  
                        editBox.string = pointdata.time.toString();  
                        editBox.node.on("text-changed", (data) => {  
                            if (index + 1 === pointArray.length) {  
                                return;  
                            }  
                            this.stopFish2Tween();  
                            this.fish2Tween = cc.tween(this.fish2);  
                            const point1 = pointArray[index - 1].point;  
                            const point2 = pointArray[index].point;  
                            const point3 = pointArray[index + 1].point;  
  
                            const [x1, y1] = [point1.x, point1.y];  
                            const [cx, cy] = [point2.x, point2.y];  
                            const [x2, y2] = [point3.x, point3.y];  
  
                            this.fish2.x = point1.x;  
                            this.fish2.y = point1.y;  
  
                            this.BezierCurveAni({  
                                x1, y1, cx, x2, cy, y2,  
                                lastAngle: null,  
                                tween: this.fish2Tween,  
                                interval: Number(data.string) / 100  
                            });  
                            this.fish2Tween.repeat(10, this.fish2Tween);  
                            this.fish2Tween.call(() => {  
                                this.fish2.x = 3000;  
                                this.fish2Tween = null;  
                            });  
                            this.fish2Tween.start();  
  
                            pointArray[index].time = Number(data.string);  
                        });  
                    }  
                }  
                tableRow.addChild(tableCell);  
            });  
  
            this.fishLinesRecordContent.addChild(tableRow);  
  
            const height = this.fishLinesRecordContent.children.length * 40;  
            this.fishLinesRecordContent.parent.parent.height = height > 280 ? 280 : height;  
        });  
  
        // 补齐tableCell  
        this.fishLinesRecordContent.children.forEach((tableRow, index) => {  
            if (tableRow.children.length < maxLengthOfTableCell) {  
                for (let i = tableRow.children.length; i < maxLengthOfTableCell; i++) {  
                    const tableCell = cc.instantiate(this.tableCellPrefab);  
                    tableCell.getChildByName("label").getComponent(cc.Label).string = "";  
                    tableRow.addChild(tableCell);  
                }  
            }  
        });  
  
        // 修正tableCell宽度  
        this.scheduleOnce(() => {  
            let maxWidthListOfTableCell = [];  
            this.fishLinesRecordContent.children.forEach(tableRow => {  
                if (maxWidthListOfTableCell.length === 0) {  
                    maxWidthListOfTableCell = Array.from({ length: tableRow.children.length }).map(() => 0);  
                }  
                tableRow.children.forEach((tableCell, index) => {  
                    if (tableCell.width > maxWidthListOfTableCell[index]) {  
                        maxWidthListOfTableCell[index] = tableCell.width;  
                    }  
                });  
            });  
            let totalWidth = 0;  
            this.fishLinesRecordContent.children.forEach(tableRow => {  
                totalWidth = 0;  
                tableRow.children.forEach((tableCell, index) => {  
                    tableCell.width = maxWidthListOfTableCell[index];  
                    totalWidth += tableCell.width;  
                });  
  
                tableRow.width = totalWidth;  
            });  
            this.fishLinesRecordContent.width = totalWidth;  
        });  
    }  
  
    // 停止动画  
    public stopFish2Tween() {  
        if (this.fish2Tween) {  
            this.fish2Tween.stop();  
            this.fish2.x = 3000;  
            this.fish2Tween = null;  
        }  
    }  
  
    public downLoadFile() {  
  
        const fileName = "fishLines.csv";  
        let maxLength = 0;  
        const result = this.allPointArrayList.map((pointArray, index) => {  
  
            const formatPoint = (pointArray: PointData[]) => {  
                const result = pointArray.map(({ point, time }, index) => {  
                    const data = [Math.round(point.x), Math.round(point.y)];  
                    if ((index + 1) % 2 === 0) {  
                        data.push(time);  
                    }  
                    return data;  
                });  
                if (result.length % 2 === 0) {  
                    result.pop();  
                }  
                return `"${JSON.stringify(result)}"`;  
            };  
  
            const result = formatPoint(pointArray);  
  
            if (maxLength < result.length) {  
                maxLength = result.length;  
            }  
  
            const data = [`"鱼线ID${(index + 1).toString().padStart(3, "0")}"`, result].join(",");  
  
            const childFishLines = this.childFishLineMap.get(pointArray).map(childFishLine => {  
                return pointArray.map(({ point, time }) => {  
                    const node = new cc.Node();  
                    node.x = point.x * (childFishLine.reverseX ? -1 : 1) + childFishLine.offsetX;  
                    node.y = point.y * (childFishLine.reverseY ? -1 : 1) + childFishLine.offsetY;  
                    return new PointData(node, time);  
                });  
            }).map((pointArray, index) => {  
                const result = formatPoint(pointArray);  
                return [`"  子鱼线${(index + 1).toString().padStart(3, "0")}"`, result].join(",");  
            });  
  
            return [data, ...childFishLines].join("\n");  
        });  
  
        const content = result.join("\n");  
        const aLink = document.createElement("a");  
        const blob = new Blob([`\ufeff${content}`], {  
            type: `text/csv;charset=UTF-8`  
        });  
        aLink.download = fileName;  
        aLink.href = URL.createObjectURL(blob);  
        aLink.click();  
        URL.revokeObjectURL(aLink.href);  
    }  
}  
  
  
```  
  
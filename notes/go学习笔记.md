###  
```  
//go:noinline   
//go:nosplit  
//go:noescape  
//go:norace  
go run -race main.go 利用 -race 来使编译器报告数据竞争问题  
```  
### gopls 安装  
```bash  
git clone https://github.com/golang/tools  
cd tools/gopls  
go install  
```  
### GOPATH  
```  
GOPATH目录下约定有三个子目录（GOPATH本省也可以有多个目录，但go get获取的包存放再第一个目录）  
1、src存放源代码  
2、pkg编译时生成的中间文件  
3、bin编译后生成的可执行文件  
```  
  
### Go命令  
```  
1、go install  
   1) 如果是可执行文件,编译后存放在bin目录  
   2) 如果是普通包，编译成.a文件存放在pkg目录  
2、go get  // 拉取依赖，会进行指定性拉取（更新），并不会更新所依赖的其它模块。  
   1) 先从远程下载  
   2) 执行go install  
 		-u // 更新现有的依赖，会强制更新它所依赖的其它全部模块，不包括自身。  
 		-u -t ./... //更新所有直接依赖和间接依赖的模块版本，包括单元测试中用到的。  
3、go run  
   1) 编译  
   2）运行然后删除编译后的文件  
```  
### go惯例  
```  
1、普通包包名需与该包路径最后一个文件夹名字相同  
2、普通包需要对外暴露的函数使用大写字母开头（相当于public）  
```  
### 函数返回时先执行返回值赋值，然后调用defer表达式，最后执行return  
```  
func f() (result int) {  
  defer func() {   // result = 0  
   result++     // result++  
  }()          // return 1  
  return 0  
}  
  
func f() (r int) {  
  t := 5           // r = t = 5  
  defer func() {      // t = t + 5 = 10  
    t = t + 5       // return 5  
  }()  
  return t  
}  
  
func f() (r int) {  
  defer func(r int) {  // r = 1  
    r = r + 5      // internal r = 6  
  }(r)                 // return 1  
  return 1  
}  
总结：  
1、当一个函数有指定函数返回值得变量名时，如果有对该变量重新赋值则return该变量的值  
否则返回return的值（此时return充当一个默认值的作用）  
2、defer函数会晚于后面的语句但先与return被执行(常用于关闭文件等操作，且是先进后出)  
3、defer函数能够修改已命名的返回值  
```  
### Go的 for 循环中，该循环变量在每次迭代时会被重用  
### 创建对象  
```  
表达式 new(File) 和 &File{} 是等价的（返回的是指针）  
make 只用于创建切片、Map、信道（返回的是相应的变量）  
make 只适用于映射、切片和信道且不返回指针。若要获得明确的指针， 请使用 new 分配内存  
var p *[]int = new([]int)  
*p = make([]int, 100, 100)  
```  
  
### 函数调用  
```  
1、  
结构体作为函数参数：值传递  
数组作为函数参数：值传递  
切片作为函数参数：引用传递  
2、  
func (a AAA) Print()  {  
	fmt.Println(a)  
}  
(&AAA{}).Print() 或者 (AAA{}).Print() 都可以  
但是：  
	var a interface{} = &AAA{}  
    a.(*AAA).Print()   
    a.(AAA).Print()# 报错point类型不能转换成struct类型  
3、  
func (a *AAA) Print()  {  
	fmt.Println(a)  
}  
(&AAA{}).Print()   
(AAA{}).Print() #报错  
```  
  
### 初始化  
```  
每个源文件都可以通过定义自己的无参数 init 函数来设置一些必要的状态  
```  
  
### 类型判断  
```  
	var value interface{}  
	value = "hahahahah"  
	switch str := value.(type) {  
	case string:  
		fmt.Println("string: ", str)  
	case int:  
		fmt.Println("int: ", str)  
	}  
```  
### 类型断言  
```  
str, ok := value.(string)  
if ok {  
	fmt.Printf("字符串值为 %q\n", str)  
} else {  
	fmt.Printf("该值非字符串\n")  
}  
  
```   
  
### 反射  
```  
reflect.ValueOf(a).Type() 相当于 reflect.Typeof(a)  
  
type user struct {  
	id   int  
	name string  
}  
func (u user) Speak(s string) {  
	fmt.Printf("I wanna say %s\n", s)  
}  
  
u := user{id: 1001, name: "xxx"}  
// 类型判断  
fmt.Sprint(reflect.TypeOf(u)) // user  
reflect.TypeOf(u).String() // user  
fmt.Printf("%T", map[string]string{"aa": "123"}) // map[string]string  
  
// 基础类型判断  
fmt.Sprint(reflect.TypeOf(u).Kind())  // struct  
fmt.Sprint(reflect.TypeOf(map[string]string{"aa": "123"}).Kind()) // map  
  
// 根据key获取value  
v := reflect.ValueOf(u)  
v.FieldByName("name").String() // v.FieldByName("id").Int()  
  
// 函数调用  
params := []reflect.Value{reflect.ValueOf("嘿嘿嘿")}  
v.MethodByName("Speak").Call(params)  
```  
### 遍历  
```  
// struct  
type user struct {  
    id   int  
    name string  
}  
u := user{id: 1001, name: "xxx"}  
v := reflect.ValueOf(u)  
for i := 0; i < v.NumField(); i++ {  
	// v.Type() == reflect.TypeOf(u)  
	fmt.Printf("%s: %v \n", v.Type().Field(i).Name, v.Field(i))  
}  
  
// map  
m := make(map[string]string)  
m["h"] = "hello"  
m["w"] = "world"  
for key, value := range m {  
	fmt.Printf("%v==>%v\n", key, value)  
}  
  
// slice  
slice := []string{"hello", "world", "hello", "everyone!"}  
for index, value := range slice {  
	fmt.Printf("slice %d is :%s\n", index, value)  
}  
```  
  
### Struct Json 之间的装换  
  
```  
type Person struct {  
	Name string `json:"name"`  
	age  int  
}  
  
func jsonStrToStruct() {  
	jsonStr := `  
    {  
        "NaMe":"MyName",  
        "age":12  
    }  
	`  
	// 只能导入Struct中之母为大写的字段，即age为默认值。jsonStr中的NaMe与Person中的Name不一样，但也可以导入。说明导入时不区分大小写  
	var person Person  
	json.Unmarshal([]byte(jsonStr), &person)  
	fmt.Println(person)  
}  
  
func structToJSON() {  
	p := Person{  
		Name: "MyName",  
		age:  29,  
	}  
	// 只能导出Person中手写字母为大写的字段，若要将导出的字段重命名需要加标签（`json:"name:`）  
	jsonBytes, _ := json.Marshal(p)  
	fmt.Printf("转换为 json 串打印结果:%s", string(jsonBytes))  
}  
  
func jsonStrToStruct() {  
	jsonStr := `  
    {  
        "naMe": "NaMe",  
        "name": "Name"  
    }  
	`  
	// 只能导入Struct中之母为大写的字段，即age为默认值。jsonStr中的NaMe与Person中的Name不一样，但也可以导入。说明导入时不区分大小写  
	// 但是如果导入时的json字符串中两个字段名全部改成小写后一样，则区分大小写  
	var person Person  
	json.Unmarshal([]byte(jsonStr), &person)  
	fmt.Println("Name: ", person.Name, " NaMe: ", person.NaMe)  
}  
```  
  
### select  
```  
1、select 可以同时监听多个 channel 的写入或读取  
2、执行 select 时，若只有一个 case 通过(不阻塞)，则执行这个 case 块  
3、若有多个 case 通过，则随机挑选一个 case 执行  
4、若所有 case 均阻塞，且定义了 default 模块，则执行 default 模块。若未定义 default 模块，则 select 语句阻塞，直到有 case 被唤醒。  
5、使用 break 会跳出 select 块。  
  
# 设置超时时间  
timeout := time.After(5 * time.Second)  
select {  
    case <- ch:  
        fmt.Println("task finished.")  
    case <- timeout:  
        fmt.Println("task timeout.")  
}  
```  
  
### channel  
```bash  
# 创建  
ch := make(chan int)  
# 写  
ch <- x  
# 读  
x <- ch # x = <- ch  
# 关闭  
close(ch)  
1、关闭一个未初始化(nil) 的 channel 会产生 panic  
2、重复关闭同一个 channel 会产生 panic  
3、向一个已关闭的 channel 中发送消息会产生 panic  
4、从已关闭的 channel 读取消息不会产生 panic，且能读出 channel 中还未被读取的消息，若消息均已读出，则会读到类型的零值。从一个已关闭的 channel 中读取消息永远不会阻塞，并且会返回一个为 false 的 ok-idiom，可以用它来判断 channel 是否关闭  
5、关闭 channel 会产生一个广播机制，所有向 channel 读取消息的 goroutine 都会收到消息  
# 无缓存的 channel  
1、从无缓存的 channel 中读取消息会阻塞，直到有 goroutine 向该 channel 中发送消息  
2、向无缓存的 channel 中发送消息也会阻塞，直到有 goroutine 从 channel 中读取消息  
# 永远不要尝试在读端关闭 channel  
# 永远只允许一个 goroutine执行关闭操作或者sync.Once  
# 遍历  
for x := range ch{  
    fmt.Println(x)  
}  
for {  
    x, ok := <- ch  
    if !ok {  
        break  
    }  
    fmt.Println(x)  
}  
# 单向 channel  
chan<- int 表示一个只可写入的 channel  
<-chan int 表示一个只可读取的 channel  
主要是限制channel被滥用。  
```  
  
## vender  
```  
1、当前包下的 vendor ⽬目录  
2、向上级⽬目录查找，直到找到 src 下的 vendor ⽬目录  
3、在 GOPATH 下⾯面查找依赖包  
4、在 GOROOT ⽬目录下查找  
```  
  
## go module 依赖管理  
```  
go mod init [moduleName] # 初始化module配置  
go get [moduleName]@[moduleVersion] # 下载依赖包，并更新go.mod配置文件  
```  
  
## for  
```  
for i := 0; i < 10; i++ {} # 不需要（）  
for i < 10 {} # 相当于其他语言的for  
for {} # 死循环  
```  
## switch  
```  
# 不需要break，匹配后自动终止匹配其他选项。fallthrough可以跳过匹配直接进入下个case  
switch os := runtime.GOOS; os {  
	case "darwin","windows":  
		fmt.Println("OS X.")  
		fmt.Println("Windows.")  
        fallthrough // 进入linux case  
    case "linux":  
		fmt.Println("Linux.")  
	default:  
		// freebsd, openbsd,  
		// plan9, windows...  
		fmt.Printf("%s.", os)  
	}  
# 没有条件的 switch 同 `switch true` 一样。可以用来代替if-else  
	t := time.Now()  
	switch {  
	case t.Hour() < 12:  
		fmt.Println("Good morning!")  
	case t.Hour() < 17:  
		fmt.Println("Good afternoon.")  
	default:  
		fmt.Println("Good evening.")  
	}  
```  
## 占位符  
```  
%v #相应值的默认格式  
%+v #打印结构体时，会添加字段名  
%#v #类型+默认格式+结构体字段名  
```  
## 随机数  
```  
rand.Seed(int64(time.Now().Nanosecond()))  
rand.Float32()  
```  
  
## 数组与切片  
```  
aar1:=[5]int{1,2,3} # len(aar1) == cap(aar1) == 5 作为函数参数时，值传递  
aar2:=[...]int{1,2,3} # len(aar1) == cap(aar1) == 3 作为函数参数时，值传递  
slice:=[]int{1,2,3} # len(aar1) == cap(aar1) == 3 作为函数参数时，引用传递  
  
数组与数组可以使用 == 比较，不能与 nil 比较  
切片与切片不能使用 == 比较，可以使用 reflect.DeepEqual 比较，可以与 nil 比较  
切片是数组的引用，数组是切片的底层实现。  
数组声明的时候默认就会初始化，值为类型的「零值」；切片声明的时候，如果不初始化，值是 nil。  
使用 copy() 深复制解决引用问题  
```  
## 测试  
```  
1、go test -v -conver  // -v 显示详情 -cover 显示覆盖率，自动执行格式如下的测试函数  
2、func TestXxx(*testing.T) // 格式为此种格式的测试函数将会被自动执行  
3、测试文件必须以_test.go结尾、有如上的测试函数、需要和被测试文件在同一个package下  
4、go test -bench  // 运行基准测试，函数格式如下。测准测试是顺序执行的 The benchmark function must run the target code b.N times. During benchmark execution, b.N is adjusted until the benchmark function lasts long enough to be timed reliably, If a benchmark needs some expensive setup before running, the timer may be reset: b.ResetTimer()  
5、func BenchmarkXxx(*testing.B) // Benchmark  
6、go help testflag 查看go test 命令参数  
7、func TestMain(m *testing.M) // 测试main函数  
  
go test -run ''      # Run all tests.  
go test -run Foo     # Run top-level tests matching "Foo", such as "TestFooBar".  
go test -run Foo/A=  # For top-level tests matching "Foo", run subtests matching "A=".  
go test -run /A=1    # For all top-level tests, run subtests matching "A=1".  
  
```  
## Bug  
  
```  
1、在 go 1.13 及以下版本，死循环/密集计算会导致调度问题；  
2、特别是遇到 gc 的情况，可能会锁死进程；  
3、在Linux下可以用perf top可以用来做 profiling；  
```  
```  
1、reflect: call of reflect.Value.Int on zero Value // isValid()  
2、cannot convert nil (untyped nil value) to reflect.Value // 转成指针  
3、reflect: call of reflect.Value.FieldByName on ptr Value //   
	if v.Kind() == reflect.Ptr {  
		v = v.Elem()  
	}  
    或者：  
    reflect.ValueOf(*var)  
```  
### unsafe.Pointer  
```  
出于安全考虑，Go 语言并不支持直接操作内存，但它的标准库中又提供一种不安全（不保证向后兼容性） 的指针类型unsafe.Pointer，让程序可以灵活的操作内存。  
  
unsafe.Pointer的特别之处在于，它可以绕过 Go 语言类型系统的检查，与任意的指针类型互相转换。也就是说，如果两种类型具有相同的内存结构（layout），我们可以将unsafe.Pointer当做桥梁，让这两种类型的指针相互转换，从而实现同一份内存拥有两种不同的解读方式。  
  
比如说，[]byte和string其实内部的存储结构都是一样的，但 Go 语言的类型系统禁止他俩互换。如果借助unsafe.Pointer，我们就可以实现在零拷贝的情况下，将[]byte数组直接转换成string类型。  
```  
## 其他  
```  
runtime.NumGoroutine() // 查看goroutine数量  
```  
  
## 交叉编译  
```  
CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build main.go  
```  
### build标签区分  
```  
#空格隔开的选项是或（OR）的关系  
#逗号隔开的选项是与（AND）的关系  
#每个选项由字母和数字组成。如果前面加上!，则表示反义  
// 在所有类unix平台编译  
// +build darwin dragonfly freebsd linux netbsd openbsd  
  
// 在非Windows平台编译  
// +build !windows  
```  
### 文件名区分  
```  
如果文件名包含_$GOOS.go后缀，那么这个源码文件只会在对应的平台被编译。其他平台会忽略这个文件。另一种约定是_$GOARCH.go。这两种后缀可以组合起来，但要保证顺序，正确的格式是_$GOOS_$GOARCH.go，错误的格式是_$GOARCH_$GOOS.go  
```  
### go mod  
```  
运行 go get -u 将会升级到最新的次要版本或者修订版本(x.y.z, z是修订版本号， y是次要版本号)  
运行 go get -u=patch 将会升级到最新的修订版本  
运行 go get package@version 将会升级到指定的版本号version  
  
modules 可以通过在 go.mod 文件中使用 replace 指令替换成github上对应的库，比如：  
replace golang.org/x/crypto v0.0.0-20190313024323-a1f597ede03a => github.com/golang/crypto v0.0.0-20190313024323-a1f597ede03a  
  
```  
  
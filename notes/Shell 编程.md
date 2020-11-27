=为赋值时，两边不要有空格  
单引号原样输出、双引号转义后输出、反引号执行后输出、$() 可替代 `` 都可在内部执行命令  
###默认变量  
	$0	当前脚本名称  
	$1	脚本接收的第一个参数  
	$2	脚本接收的第二个参数  
	$#	脚本接收的所有参数个数  
	$@	脚本接收的所有参数  
	$*	脚本接收的所有参数  
	$?	前一行命令的执行状态  
      
###关系运算符 在[...]内时  
	```  
    #数字运算符[]  
    -eq	-ne	-gt	-lt	-ge	-le  
    #布尔运算符[]  
    ！ -o  -a  
    #逻辑运算符[[]]  if [ $a -eq $b ] || [ $a gt $b ]   
    &&  ||  
    #字符串运算符[]  
    =  !=  -z（长度为零为true）  -n（长度不为零为true）  
    if [ $1 ]（$1有值）  
    if [ ! $1 ] （$1为空）  
   ```  
### 关系运算符在 ((...))内时  
	数字运算符  
    >  <  ==  >=  <=  !=  
### 变量赋值到变量  
	普通变量 source="abcd"; dest=$source  
    数组变量 source=("a b" c d e); dest=("${source[*]}") *不可用@代替且双引号不可去掉。否则数组长度变为5个  
    如果数组变量使用 arr1=$arr2 则只替换第一个字符  
### 数组操作  
	```  
   #定义  
    1、names=(a b 'c d')  
    2、names[0]=a  
      names[1]=b  
      names[2]='c d'  
    3、str="a b 'c d'"  
      names=($str)#长度为4，等于(a b \'c d\')  
   #长度  
    1、${#arr[@]} 获取数组长度  
    2、${#arr[*]} 获取数组长度  
    3、${#arr[n]} 获取第n个元素的长度  
   #遍历  
    1、for ((i=0;i<${#names[@]};i++)) do   
    2、for i in ${names[@]} do  
   #新增  
    1、names[3]=e  
    2、names=(${names[@]} e)#当names中的item中包含特殊字符时，可能会出问题  
   #数组切片  
    1、${names[0]} #第一个item  
    2、${names[@]} #所有  
    3、${names[@]:1} #下标1到最后一个  
    4、${names[@]:1:1} #从下标1开始获取一个  
    5、${names[@]:(-2):1} #倒数第二个  
    6、${names[@]:(-2)} #倒数两个  
    7、names=(${names[@]:(-2)})得到新切片  
   #删除  
    unset names[0] # 也可以用于删除变量  
   ```  
  
### 运算  
```  
a=$[3*4]                               # *号两边空格可有可无'  
a=$((3*4))                             # $(()) 相当于$[]  
b=`expr 3 \* 4`                          # \*号两边必须有空格  
c=$(expr 3 \* 4)                         # $() 相当于 ``  
let d=5*5                              # 变量前可不加$符号,运算符之间不能有空格  
echo "let d=5*5 d="$d  
  
```  
### if  
```  
if ((a==$b))                           # 变量前可不加$符号,运算符之间不能有空格,且等于是两个等号。其实都是((...))特性  
then  
        echo "a=b a=$a b=$b"  
elif [ $a -gt $b ]                       # [ ]内必须有空格  
then  
        echo "a>b a=$a b=$b"  
elif test $a -lt $b  
then  
        echo "a<b a=$a b=$b"  
else  
        echo "Invalid."  
fi  
```  
### while  
```  
b=1  
while((a!=b))  
do  
        echo "$b in while"  
        let 'b++'  
done  
```  
### for  
```  
for ((i=0;i<a;i++))  
do  
        echo "$i in for"  
done  
```  
  
### case  
  
```  
case $a in  
        1)  
        echo "a=1"  
        ;;  
        $i)  
        echo "case: a=i"  
        ;;  
        *)  
        echo "default"  
        ;;  
esac  
```  
### 查看文件是否存在  
[ -f test.sh ] && echo "found" || echo "not found"  
  
### 查看文件缓存  
```  
if [ ! -f pcstat ]  
then  
    if [ $(uname -m) == "x86_64" ] ; then  
        curl -L -o pcstat https://github.com/tobert/pcstat/raw/2014-05-02-01/pcstat.x86_64  
    else  
        curl -L -o pcstat https://github.com/tobert/pcstat/raw/2014-05-02-01/pcstat.x86_32  
    fi  
    chmod 755 pcstat  
fi  
  
ps -e -o pid,rss | sort -nk2 -r | head -30 | awk '{print $1}' > /tmp/cache.pids  
  
if [ -f /tmp/cache.files ]  
then  
    echo "the cache.files is exist, removing now "  
    rm -f /tmp/cache.files  
fi  
while read line  
do  
    lsof -p $line 2> /dev/null | awk '{print $9}' | grep / | grep -v /dev/null >> /tmp/cache.files  
done</tmp/cache.pids  
  
sort /tmp/cache.files | uniq >> /tmp/cache1.files  
mv /tmp/cache1.files /tmp/cache.files  
  
if [ -f /tmp/cache.pcstat ]  
then  
    echo "the cache.pcstat is exist, removing now"  
    rm -f /tmp/cache.pcstat  
fi  
for i in `cat /tmp/cache.files`  
do  
    if [ -f $i ]  
    then  
        if [ `ls -l $i | awk '{print $5}'` != "0" ]  
        then  
            echo $i >>/tmp/cache.pcstat  
        fi  
    fi  
done  
  
if [ ! -f /tmp/cache.pcstat ]  
then  
    echo "the cache.pcstat is empty"  
    exit  
fi  
`pwd`/pcstat  `cat /tmp/cache.pcstat`  
  
rm -f /tmp/cache.{pids,files,pcstat}  
```  
      
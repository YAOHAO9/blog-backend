## 常用命令:  
  
**ls 显示文件夹下面文件**  
&#8195; -l 详情  
&#8195; -a all  
**mkdir 创建目录**  
&#8195; -p 递归创建  
**cd**  
&#8195; 切换目录  
**touch**  
&#8195; 创建新文件  
**cat 查看文件**  
&#8195; -b 显示行号空白略过  
&#8195; -n 显示行号空白算一行  
**cp src dest 拷贝**  
&#8195; -p 复制属性  
&#8195; -d 复制软链接  
&#8195; -r 递归  
&#8195; -f 强制  
&#8195; -s 创建软链接  
&#8195; -a -pdr  
**mv src dest 移动或者重命名**  
&#8195; -u 更新  
**rm 删除文件**  
&#8195; -r 递归删除目录及文件  
&#8195; -f 强制删除  
&#8195; -i 询问  
**grep 查找字符串**  
&#8195; -v 排除不要查找的字符  
&#8195; -E 正则  
**pwd 显示当前文件**  
&#8195; -P 显示真实路径  
**ln 创建链接（不能为文件夹创建硬链接）**  
&#8195; -s 创建软链接  
**less 分页显示文本文件内容**  
&#8195; 空格 翻页  
&#8195; enter 翻一行  
&#8195; b 向上翻页  
&#8195; :f 列出文件名及当前所在行数  
&#8195; / 进入搜索模式  
&#8195; &#8195;n 下一个匹配项  
&#8195; &#8195;N 上一个匹配项  
&#8195; q 退出  
&#8195; -N 显示行号  
**head**  
&#8195; 显示头内容  
**tail 显示尾内容**  
&#8195; -f 一秒刷新一次  
&#8195; -s 修改刷新间隔  
&#8195;&#8195;eg. tail -f -s 3 src  
**tar**  
&#8195; -c 归档（不压缩）  
&#8195; -z gzip格式压缩  
&#8195; -j bzip2格式压缩  
&#8195; -x Extract 并不能解压rar或者zip的压缩文件，若要解压可以下载unzip或者unrar  
&#8195; -t list  
&#8195; -r 追加  
&#8195; -u update  
&#8195; -v 显示压缩过程  
&#8195; &#8195;-f 后接压缩后的文件名（一定是最后一个）  
&#8195; --exclude dir  排除不需要压缩的文件 注意不要加斜杠如：dir/   
**df 显示文件系统的磁盘占用情况**  
&#8195; -T 显示系统文件  
&#8195; -h 以易读方式显示  
&#8195; -a All  
**du 显示当前目录下的磁盘占用情况**  
&#8195; -h 以易读的方式显示  
&#8195; -d 设置遍历深度  
&#8195; -s 目录所占的总空间(默认是列出所有文件及所占空间)  
**ln 创建链接**  
&#8195; -s 创建软链接（不能为文件夹创建硬链接）  
  
## 系统命令:  
**stat**  
&#8195; 显示指定文件的详细信息，比ls更详细  
**who**  
&#8195; 显示在线登入用户  
**whoami**  
&#8195; 显示当前操作用户  
**hostname**  
&#8195; 显示主机名  
**uname**  
&#8195; 显示系统名  
**top**  
&#8195; 动态显示当前耗费资源最多的进程  
**ifconfig**  
&#8195; 查看网络情况  
**ps**  
&#8195; 显示瞬间进程状态 ps -aux  
**ping**  
测试网络联通  
**netstat**  
&#8195; 显示网络状态  
**man**  
&#8195; 查看命令使用  
**clear**  
&#8195; 清屏  
**alias**  
&#8195; 对命令重命名 如：alias showmeit="ps -aux"，解除：unalias showmeit  
**kill**  
&#8195; 杀死进程  
  
## 快捷键:  
**ctrl**  
&#8195; +r 查找使用过的命令  
&#8195; +c 退出当前执行的命令  
&#8195; +\ 强制退出当前执行的命令  
&#8195; +a 跳到行头  
&#8195; +e 跳到行尾  
&#8195; +u 删除光标左侧内容  
&#8195; +k 删除光标右侧内容  
  
## Vim编辑器:  
**=**  
&#8195; 自动格式化  
**~**  
&#8195; 将当前光标所在字母的大小写进行切换  
**guu**  
&#8195; 当前行的字母全部转换为小写  
**gUU**  
&#8195; 当前行的字母全部转换为大写  
**^**  
&#8195; 跳转到本行第一个字母  
**0**  
&#8195; 跳转到行首  
**$**  
&#8195; 跳转到行末  
**:set nu**  
&#8195; 显示行号  
**:set nu! 或者 :set nonu**  
&#8195; 不显示行号  
**ZZ**  
&#8195; :wq  
**u**  
&#8195; 撤销  
**ctrl + r**  
&#8195; 前进  
**/word**  
&#8195; 查找  
**:s/oldword/newword/g**  
&#8195; 替换光标所在行的所有匹配的字符串  
**:%s/oldword/newword/g**  
&#8195; 替换所有  
**:n,ms/oldword/newword/g**  
&#8195; 替换第n行到第m行所有匹配的字符  
**:w**  
&#8195; filename 另存为  
**gg**  
&#8195; 跳转到第1行  
**dd**  
&#8195; 删除当前行并保留到剪切板  
  
**yy**  
&#8195; 复制当前行到剪切板  
**p**  
&#8195; 粘贴 （往光标后）  
**P**  
&#8195; 粘贴 （往光标前）  
**v**  
&#8195; 进入可视模式（可选中）  
**A**  
&#8195; 当前行末尾添加  
**o**  
&#8195;  打开新的一行并进入插入模式  
**hjkl**  
&#8195;  移动光标  
**num**  
&#8195; +gg 跳转到第num行  
&#8195; +dd 删除num行  
&#8195; +yy 复制num行  
**:!command**  
&#8195; 执行外部命令  
**:f/ctrl+g**  
&#8195; 显示当前文件信息  
**:sp** 1、冒号：打开新文件，2、空格：打开当前文件 3、文件名：打开改文件  
&#8195; 分屏   
**:vsp**  
&#8195; 垂直分屏   
**ctrl + w**  
&#8195; 切换分屏   
**跳转**  
&#8195; % 跳转到相配对的括号  
&#8195; gD 跳转到定义  
&#8195; { 跳转到上一段的开头  
&#8195; } 跳转到下一段的开头  
&#8195; `[[` 跳转到上个函数 ps：{必须独占一行  
&#8195; `]]` 跳转到下个函数 ps：{必须独占一行  
&#8195; ^ 跳转到本行第一个字母  
&#8195; 0 跳转到行首  
&#8195; $ 跳转到行末  
  
## 包管理  
**ubuntu：dpkg**  
&#8195; -l 查看所有已安装的软件包  
&#8195; -L pkgName 查看已安装软件包的详细安装文件  
  
**centos：rpm**  
&#8195; -qa 查看所有已安装的软件包  
&#8195; -qf fileName 查看当前文件属于那个软件  
&#8195; -ql pkgName 查看已安装软件包的详细安装文件  
&#8195; -qc pkgName 查看软件的所有配置文件  
  
&#8195; -ivh pkgPath(全名) 安装软件（-h：以#显示安装进度）  
&#8195; -Uvh pkgPath(全名) 升级软件（-h：以#显示安装进度）  
&#8195; -e pkgName 删除软件  
  
  
## 其他  
**蓝色**  
&#8195; 目录  
**绿色**  
&#8195; 可执行文件  
**红色**  
&#8195; 压缩文件  
**浅蓝色**  
&#8195; 链接文件  
**灰色**  
&#8195; 其他文件  
  
**查看Linux版本信息**  
&#8195; uname -a  
  
**查看ubuntu版本信息**  
&#8195; cat /etc/lsb-release  
  
**查看centos版本信息**  
&#8195; cat /etc/redhat-release  
  
**Linux 修改系统时间为东八区时间**  
cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime  
  
**Linux 免密登入满足至少下面两个条件**  
	1) .ssh目录的权限必须是700   
	2) .ssh/authorized_keys文件权限必须是600  
  
**软链接删除**  
```  
   ln -s source dest #创建软连接  
   rm -rf dest/  #删除source下面的所有文件  
   rm -rf dest #删除软链接   
```  
  
**时间同步**  
```  
#查看时区  
timedatectl status|grep 'Time zone'  
#查看硬件时间  
hwclock -r  
#设置硬件时钟调整为与本地时钟一致  
hwclock -w  
#设置时区为上海  
ln -sf /usr/share/zoneinfo/Asia/Shanghai  /etc/localtime # 或者 timedatectl set-timezone Asia/Shanghai  
#安装ntpdate  
yum -y install ntpdate  
#同步时间  
ntpdate -u  pool.ntp.org  
#同步完成后,date命令查看时间是否正确  
date  
#配置开机同步时间  
#vim /etc/rc.d/rc.local  
/usr/sbin/ntpdate -u cn.pool.ntp.org> /dev/null 2>&1; /sbin/hwclock -w  
```  
  
## 证书安装  
```  
# 新机器没有证书的话，https 443端口不能访问  
yum install ca-certificates -y  
```  
## 查看进程占用的端口  
```  
yum install net-tools -y  
netstat -nltp | grep pid  
```  
## 端口扫描  
```  
yum install nmap -y  
```  
## 流量监控iptraf  
```  
 yum -y install iptraf  
 iptraf-ng  
```  
## 流量监控2  
```  
yum install -y flex byacc libpcap ncurses-devel libpcap-devel   
curl -O http://www.ex-parrot.com/pdw/iftop/download/iftop-1.0pre4.tar.gz   
tar zxvf iftop-1.0pre4.tar.gz  
cd iftop-1.0pre4    
./configure // 配置    
make && make install // 编译安装    
  
iftop -i netcard -B -n // 使用  
```  
## 用户组、用户管理  
```  
cat /etc/group; # 输出所有用户组  
  
cat /etc/passwd; # 查看所有用户  
  
cat /etc/shadow; # 查看用户密码  
  
groupadd yh; # 添加用户组  
  
useradd yaohao -g yh # 添加用户并加入组  
  
usermod yaohao -aG root # 将用户yaohao添加进root组  
  
gpasswd -d yaohao root # 将用户yaohao从root组中删除  
  
passwd yaohao # 重置用户yaohao的密码  
  
userdel yaohao # 删除用户  
  
groupdel yh # 删除用户组  
```  
  
## ps  
```  
ps auxf | ps -auxf  
  
a #显示所有用户的进程  
u #按用户名和启动时间的顺序来显示进程  
x #显示无控制终端的进程  
f #用树形格式来显示进程；  
```  
USER| PID| PPID | PGID | %CPU | %MEM | TTY | STAT | START | TIME | COMMAND | WCHAN   
----|----|------|------|------|------|-----|------|-------|------|---------|-------   
用户 | pid | 父进程标识符 | 进程所属组 | 进程占用的CPU百分比 | 占用内存的百分比 | 终端ID | 进程状态 | 启动进程的时间 | 进程消耗CPU的时间 | 命令的名称和参数 | 正在等待的进程资源  
  
其中STAT包含：  
 R | S | T | Z | N | s | l | +   
---|---|---|---|---|---|---|---  
运行 | 休眠 | 停止或被追踪 | 僵尸进程 | 优先级较低的进程 | 有子进程 | 多进程的 | 位于后台的进程组  
  
## pstree  
```  
pstree -ap  
  
-a #显示参数  
-p #显示进程pid  
```  
  
## top  
```  
top   
-p #指定pid  
-c #显示完整命令  
-d #修改刷新频率  
-n #跟新次数，超过后退出  
-b #批次档模式（batch file）：将多个指令置於同一档案,让os一次执行 "top -bn 1 > top.info" 用于记录信息  
  
进入top显示界面后  
1、E：修改summery内存单位  
2、e：修改Fields内存单位   
3、c: 显示完整命令  
4、N：以 PID 的大小的顺序排列表示进程列表  
5、P：以 CPU 占用率大小的顺序排列进程列表  
6、M：以内存占用率大小的顺序排列进程列表  
7、d：修改刷新频率  
8、k：关闭进程  
9、L: 查找  
10、1：显示cup状态  
11、F/f：进入Field管理界面，也可以用于查看每个Field的代表的意思  
  d/space: #选择/删除需要显示的Field  
  Up/Down: #移动光标  
  Right：#选中，选中后使用Up/Down移动位置   
  Left：#取消选中  
  s：#设置排序字段（desc），非选中状态下才可以操作  
退回top界面q/Esc  
```  
## 工作管理  
```  
Ctrl + z：退出前台，且处于暂停状态（相当于最小化）  
命令 + &：后台运行，且处于运行状态，当时需要交互的命令除外（相当于直接最小化）  
jobs： 查看后台工作  
   -l 查看pid  
fg + jobId：退出后台，返回前台  
bg + jobId：是后台运行且暂停的命令，处于运行状态  
nohub + 命令 + &：后台运行，且不绑定shell（即退出shell，不会被kill）  
```  
  
## curl  
```  
1、保存文件：  
   curl http://www.linux.com >> linux.html  
   curl -o linux.html http://www.linux.com  
   curl -O http://www.linux.com/hello.sh #保存为hello.sh  
2、设置代理  
	curl -x 192.168.100.100:1080 http://www.linux.com  
3、保存cookie  
	curl -c cookiec.txt  http://www.linux.com  
4、保存head  
	curl -D cookied.txt http://www.linux.com  
5、使用cookie  
	curl -b cookiec.txt http://www.linux.com  
6、添加浏览器标识  
	curl -A "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.0)" http://www.linux.com  
7、伪造referer  
	curl -e "www.linux.com" http://mail.linux.com #模拟点击www.linux.com跳转到http://mail.linux.com  
8、端点续传  
	curl -C -O http://www.linux.com/dodo1.JPG  
9、Post  
	-d 设置data   #-d "title=comewords&content=articleContent"  
    -H 设置head   #-H "Content-Type:application/json"  
    -F 上传文件   #-F "file=@/Users/fungleo/Downloads/401.png"  
    -v 显示详情  
  
    curl www.xxx.com -X POST -H "xxx" -d "xxx" -F "file=#/Users/xxx" -v  
10、WebSocket detect  
    curl --include \  
        --no-buffer \  
        -H "Connection: Upgrade" \  
        -H "Upgrade: websocket" \  
        -H "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" \  
        -H "Sec-WebSocket-Version: 13" \  
        http://192.168.3.102/2.5  
11、重定向链接  
    -L: 追踪重定向链接  
12、允许未经认证的https连接  
    -k, --insecure      Allow insecure server connections when using SSL  
```  
  
## find 文件查找  
```  
	find path -options params  
    find . -name "*.log" # 查找当前文件夹及其子文件夹内，.log后缀的文件  
    find . -maxdepth 2 -name "*.log" # 设置查找深度  
    find . -atime +N # 查找N天之前访问过得文件  
    find . -ctime -N # 查找N天内修改过的文件  
    	   -perm 644 # 查找权限为644的文件  
           -exec command {} \; # 将查找出的文件用command执行，注意：{} \; 为固定格式不可省略  
    find . -maxdepth 2 -name "*.log" | xargs rm -rf # 可以用xargs替代exec命令  
             
```  
  
## xargs 管道工具扩展  
```  
   cat test.txt | xargs # 多行输入转单行输出  
   cat test.txt | xargs -n3 # 将输入的内容转成每3个一行  
   echo "nameXnameXnameXname" | xargs -dX -n2 # 使用X将字符串分割，并以每行两个进行显示  
   ls *.jpg | xargs -n1 -I ? cp ? /data/images	# 拷贝所有图片到/data/images下，？为占位符，可以自由替换成其他字符(注：-n1不能少)  
   ls | xargs rm -rf # 相当于 ls | xargs -n1 -I ? rm -rf ?   
```  
  
## sed 非交互式编辑器  
```  
# 删除行  
sed '1,3d' t.txt # 删除1-3行  
sed '/a\|b/d' t.txt # 删除包含a或b的行 sed '/[ad]/d' t.txt  
  
# 新增行  
sed '1!a Hello world!' t.txt # 在除了第1行外的其他行后新增一行Hello world!  
sed '1,5!a Hello world!' t.txt # 在除了第1-5行外的其他行后新增一行Hello world!  
sed '/b$/i Hello world!' t.txt # 在以b结尾的行前新增一行Hello world!  
  
# 替换行  
sed '/^a/!c Hello world!' t.txt # 除了a开头的全部替换为Hello world!  
sed '$!c Hello world!' t.txt # 除了最后一行外，都替换成Hello world!  
  
# 字符替换  
sed 's/a/B/g' t.txt # 将所有a替换成B  
sed 's#a#B#g' t.txt # 将所有a替换成b(分隔符可以为任意字符，/和#是常用的字符，要替换分隔符相同的字符使用\#)  
sed 's#\(aaa\)\(bbb\)#==\0\2\1==#' t.txt # 反向引用，将aaabbb替换成==aaabbbbbbaaa==。（\1表示第一个括号内的内容，\2表示第二个括号内的内容，\0表示匹配到的所有内容）  
sed -r 's#(aaa)(bbb)#==&\2\1==#' t.txt # 反向引用，将aaabbb替换成==aaabbbbbbaaa==。（\1表示第一个括号内的内容，\2表示第二个括号内的内容，&表示匹配到的所有内容）  
sed '/^[0-9]/s/a/A/g' t.txt # 将数字开头的行中的a替换成A  
sed '/^A/,+3s/y/Y/g' t.txt # 将以A开头的行以及下面三行中的y替换成Y  
  
# 上面的操作都不会影响到源文件，需要将修改替换掉源文件的的内容需要： sed -i '1d' t.txt 查看t.txt 第一行被删除  
  
sed -i '/serversConfig/,/}/ s/aaa/bbb/gi' /opt/project/.dw25Config.json #替换包含“serversConfig”的行到包含“}”行中的aaa为bbb，（aaa大小写都可以）  
  
sed -n '/a/p' t.txt # 输出包含a的行（注意：-n不能少，否则会输出t.txt中的所有行，并且包含a的行输出两次）   
sed -i '/a/p' t.txt # 利用上述特性可以复制包含a的行  
  
git status | sed -n "/^Untracked files/,/^no changes/p" # 输出Untracked files到no changes的行  
echo 'aaaaa' | sed -e 's/a/b/g' -e 's/b/c/3g' # aaaaa => bbbbb => bbccc  注：3g表示替换一行中匹配的字段大于等于第三次的  
  
# 多行模式  
g、G：get 保持空间=>模式空间，小写覆盖、大写追加  
h、H：get 模式空间=>保持空间，小写覆盖、大写追加  
N：将下一行追加到模式空间  
  
# 替换掉所有换行符  
cat john.crt | base64 | sed ':loop;N;s/\n//;bloop' #:loop 表示设定一个标签，N 追加下一行，形成新的一行，然后将换行符替换为"", bloop 表示跳转到标签loop处继续执行  
  
```  
## iptables  
```  
#安装iptables-services  
yum install iptables-services  
#设置开机启动  
systemctl enable iptables  
#重启  
systemctl restart iptables  
#保存设置  
service iptables save  
#or  
/usr/libexec/iptables/iptables.init save  
#编辑规则 vi /etc/sysconfig/iptables  
-A INPUT -p tcp --dport 9200 ! -s 192.168.1.0/24 -j DROP # 只允许局域网内的用户访问，/24 代表子网掩码前面24个1即：255.255.255.0  
-A INPUT -p tcp --dport 9200 -s 192.168.1.0/24 -j ACCEPT # 这个需要放在下面两条拒绝的上面，不然设置不能生效  
-A INPUT -j REJECT --reject-with icmp-host-prohibited # 拒绝所有INPUT   
-A FORWARD -j REJECT --reject-with icmp-host-prohibited # 拒绝所有FORWARD  
# no route to host  
1、添加允许的访问规则  
2、拒绝的需要放在允许的后面  
```  
  
## Buffer/Cache  
```  
sync; echo 1 > /proc/sys/vm/drop_caches  #仅清除页面缓存（PageCache）  
sync; echo 2 > /proc/sys/vm/drop_caches  #清除目录项和inode  
sync; echo 3 > /proc/sys/vm/drop_caches  #清除页面缓存，目录项和inode （不建议在生产环境使用）  
drop_caches的值可以是0-3之间的数字，代表不同的含义：  
0：不释放（系统默认值）  
1：释放页缓存  
2：释放dentries和inodes  
3：释放所有缓存  
  
释放完内存后改回去让系统重新自动分配内存。  
echo 0 >/proc/sys/vm/drop_caches  
  
```  
  
## rsync 数据同步  
```  
rsync [OPTION]... SRC DEST  
options:  
	-a 归档模式，相当于 -rlptgoD  
		-r 递归遍历文件夹  
		-l 保持软链接文件类型，原原本本的将软链接文件复制到目的端  
		-p 让目的端保持与源端的权限一致的  
		-t 将源文件的 modify time 同步到目标机器  
		-g -o 保持文件的属组（group）和属主（owner）一致  
		-D 保持设备文件的原始信息  
	-v 显示详情，-vv 显示更多详情，以此类推越多v越详细  
	-z 压缩后传输  
	-H 保持硬链接  
	-P 相当于  --partial --progress  
		--partial 断点续传  
		--progress 显示传输的进度  
	-e ssh 使用SSH加密隧道传输   
		eg. rsync -avHP /opt/project/ . 本地文件同步  
		eg. rsync -avHe ssh root@192.168.1.2:/opt/project/ . 使用默认端口  
		eg. rsync -avHe 'ssh -p 2222' root@192.168.1.2:/opt/project/ . 指定端口  
	-n 进行试运行，不作任何更改(配置delete使用)  
	-L 采取 follow link 的方式指向的实体文件  
	-delete 删除dest有src没有的文件。必须和-r选项搭配使用  
	-delete-after 与-delete一样，只是传输完成后再清理  
	-exclude 排除不需要同步的文件。-exclude-from（从文件读取）  
	-include 重新加入已经被-exclude选项排除的文件。-include-from（从文件读取）  
```  
## 磁盘分区  
```  
1、fdisk -l	#查看未分区的磁盘  
2、fdisk  /dev/vdb	#对/dev/vdb分区  
	n	#新建分区  
    p	#创建主分区  
    1	#设置分区号  
    回车	#选择磁盘的开始扇区  
    回车	#选择磁盘的结束扇区  
    w	#写入  
3、mkfs.ext4 /dev/vdb1	#格式化磁盘  
```  
## 磁盘挂载  
```  
mount /dev/vdb1 /data	#挂载磁盘  
df -h #查看磁盘挂载信息  
echo /dev/vdb1 /data ext4 defaults 0 1 >> /etc/fstab #开机自动挂载  
```  
## grep  
```  
#显示匹配某个结果之后的3行，使用 -A 选项：  
seq 10 | grep "5" -A 3  
  
#显示匹配某个结果之前的3行，使用 -B 选项：  
seq 10 | grep "5" -B 3  
  
#显示匹配某个结果的前三行和后三行，使用 -C 选项：  
seq 10 | grep "5" -C 3  
```  
## lsof  
=list open files linux中任何事物都以文件的形式存在，所以这个命令可以做非常多的事情。下面是常用的命令  
COMMAND | PID| PPID| USER| PGID| FD| TYPE| DEVICE| SIZE| NODE| NAME  
---- | ---| ---|---|---|---|---|---|---|---|---|---|  
进程的名称 | 进程标识符| 父进程标识符（需要指定-R参数）| 进程所有者| 进程所属组| 文件描述符，应用程序通过文件描述符识别该文件。如cwd、txt等| 文件类型，如DIR、REG等，常见的文件类型| 指定磁盘的名称| 文件的大小| 索引节点（文件在磁盘上的标识）| 打开文件的确切名称  
  
```  
lsof -i :3000 	# 查看3000端口相关的进程  
lsof -c node  	# 查看node相关的进程  
lsof +d .		# 查看当前文件下的运行的相关进程  
```  
## kill  
#### linux  
	kill -s pid # s为信号  
	killall node # kill所有node进程  
     
#### windows  
	taskkill -pid 25064 -f  # kill进程号为25064的进程  
	taskkill -im node.exe -f #  kill所有node进程  
  
## perf  
#### perf record  
```bash  
perf record -F 99 -p 13204 -g -- sleep 30  
#perf record表示记录，-F 99表示每秒99次，-p 13204是进程号，即对哪个进程进行分析，-g表示记录调用栈，sleep 30则是持续30秒, 最终生成perf.data文件  
perf record -F 99 -p `pgrep -n node` -g -- sleep 30  
# pgrep -n node 输出最新的node进程的进程ID  
```  
#### perf report  
```bash  
sudo perf report -n --stdio  
# 控制台显示、函数调用关系及耗时占比  
```  
#### perf script  
```bash  
#将perf.data输出可读性文本:out.perf  
```  
#### 生成火焰图  
```bash  
https://github.com/brendangregg/FlameGraph.git  
./stackcollapse-perf.pl out.perf > out.folded # 相关文件折叠成一行  
./flamegraph.pl out.folded > out.svg # 生成svg火焰图  
grep cpuid out.folded | ./flamegraph.pl > cpuid.svg # 因为相关的消息都已经折叠成行，所以可以使用grep选择需要的信息  
```  
## Dell 服务器  
### A、RADI的分组部署  
##### 1、F2 进入System Setup  
##### 2、清空配置  
```  
选择Device Settings >> Integrated RAID Controller... >> Configuration Management >> Clear Configuration >> Confirm >> Yes >> Configuration Management  
如果Configuration Management下有Clear Foreign Configuration >> Yes  
```  
##### 3、Enabled “Auto Import Foreign Configuration”  
```  
Configuration Management >> Main Menu >> Controller Managerment >> 最下面Advanced Controller Properties >> Auto Import Foreign Configuration >> Enabled >> Apply Changes/OK  
```  
##### 4、Create Virtual Disk  
```  
Configuration Management >> Create Virtual Disk >> Select Physical Disks >> Apply Changes/OK >> Select RAID level、Virtual Disk Name、Virtual Disk Size >> Create Virtual Disk >> Yes >> Back >> Back >> Finish >> Finish >> Finish  
```  
  
### B、安装系统  
##### 1、可以按照网上的教程，制作u盘启动（将启动方式从BIOS改成UEFI）  
```  
F11 >> Boot Manager Main Menu >> Launch System Setup >> Bystem BIOS >> Boot Settings >> Boot Mode >> BIOS->UEFI >> Back >> Back >> Yes   
```  
##### 2、然后将u盘插入主机，最重要的是这一步，网上的说法基本上适用这个版本  
```  
F11 >> Boot Manager Main Menu >> One-shot UEFI Boot Menu >> 选择U盘  
```  
  
  
##### 接下来进入这个界面：  
```  
   Install Centos 7  
   Test this media & install CentOS 7  
     
   Troubleshooting  
```  
##### 3、然后选择Install Centos 7，然后按e键，tab是不管用的  
```  
   linuxefi /images/pxeboot/vmlinuz inst/stage2=hd:LABEL=CENTOS\x207\x20x86_64 quiet  
   修改为：   
   linuxefi /images/pxeboot//vmlinuz linux dd nomodeset quiet   
```  
  
##### 4、然后按ctrl + x 进入：  
```  
   1)  
   2)  
   ...  
   8):sdc4		vfat		CentOS\x207\x20x8     B4FE-5315 #记住这个CentOS的路径  
```  
  
##### 5、然后重启主机，再次进入第3步那里，将第3步中LABEL的路径修改为第4步查看到的路径，然后ctrl + x启动安装即可。  
  
### C、网络配置  
##### 1、动态IP  
```  
1、vi /etc/sysconfig/network-scripts/ifcfg-em1  
  ONBOOT=yes、DNS1=8.8.8.8、DNS2=114.114.114.114  
2、systemctl restart network  
3、ip add 查看分配的ip  
```  
##### 2、静态IP  
```  
1、在动态ip的基础上改：BOOTPROTO=dhcp为BOOTPROTO=static  
  新增：IPADDR=192.168.X.X、NETMASK=255.255.X.X、GATEWAY=192.168.X.1  
```  
##### 3、生效  
```  
systemctl restart network  
```  
### D、修改ssh端口  
##### 1、修改sshd_config  
```  
vi etc/ssh/sshd_config  
# If you want to change the port on a SELinux system, you have to tell  
# SELinux about this change.  
# semanage port -a -t ssh_port_t -p tcp #PORTNUMBER  
#Port 22 取消这边的注释，改22为你想要的端口。注意看上面的注释  
```  
##### 2、安装semanage并添加端口  
```  
yum provides semanage  
yum -y install policycoreutils-python  
semanage port -a -t ssh_port_t -p tcp 1024  
semanage port -l | grep ssh # 检查是否成功  
```  
##### 3、firewall端口开放  
```  
firewall-cmd --permanent --zone=public --add-port=1024/tcp  
firewall-cmd --reload  
firewall-cmd --permanent --list-port # 查看已开发端口  
```  
##### 4、重启  
```  
systemctl restart sshd.service  
```  
### 设置主机名永远生效  
```  
hostnamectl set-hostname --static master  
```  
## Failed to get D-Bus connection: Operation not permitted  
 ```  
1、docker  
docker run -tdi --privileged centos init  
   
2、docker-compose  
version: '3'  
services:  
master:  
   image: "centos"  
   privileged: true  
   command: "init"  
 ```  
## Failed to program FILTER chain: iptables failed: iptables --wait  
 ```  
systemctl restart docker  
 ```  
## docker-compose command 执行多条命令  
```  
version: '3'  
services:  
master:  
   image: "centos"  
   privileged: true  
   command:  
      - /bin/sh  
      - -c  
      - |  
         python3 manage.py migrate  
         # ...随意添加任意脚本...  
         python3 manage.py runserver 0.0.0.0:8000  
```  
## windows 磁盘挂载  
```  
docker run \  
-v //d/Docker/2.5/:/opt/2.5/ -v //c/Users/USER/.ssh/:/root/.ssh/ \  
-p 3005:3005 \  
-p 1998:1998 -p 1999:1999 -p 2000:2000 -p 2001:2001 -p 2002:2002 -p 2003:2003 -p 2004:2004 \  
--name 2.5 -idt centos bash  
```  
  
### 查看容器ip  
```  
# 普通容器  
docker inspect -f '{{.Name}} - {{.NetworkSettings.IPAddress }}' $(docker ps -aq)  
# docker-compose内的容器  
docker inspect -f '{{.Name}} - {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps -aq)  
  
```  
  
## 磁盘扩容  
```  
#!/bin/bash  
if [ -z $1 ] || [ -z $2 ]  
then  
    echo "Usage: containerName increaseCapacity："  
    echo "  Example: Increase test container's capacity to 11G"  
    echo "  The command is: bash `basename $0` test 11"  
    exit 1  
fi  
  
if [ `docker inspect $1 &>>/dev/null && echo 0 || echo 1` -eq 1 ] # docker inspect $1 &>>/dev/null执行成功则echo 0 否者 echo 1  
then  
    echo "The container $1 is no exist!"  
    exit 1  
fi  
  
container_id=`docker inspect -f '{{ .GraphDriver.Data.DeviceName }}' $1`  
  
oldDiskSize=`dmsetup table /dev/mapper/$container_id | awk '{print $2}'`  
newDiskSize=$(($2*1024*1024*1024/512))  
  
if (( $newDiskSize <= $oldDiskSize ))  
then  
    echo "Can't shink container $1 from $(($oldDiskSize*512/1024/1024/1024))G to ${2}G!"  
    exit 1  
fi  
  
dmsetup table /dev/mapper/$container_id | sed "s/0 [0-9]* thin/0 $newDiskSize thin/" | dmsetup load /dev/mapper/$container_id  
dmsetup resume /dev/mapper/$container_id  
  
xfs_growfs /dev/mapper/$container_id #container 的文件格式为xfs时，使用这一行  
# resize2fs /dev/mapper/$container_id #container 的文件格式为ext4时，使用这一行  
  
if [ $? -eq 0 ];then  
    echo "dynamic container $1 disk to ${2}G is success!"  
else  
    echo "dynamic container $1 disk to ${2}G is fail!"  
fi  
```  
  
## registry  
### 安装  
```  
docker run -d -p 5000:5000 --restart=always --name registry registry  
```  
  
### 直接push失败  
```  
docker push localhost:5000/yh/test:v1  # An image does not exist locally with the tag: localhost:5000/yh/test:v1  
#Docker Hub是默认的Docker Registry，因此，itmuch/microservice-discovery-eureka:0.0.1相当于docker.io/itmuch/microservice-discovery-eureka:0.0.1。因此，要想将镜像推送到私有仓库，需要修改镜像标签，命令如下：  
```  
### 添加tag后push  
```  
docker tag yh/test:v1 localhost:5000/yh/test:v1  
docker push localhost:5000/yh/test:v1  
```  
### http: server gave HTTP response to HTTPS client  
```  
#在”/etc/docker/“目录下，创建”daemon.json“文件。在文件中写入  
{  
    "insecure-registries": [  
        "localhost:5000"  
    ]  
}  
```  
## zookeeper  
```  
version: '3.1'  
  
services:  
  zoo1:  
    image: zookeeper  
    hostname: zoo1  
    ports:  
      - 2181:2181  
    environment:  
      ZOO_MY_ID: 1  
      ZOO_SERVERS: server.1=0.0.0.0:2888:3888;2181 server.2=zoo2:2888:3888;2181 server.3=zoo3:2888:3888;2181  
  
  zoo2:  
    image: zookeeper  
    hostname: zoo2  
    ports:  
      - 2182:2181  
    environment:  
      ZOO_MY_ID: 2  
      ZOO_SERVERS: server.1=zoo1:2888:3888;2181 server.2=0.0.0.0:2888:3888;2181 server.3=zoo3:2888:3888;2181  
  
  zoo3:  
    image: zookeeper  
    hostname: zoo3  
    ports:  
      - 2183:2181  
    environment:  
      ZOO_MY_ID: 3  
      ZOO_SERVERS: server.1=zoo1:2888:3888;2181 server.2=zoo2:2888:3888;2181 server.3=0.0.0.0:2888:3888;2181  
  
  node-zk-browser:  
    image: fify/node-zk-browser  
    hostname: node-zk-browser  
    ports:  
      - "3000:3000"  
    environment:  
      ZK_HOST: zoo1:2181  
  
```  
  
## kafka  
```  
version: '2'  
services:  
  zookeeper:  
    image: jplock/zookeeper  
    container_name: zoo1  
    restart: always  
    ports:  
      - "2181:2181"  
  kafka1:  
    image: wurstmeister/kafka:latest  
    container_name: kafka11  
    restart: always  
    ports:  
      - "9192:9192"  
    depends_on:  
      - zookeeper  
    environment:  
      KAFKA_ADVERTISED_HOST_NAME: 192.168.3.107  
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181  
      KAFKA_LISTENERS: "PLAINTEXT://:9192"  
      KAFKA_ADVERTISED_LISTENERS: "PLAINTEXT://192.168.3.107:9192"  
      KAFKA_BROKER_ID: 1  
  kafka2:  
    image: wurstmeister/kafka:latest  
    container_name: kafka12  
    restart: always  
    ports:  
      - "9193:9193"  
    depends_on:  
      - zookeeper  
    environment:  
      KAFKA_ADVERTISED_HOST_NAME: 192.168.3.107  
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181  
      KAFKA_LISTENERS: "PLAINTEXT://:9193"  
      KAFKA_ADVERTISED_LISTENERS: "PLAINTEXT://192.168.3.107:9193"  
      KAFKA_BROKER_ID: 2  
```  
### 可能出现的问题  
+ No route to host   
```  
1、关闭防火墙和iptables  
2、重启docker  
```  
  
## es  
  
```  
# bin/elasticsearch-certutil ca // 生成自己的ca证书（使用默认名字elastic-stack-ca.p12）  
# bin/elasticsearch-certutil cert --ca elastic-stack-ca.p12 // 根据上面生成的ca证书，生成证书文件elastic-certificates.p12（其实它不仅仅是节点证书，还包含了ca证书和节点密钥）  
# elasticsearch-setup-passwords auto 自动生成密码  
version: '2.2'  
services:  
  es01:  
    image: elasticsearch:7.3.2  
    container_name: es01  
    environment:  
      - node.name=es01  
      - discovery.seed_hosts=es02,es03  
      - cluster.initial_master_nodes=es01,es02,es03  
      - cluster.name=docker-cluster  
      - bootstrap.memory_lock=true  
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"  
      - xpack.security.enabled=true  
      - xpack.security.transport.ssl.enabled=true  
      - xpack.security.transport.ssl.verification_mode=certificate   
      - xpack.security.transport.ssl.keystore.path=certs/elastic-certificates.p12   
      - xpack.security.transport.ssl.truststore.path=certs/elastic-certificates.p12   
    ulimits:  
      memlock:  
        soft: -1  
        hard: -1  
    volumes:  
      - //d/Docker/es/node0/data:/usr/share/elasticsearch/data  
      - //d/Docker/script/elastic/elastic-certificates.p12:/usr/share/elasticsearch/config/certs/elastic-certificates.p12  
    ports:  
      - 9201:9200  
    networks:  
      - esnet  
  es02:  
    image: elasticsearch:7.3.2  
    container_name: es02  
    environment:  
      - node.name=es02  
      - discovery.seed_hosts=es01,es03  
      - cluster.initial_master_nodes=es01,es02,es03  
      - cluster.name=docker-cluster  
      - bootstrap.memory_lock=true  
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"  
      - xpack.security.enabled=true  
      - xpack.security.transport.ssl.enabled=true  
      - xpack.security.transport.ssl.verification_mode=certificate   
      - xpack.security.transport.ssl.keystore.path=certs/elastic-certificates.p12   
      - xpack.security.transport.ssl.truststore.path=certs/elastic-certificates.p12   
    ulimits:  
      memlock:  
        soft: -1  
        hard: -1  
    volumes:  
      - //d/Docker/es/node1/data:/usr/share/elasticsearch/data  
      - //d/Docker/script/elastic/elastic-certificates.p12:/usr/share/elasticsearch/config/certs/elastic-certificates.p12  
    ports:  
      - 9202:9200  
    networks:  
      - esnet  
  es03:  
    image: elasticsearch:7.3.2  
    container_name: es03  
    environment:  
      - node.name=es03  
      - discovery.seed_hosts=es01,es02  
      - cluster.initial_master_nodes=es01,es02,es03  
      - cluster.name=docker-cluster  
      - bootstrap.memory_lock=true  
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"  
      - xpack.security.enabled=true  
      - xpack.security.transport.ssl.enabled=true  
      - xpack.security.transport.ssl.verification_mode=certificate   
      - xpack.security.transport.ssl.keystore.path=certs/elastic-certificates.p12   
      - xpack.security.transport.ssl.truststore.path=certs/elastic-certificates.p12   
    ulimits:  
      memlock:  
        soft: -1  
        hard: -1  
    volumes:  
      - //d/Docker/es/node2/data:/usr/share/elasticsearch/data  
      - //d/Docker/script/elastic/elastic-certificates.p12:/usr/share/elasticsearch/config/certs/elastic-certificates.p12  
    ports:  
      - 9203:9200  
    networks:  
      - esnet  
  kibana:  
    image: kibana:7.3.2  
    container_name: kibana  
    privileged: true  
    networks:  
      - esnet  
    ports:  
      - "5601:5601"  
    environment:  
      SERVER_NAME: kibana.example.org  
      ELASTICSEARCH_HOSTS: http://es01:9200  
networks:  
  esnet:  
```  
### 可能出现的问题  
+ es01 exited with code 78  
```  
sysctl -w vm.max_map_count=524288 #修改宿主机一个进程可以拥有的VMA(虚拟内存区域)的数量  
echo "vm.max_map_count=262144" > /etc/sysctl.conf # 永久生效  
sysctl -p  
```  
+ AccessDeniedException: /usr/share/elasticsearch/data/nodes  
```  
chmod 777 /opt/es/node{1..3}/data #修改宿主机目录权限  
```  
  
+ connect() failed (113: No route to host) while connecting to upstream  
```  
用nginx做负载均衡时报错。es主机的端口不能对外访问，导致nginx也不能连接  
```  
  
+ error='Cannot allocate memory'  
```  
#默认分配jvm空间大小为2g，需要改小一点  
-Xms2g  →  -Xms512m  
-Xmx2g  →  -Xmx512m  
```  
  
+ max file descriptors [4096] for elasticsearch process is too low, increase to at least [65536] 或者 max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]  
```  
vim /etc/security/limits.conf  
* soft nofile 300000  
* hard nofile 300000  
* soft nproc 102400  
* soft memlock unlimited  
* hard memlock unlimited  
```  
  
+ Merging/Reducing the aggregations failed when computing the aggregation [group_by_tags] because the field you gave in the aggregation query existed as two different types in two different indices  
```  
存在index的mapping中的字段的类型不一致  
```  
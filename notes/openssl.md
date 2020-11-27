### openssl 命令 https://www.jianshu.com/p/e311a6537467  
### 生成密钥  
```  
openssl genrsa -out private.key 2048 # 生成私钥:   
openssl rsa -in private.key -pubout -out public.key # 根据私钥生成公钥 -pubout  
```  
### 创建自签证书 https://www.jianshu.com/p/79c284e826fa   
  
1、 查看配置文件  
	less -N /etc/pki/tls/openssl.cnf  
2、 创建所需文件夹  
	mkdir -pv /etc/pki/CA/{certs,crl,newcerts,private}  
	touch /etc/pki/CA/{serial,index.txt}  
	echo 01 > /etc/pki/CA/serial # 指明证书的开始编号  
  
3、 生成私钥  
	openssl genrsa -out /etc/pki/CA/private/cakey.pem 4096  
4、 创建自签证书  
    openssl req -new -x509 -key /etc/pki/CA/private/cakey.pem  -out /etc/pki/CA/cacert.pem -days 3650  
		#req          产生证书签发申请命令  
		#-new         表示新请求。  
		#-key         密钥,这里为key文件  
		#-out         输出路径,这里为csr文件  
5、 为用户颁发证书  
（未完，待续）  
  
### 查看证书信息  
openssl x509 -in /etc/pki/CA/certs/httpd.crt -noout -serial -dates -subject  
>-noout：不输出加密的证书内容  
>-serial：输出证书序列号  
>-dates：显示证书有效期的开始和终止时间  
>-subject：输出证书的subject  
  
### nginx+https  
  
openssl req -x509 -nodes -days 36500 -newkey rsa:2048 -keyout /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt  
>	req: 配置参数-x509指定使用 X.509证书签名请求管理(certificate signing request (CSR))."X.509" 是一个公钥代表that SSL and TLS adheres to for its key and certificate management.  
>	-nodes: 告诉OpenSSL生产证书时忽略密码环节.(因为我们需要Nginx自动读取这个文件，而不是以用户交互的形式)。  
>	-days 36500: 证书有效期，100年  
>	-newkey rsa:2048: 同时产生一个新证书和一个新的SSL key(加密强度为RSA 2048)  
>	-keyout:SSL输出文件名  
>	-out:证书生成文件名  
  
它会问一些问题。需要注意的是在common name中填入网站域名，如wiki.xby1993.net即可生成该站点的证书，同时也可以使用泛域名如*.xby1993.net来生成所有二级域名可用的网站证书。整个问题应该如下所示:  
>	Country Name (2 letter code) [AU]:US  
>	State or Province Name (full name) [Some-State]:New York  
>	Locality Name (eg, city) []:New York City  
>	Organization Name (eg, company) [Internet Widgits Pty Ltd]:Bouncy Castles, Inc.  
>	Organizational Unit Name (eg, section) []:Ministry of Water Slides  
>	Common Name (e.g. server FQDN or YOUR name) []:your_domain.com  
>	Email Address []:admin@your_domain.com  
  
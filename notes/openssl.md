#### 证书标准  
```  
X.509  
```  
  
#### 编码格式  
```bash  
#1、pem (-----BEGIN 文件类型----- ...... -----END 文件类型-----)  
#2、der (二进制格式)  
  
#pem => der:  
openssl x509 -in cert.pem -outform der -out cert.der  
#der => pem:  
openssl x509 -in cert.der -outform pem -out cert.pem -inform der  
```  
  
#### 文件扩展名  
```bash  
1、.key 密钥  
2、.csr 证书请求 CERTIFICATE REQUEST  
3、.crt（.cer）证书 CERTIFICATE  
4、.pem pem编码的文件  
5、.der der编码的文件  
  
# 查看key详情  
openssl rsa -in certificate.key -text -noout        # 查看key详情  
openssl rsa -in cert-public.key -text -noout -pubin # 查看公钥详情  
        req                                         # 查看crt详情  
        x509                                        # 查看证书详情  
  
openssl rsa -in certificate.key -text -noout -inform der # 查看der格式的key详情  
openssl rsa -in cert-public.key -text -noout -inform der # 查看der格式的公钥详情  
        req                                              # 查看der格式的crt详情  
        x509                                             # 查看der格式的证书详情  
```  
  
#### 证书申请  
```bash  
# 新建私钥  
openssl genrsa -out domain.key 2048   
  
# 通过key证书请求  
openssl req -new -key domain.key -out domain.csr # Common Name(CN) Organization(O) CN 是用户名，O 是该用户归属的组。需要填写  
  
# 自签证书  
openssl x509 -signkey domain.key -in domain.csr -req -days 365 -out domain.crt  
  
# 通过key和证书找回证书请求  
openssl x509 -in domain.crt -signkey domain.key -x509toreq -out domain.csr  
```  
  
#### 加密解密  
```bash  
# 生成公钥  
openssl rsa -in domain.key -pubout -out domain.pub.key  
  
# 加密  
openssl rsautl -encrypt -inkey domain.key -in data.txt -out data.txt.en # 私钥加密  
openssl rsautl -encrypt -inkey domain.pub.key -in data.txt -out data.txt.en -pubin # 公钥加密  
  
# 解密  
openssl rsautl -decrypt -inkey domain.key -in data.txt.en -out data.txt.en.de # 私钥解密  
  
# 使用私钥数据签名：  
openssl rsautl -sign -in data.txt -inkey domain.key -out sign.data  
  
# 恢复签名数据：  
openssl rsautl -verify -in sign.data -inkey domain.key # 私钥恢复  
openssl rsautl -verify -in sign.data -inkey domain.pub.key -pubin # 公钥恢复  
```  
  
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
  
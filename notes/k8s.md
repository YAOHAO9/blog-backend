### keubectl   
```bash  
kubectl get pod {podname} -n {namespace} -o yaml | kubectl replace --force -f - # 重启pod  
kubectl logs pod {podname} -n {namespace} # 查看错误日志  
kubectl describe pod {podname} -n {namespace} # 查看pod详情日志  
kubectl exec -it pod {podname} -n {namespace} -- bash # 进入pod  
```  
  
### local volume  
StorageClass  
```yaml  
apiVersion: storage.k8s.io/v1  
kind: StorageClass  
metadata:  
  name: "local-storage"  
provisioner: "kubernetes.io/no-provisioner"  
volumeBindingMode: "WaitForFirstConsumer"  
```  
PersistentVolume  
```yaml  
apiVersion: v1  
kind: PersistentVolume  
metadata:  
  name: pv  
spec:  
  capacity:  
    storage: 100Gi  
  # volumeMode field requires BlockVolume Alpha feature gate to be enabled.  
  volumeMode: Filesystem  
  accessModes:  
  - ReadWriteOnce  
  persistentVolumeReclaimPolicy: Delete  
  storageClassName: local-storage  
  local:  
    path: /data/disks/ssd1  
  nodeAffinity:  
    required:  
      nodeSelectorTerms:  
      - matchExpressions:  
        - key: kubernetes.io/hostname  
          operator: In  
          values:  
          - 4b7ffabf43ce  
```  
  
PersistentVolumeClaim  
```yaml  
apiVersion: v1  
kind: PersistentVolumeClaim  
metadata:  
  name: pvc  
spec:  
  accessModes:  
    - ReadWriteOnce  
  resources:  
    requests:  
      storage: 100Gi  
  storageClassName: local-storage  
```  
  
### [helm文档地址](https://whmzsu.github.io/helm-doc-zh-cn/)  
  
[chart 开发指南](http://www.coderdocument.com/docs/helm/v2/developing_templates/getting_started.html)  
#### 文件说明  
```  
_helpers.yaml: 以下划线开头的一般用于定义全局模板（define）  
NOTES.txt: 部署后输出的内容，部署说明  
其他文件: 必须是k8s资源文件  
```  
#### 命令  
```yaml  
# 1、helm install --dry-run --debug pvtest mypvtest/  试运行  
# 2、当你的YAML解析失败，但你想看看生成了什么，检索YAML的一个简单方法是"注释掉模板中的问题部分" eg.  
# {{ printf "%#v" .Capabilities }} # {{}}内的消息会被解析渲染，并显示成注释模式。可用于查看Capabilities这个内置对象的数据结构  
# 3、helm get manifest chartName -n kube-system 查看已安装chart的详情  
```  
#### 内置对象  
```yaml  
1、Release {{ .Release.Name }}  
2、Value 来自values.yaml   
3、Chart 来自Chart.yaml {{.Chart.Name}}-{{.Chart.Version}}  
4、Files 访问文件  
5、Capabilities Kubernetes集群支持哪些功能的信息  
6、Template 包含有关正在执行的当前模板的信息  
```  
#### Value  
```yaml  
1、优先级 --set > -f指定的values > 父values > 子values  
2、--set livenessProbe.httpGet=null 删除values中的配置  
```  
#### 管道  
```yaml  
{{ .Values.favorite.food | upper | quote }}   
{{ .Values.favorite.drink | default "tea" | quote }}  
eq、ne、lt、gt、and、or、not  
```  
  
#### 流程控制  
```yaml  
1、if/else   【fasle、0、"0"、nil（null）、空集合（map、slice、tuple、dict、array】 均为false  
  
{{- if true -}} # 左-：删除缩进 右-：删除换行  
   # true  
{{ else }}  
   # false  
{{ end }}  
  
# 其他缩进方式  
{{ intent 2 "asdf" }} # 调整缩进为2个空格  
{{- include "mychart.app" . | nindent 2 }} # 调整缩进  
  
2、with 修改.作用域   
3、range 遍历  
```  
#### 变量  
```yaml  
{{- $relname := .Release.Name -}} # 定义变量  
{{- range $index, $topping := .Values.pizzaToppings }} # 遍历  
{{ $.Values }} # $全局变量相当于global  
```  
#### 模板  
```yaml   
1、define 定义模板（通常放在_helpers.tpl中）  
{{- define "mychart.labels" }}  
  labels:  
    generator: helm  
    date: {{ now | htmlDate }}  
{{- end }}  
2、使用模板  
{{- template "mychart.labels" . }} .表示传入作用域，不需要可以省略  
```  
### 权限控制  
```bash  
# .key：密钥 .csr：CERTIFICATE REQUEST .crt：CERTIFICATE  
openssl genrsa -out john.key 2048 # 新建私钥  
  
openssl req -new -key john.key -out john.csr # Common Name(CN) Organization Name(O) CN 是用户名，O 是该用户归属的组。需要填写  
  
# 创建一个CertificateSigningRequest.yaml  
# apiVersion: certificates.k8s.io/v1  
# kind: CertificateSigningRequest  
# metadata:  
#   name: john  
# spec:  
#   groups:  
#   - system:authenticated  
#   # cat john.csr | base64 | tr -d "\n"  
#   request: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0NCk1JSUNpakNDQVhJQ0FRQXdSVEVMTUFrR0ExVUVCaE1DUVZVeEV6QVJCZ05WQkFnTUNsTnZiV1V0VTNSaGRHVXgNCkVqQVFCZ05WQkFvTUNXUmxkbVZzYjNCbGNqRU5NQXNHQTFVRUF3d0VhbTlvYmpDQ0FTSXdEUVlKS29aSWh2Y04NCkFRRUJCUUFEZ2dFUEFEQ0NBUW9DZ2dFQkFOVFo3N2JaSXJ4Y2JZOHUyNStVVUw4azNFQ0FYRjNmYmtzVGk4NG4NCkg0ZXJtejhOeG9qUS9QOTdnWlFmQ2piSzM4eStmM29IOFZtMzdVNkhIRks3eWdsMTlsZGN4UC95dzhmcExTL3ANCnIxTkV4aDkrUU9jMHNQTmhEaG5WbjE2RGdwMm43aks2UllkQzZLSDk5KzFTdEwrcmRsUWpURkdOVnJKZmdWblcNCmJJTURMV2dxNDNMQVJnOUMxQVZCcmlBMmtpVElJQ0d2R21ERDRsaS9MZThpSmJyOWpYbmM4Szh5cEtTeHhqb0oNCkM4cE9jZjFZWG9iLzB4QnJsa1pacnY4ZUJtMUluVEhWRWtPUFN2M054NkpSMm9jWnY0MTZjZUtTb3lmZEs2YWwNCjhQem9UdklOVXo2Q2dzc0R3dC93ai9vQUpUT1pXMWhzWHdwczRnR2VGWU03OUhzQ0F3RUFBYUFBTUEwR0NTcUcNClNJYjNEUUVCQ3dVQUE0SUJBUUN1MW4vbnBiTzRFVzY4QUhPSW9tN3h3MS9aNnFmeGlja0UvWjlNalRnSlhDV3YNCkFVdFRIYkNKOFI4MWJpYUV0M1NidTRRek0wemRRUkRVemo4d21vRUQwdUhYM2JmU2t5NEtzeWY1L1MvVmdtRnoNCk4wMUdIdUREaG5mQ2pyUW5ndmQwVk52c2JsVUVUY3J6eHhQOTlKcHlQWEdQZDFxNVpVRWtZUExUVS9pMVV6TjINCkRjNnFRZTVrZE5OQTJSRzBwM1RZR214RkFyd0J2cXhZQ2tWTUwwdUYvY0NEaVcyM3ExZWt1OE5ycGt6eGRRdTINCnlYY3JJYkIyenIrbTUwZjV6OHRPQ3NKUU9DUGJ1cTZHZHVldC8wZnVTdUZrNjZuQitpOElmT1JXY1F3RzJxTVoNCnRuUnRXRFNrSVlROGZoUXV2WFA2YkJYVDUyUVFCYkQ4M2QvRGNCdkUNCi0tLS0tRU5EIENFUlRJRklDQVRFIFJFUVVFU1QtLS0tLQ0K  
#   signerName: kubernetes.io/kube-apiserver-client  
#   usages:  
#   - client auth  
  
kubectl apply -f CertificateSigningRequest.yaml # 查看 kubectl get csr  
  
kubectl certificate approve john  
  
kubectl get csr/john -o  go-template='{{ .status.certificate }}' | base64 -d > john.crt # 获取status.certificate，base64解码，写入john.crt  
  
kubectl create role developer --verb=create --verb=get --verb=list --verb=update --verb=delete --resource=pods # 命令行创建角色  
  
kubectl create rolebinding developer-binding-john --role=developer --user=john # 命令行角色绑定  
  
kubectl config set-credentials john --client-key=./john.key --client-certificate=./john.crt --embed-certs=true # 配置到~/.kube/config中  
  
kubectl config set-context john --cluster=kubernetes --user=john # 添加到上下文中  
  
kubectl config use-context john # 切换上下文  
  
```  
### bug  
#### Kubernetes cluster unreachable with helm  
```  
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml  
```  
#### ERRO[0000] failure getting variant                       error="getCPUInfo for pattern: Cpu architecture: not found"  
```  
helm 包下载错误  
```  
#### 无法删除pvc:Terminating  
```  
1、直接到etcd中删除  
2、  
  kubectl delete pvc pvc_name -n log  
  kubectl patch pvc pvc_name  -p '{"metadata":{"finalizers":null}}' -n log  
```  
  
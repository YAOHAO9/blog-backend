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
          - 6f3f0433359f  
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
### bug  
#### Kubernetes cluster unreachable with helm  
```  
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml  
```  
#### 无法删除pvc:Terminating  
```  
1、直接到etcd中删除  
2、  
  kubectl delete pvc pvc_name -n log  
  kubectl patch pvc pvc_name  -p '{"metadata":{"finalizers":null}}' -n log  
```  
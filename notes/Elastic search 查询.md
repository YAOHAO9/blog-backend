### 分页查询  
```  
GET http://192.168.3.105:9200/early_settle_fail/_search?sort=date:desc&from=10&pretty  
content-type: application/json  
```  
### 多条件查询  
```  
GET  http://192.168.3.101:9200/game_error/_search  
content-type: application/json  
  
{  
    "query":{  
        "bool":{  
            "must":[  
                {  
                    "match":{"serverType":"hhRoom"}  
                },  
                {  
                    "match":{"date":"2020-03-09T03:52:26.821Z"}  
                }  
            ]  
        }  
     }  
}  
```  
### 更新整个文档  
```  
PUT http://192.168.3.105:9200/game_error/_doc/semCmG4Br2wCx887amZW  
content-type: application/json  
  
{  
    "serverType": "bjlRoo"  
}  
```  
### _update局部更新  
```  
POST  http://192.168.3.105:9200/game_error/_doc/semCmG4Br2wCx887amZW/_update  
content-type: application/json  
  
{  
    "doc":{  
        "serverType": "bjlRo"  
    }  
}  
```  
### _update局部更新(脚本)  
```  
POST  http://192.168.3.105:9200/game_error/_doc/semCmG4Br2wCx887amZW/_update  
content-type: application/json  
  
{  
    "script":"ctx._source.serverType = \"bjlRoo\""  
}  
```  
### _update 增量更新  
POST  http://192.168.3.105:9200/game_error/_doc/semCmG4Br2wCx887amZW/_update  
content-type: application/json  
  
{  
    "script":{  
        "inline":"ctx._source.serverType = ctx._source.serverType + 123"  
    }  
}  
  
### _update 删除字段  
```  
POST  http://192.168.3.105:9200/game_error/_doc/semCmG4Br2wCx887amZW/_update  
content-type: application/json  
  
{  
    "script":{  
        "inline":"ctx._source.remove(\"serverType\")"  
    }  
}  
```  
  
### findById  
```  
GET http://192.168.3.105:9200/game_error/_doc/semCmG4Br2wCx887amZW  
```  
### 删除  
```  
DELETE http://192.168.3.105:9200/game_error/_doc/semCmG4Br2wCx887amZW  
```  
### delete By query  
```  
POST http://192.168.3.105:9200/game_error/_delete_by_query  
content-type: application/json  
  
{  
   "query": {  
       "match_all": {}  
    }  
}  
```  
### delete game_error  
```  
#DELETE http://192.168.3.105:9200/game_error  
```  
### 分组  
```  
GET  http://192.168.3.101:9200/game_error/_search  
content-type: application/json  
  
{  
  "size": 1, // 普通查询  
  "_source": [   
    "serverType"  
  ],  
  "aggs": { // 聚合查询  
    "group_by_serverType": {  
      "terms": {  
        "field": "serverType"  
      }  
    }  
  }  
}  
// 同时输出聚合查询和普通查询的结果  
```  
### 修改mapping   
```  
//只能增加不能减少，也不能修改。如果非要修改：新建一个有正确mapping的index然后导入数据。  
POST http://192.168.3.101:9200/game_error/_mapping/   
Content-Type: application/json  
  
{  
  "properties": {  
    "serverType": {  
      "type": "keyword"  
    },  
    "serverId": {  
      "type": "keyword"  
    },  
    "messageMd5": {  
      "type": "keyword"  
    },  
    "message": {  
      "type": "text"  
    },  
    "stack": {  
      "type": "keyword"  
    },  
    "date": {  
      "type": "date"  
    },  
    "date1": {  
      "type": "text"  
    }  
  }  
}  
```  
  
###查询tips  
```  
1、对于精确值的查询，你可能需要使用 filter 语句来取代 query，因为 filter 将会被缓存。  
2、term 查询被用于精确值 匹配，这些精确值可能是数字、时间、布尔或者那些 not_analyzed 的字符串：  
3、如果在一个精确值的字段上使用它（match）， 例如数字、日期、布尔或者一个 not_analyzed 字符串字段，那么它将会精确匹配给定的值  
```  
###修改mapping  
```  
POST http://192.168.3.101:9200/game_error/_mapping/   
{  
  "properties": {  
    "serverType": {  
      "type": "keyword"  
    },  
    "serverId": {  
      "type": "keyword"  
    },  
    "messageMd5": {  
      "type": "keyword"  
    },  
    "message": {  
      "type": "text"  
    },  
    "stack": {  
      "type": "keyword"  
    },  
    "date": {  
      "type": "date"  
    }  
  }  
}  
```  
### 倒排索引与doc_value  
```bash  
倒排索引 # 检索  
doc_value # 采用列式存储，便于压缩。适用于聚合、排序、脚本等操作  
```  
  
### 索引类型  
```bash  
"index":  
    analyzed # 全文索引，模糊搜索  
    not_analyzed # 精确索引，精确搜索  
    no # 不索引，不能被搜索  
"include_in_all"：false # 不加入_all搜素  
"_source": {  
    "enabled":  false # 不保存文档，只能搜索出Id，然后再去查找其他库  
}  
```  
  
### doc_value  
```bash  
#Doc Values 默认对除了analyzed的所有字段启用。也就是说对数字、地理坐标、日期、IP 和不分析（ not_analyzed ）字符类型都会默认开启  
"doc_values": false # 关闭以节省磁盘空间  
```  
  
### 动态映射  
```bash  
"dynamic":  
    true # 根据新字段推断mapping类型，并加入mapping  
    false # 忽略该字段  
    strict # 报错  
```  
  
### 其他  
```bash  
reindex # 命令重新索引  
copy_to # 拷贝一个字段到另一个字段  
```  
  
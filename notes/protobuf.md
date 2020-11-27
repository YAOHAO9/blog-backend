### protobuf  
```protobuf  
syntax = "proto3";  
package awesomepackage;  
  
option go_package = "/awesomepackage";  
  
message AwesomeMessage {  
    optional  string awesomeField = 1;   
    optional  string name = 2;   
    optional  int32 age = 3;   
}  
```  
### command script  
```bash  
./node_modules/.bin/pbjs -t static-module -w commonjs -o dist/compiled.js proto/*.proto  
./node_modules/.bin/pbts -o dist/compiled.d.ts dist/compiled.js   
  
protoc --go_out=go **/*.proto  --experimental_allow_proto3_optional  
```  
### ts example  
```typescript  
import * as protobuf from "protobufjs";  
import { awesomepackage } from "./dist/compiled";  
  
const MyMessage = awesomepackage.AwesomeMessage;  
const Root = protobuf.Root;  
const Type = protobuf.Type;  
const Field = protobuf.Field;  
  
  
///////// example1  
const TestType = Type.fromJSON("test", {  
    fields: {  
        "msg": {  
            rule: "required",  
            type: "string",  
            id: 1  
        },  
        "from": {  
            rule: "required",  
            type: "string",  
            id: 2  
        },  
        "target": {  
            rule: "required",  
            type: "string",  
            id: 3  
        }  
    }  
});  
  
const msesage = TestType.create({  
    "msg": "ahahah",  
    "from": "from",  
    "target": "target"  
});  
  
const buffer = TestType.encode(msesage).finish();  
  
console.log(buffer);  
  
console.warn(TestType.decode(buffer).toJSON());  
  
///////// example2  
protobuf.load("proto/awesome.proto").then((root) => {  
  
    // Obtain a message type  
    const AwesomeMessage = root.lookupType("awesomepackage.AwesomeMessage");  
  
    // Encode a message to an Uint8Array (browser) or Buffer (node)  
    const buffer = AwesomeMessage.encode({ awesomeField: ["AwesomeString"], name: "asd", age: 123 }).finish();  
    console.warn(buffer);  
  
    // Decode an Uint8Array (browser) or Buffer (node) to a message  
    const message = AwesomeMessage.decode(buffer);  
    console.warn(message.toJSON());  
  
});  
```  
  
### go example   
```  
package main  
  
import (  
	"fmt"  
  
	"github.com/jhump/protoreflect/desc/protoparse"  
	"github.com/jhump/protoreflect/dynamic"  
)  
  
func main() {  
  
	//加载并解析 proto文件,得到一组 FileDescriptor  
	descs, _ := (protoparse.Parser{}).ParseFiles("./proto/awesome.proto")  
  
	//descs 是一个数组，这里因为只有一个文件，就取了第一个元素.  
	msg := descs[0].FindMessage("awesomepackage.AwesomeMessage")  
	if msg == nil {  
		return  
	}  
  
	// decode json  
	dmsg := dynamic.NewMessage(msg) // create a message  
	dmsg.UnmarshalJSON([]byte(`{"awesomeField":["AwesomeString"],"name":"asd","age":123}`))  
  
	// encode json  
	jsStr, _ := dmsg.MarshalJSON()  
	fmt.Printf("jsStr=%s\n", jsStr)  
  
	// encode buffer  
	buf, _ := dmsg.Marshal()  
	fmt.Println(buf)  
  
	// decode buffer  
	newMsg := dynamic.NewMessage(msg) // create a new message  
	newMsg.Unmarshal(buf)  
	fmt.Println(newMsg)  
}  
```  
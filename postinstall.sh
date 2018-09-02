
#!/bin/sh
sed -i -e "s#self.error(req, res, new errors.FinaleError(500, \'internal error\', \[err.message\], err));##g" node_modules/finale-rest/lib/Controllers/base.js
sed -i -e 's#res.json(context.instance);#res.json({ data: context.instance });#g' node_modules/finale-rest/lib/Controllers/base.js
sed -i -e '/res.json({$/{N;N;N;s#^.*$#res.json({error:{message:err.message,errors:err.errors}})#;}' node_modules/finale-rest/lib/Controllers/base.js


# Express Auto Push

## Points About the package

* You need to use the express's cookieparrser middleware before this package for it to work correctly
* The path to the static assets folder can be relative or absolute (static)
* If relative path is supplied, then the flag `isPathStatic` must be `false` (default: `false`). And must be relative from the base of the project folder (where node_modules) folder is present.
* If absolute (static) path to the static assets folder is supplied, then the flag `isPathStatic` must be `true`.
* The static path option is not fully tested for environments where node_modules is kept shared or not installed with the files, please use with caution, or use absoulte path option for such environments.

## How to use

```javascript
import express from 'express';
import http2 from 'http2';

import expressAutoPush from 'express-auto-push';

const app = express();

app.use(expressAutoPush({rootDir: '/static'}));

const server = http2.createSecureServer(app);

server.listen(3000, () => {
    console.log('server up and running on 3000');
});
```

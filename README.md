this is a package

#How to use

```javascript
import express from 'express';
import http2 from 'http2';

import expressAutoPush from './index';

const app = express();

app.use(expressAutoPush({rootDir: '/static'}));

const server = http2.createSecureServer(app);

server.listen(3000, () => {
    console.log('server up and running on 3000');
});
```

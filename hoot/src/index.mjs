import http from 'http';
import httpProxy from 'http-proxy';

const port = 3000;

const proxy = httpProxy.createProxyServer({
  // ws: true,
});

http.createServer((req, res) => {
  console.log('Request', req.method, req.url);
  proxy.web(req, res, { target: `${req.protocol}://${req.hostname}` });
}).listen(port);

console.log(`proxy listen on port ${port}`);

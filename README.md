natoBoard
----

natoBoard 是一個使用 Node.js 實現的簡單協作編輯 App。

![演示](https://raw.githubusercontent.com/Nat-Lab/nato_board/master/doc/demo.gif)

## 部署

```
$ git clone https://github.com/Nat-Lab/nato_board
$ npm install
$ npm run build && npm start
```

## 運行

打開 `http://127.0.0.1:8123/#文檔名稱` 來新建文檔。打開 `http://127.0.0.1:8123/md.html#文檔名稱` 來使用 markdown 編輯器進行文檔編輯。若文檔不存在，會自動建立。

反向代理（nginx 為例）：

```
server {
        listen 80;
        listen 443 ssl;

        ssl on;
        ssl_certificate /path/to/cert;
        ssl_certificate_key /path/to/key;

        server_name board.example.com;

        access_log /var/log/nginx/board.log;
        error_log /var/log/nginx/board.err;

        # set a long timeout, so websocket won't be interrupt.
        proxy_connect_timeout 6h;
        proxy_send_timeout 6h;
        proxy_read_timeout 6h;

        # allow websocket to be proxied.
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_buffering off;

        location / {
                proxy_pass http://127.0.0.1:8123;
        }
}
```

## 開源協議

MIT

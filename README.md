092五笔拆分图片生成
---
092 Wubi character breakup image generation.

A little html2canvas demo.

## TCP interface
This is an example usage:

First start the main webpage server
```shell
npm run dev
```
Then start the TCP server for external communication:
```shell
cd automation
npm run run -- 'http://localhost:5173' 8081 1
```
Generate images like this (`netcat` example):
```shell
netcat 127.0.0.1 8081 << EOF
["测试", "/home/bczhc/a.png"]
EOF
```

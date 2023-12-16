092五笔拆分图片生成
---
092 Wubi character breakup image generation.

A little html2canvas demo.

## Socket interface
This is an example usage:

1. Start the main webpage server

   ```shell
   npm run dev
   ```
2. Start the socket server for external communication:

   ```shell
   cd automation
   npm run run -- 'http://localhost:5173' 8081 socket
   ```
3. Request

   A socket request demo in Rust
   ```rust
   use std::io::{Cursor, Read, Write};
   use std::net::{SocketAddrV4, TcpStream};
   
   use byteorder::{ReadBytesExt, LE};
   use image::{GenericImageView, ImageFormat};
   
   fn main() {
       let mut stream = TcpStream::connect("127.0.0.1:5001".parse::<SocketAddrV4>().unwrap()).unwrap();
   
       let content = ["内容", "一二三四五六七八九十"];
       for c in content {
           stream
               .write_all(serde_json::to_string(&c).unwrap().as_bytes())
               .unwrap();
           stream.write_all(b"\n").unwrap();
           let length = stream.read_u32::<LE>().unwrap();
           let mut buf = vec![0_u8; length as usize];
           stream.read_exact(&mut buf).unwrap();
           let mut reader = Cursor::new(buf);
           let image = image::load(&mut reader, ImageFormat::Png).unwrap();
           println!("Dimension: {:?}", image.dimensions());
       }
   }
   ```
   Output:
   ```
   Dimension: (865, 355)
   Dimension: (690, 1355)
   ```

## HTTP interface
1. Start the webpage server as mentioned above
2. Start the HTTP server

   ```console
   cd automation
   npm run run -- 'http://localhost:5173' 8081 socket
   ```
3. Request
   ```console
   curl http://localhost:5001/?text=%E5%A4%A9%E4%B8%8B%E4%BA%8B%E6%9C%89%E9%9A%BE%E6%98%93%E4%B9%8E%EF%BC%9F > img.png
   ```
4. Open `img.png`, you can see this:
   ![image](https://github.com/bczhc/092-breakup-generate-image/assets/49330580/edaf27a4-e66d-4f6e-8ed4-b251c8bc8279)

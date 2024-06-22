html2canvas-image-generator
---

Generate image from HTML elements.

## Socket (TCP-based) interface
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
   use std::net::{SocketAddr, TcpStream};
   
   use byteorder::{ReadBytesExt, WriteBytesExt, LE};
   use image::{GenericImageView, ImageFormat};
   use serde::Serialize;
   
   #[derive(Serialize)]
   struct Params<'a> {
   text: &'a str,
   }
   
   fn main() {
   let text_sets = ["天下事有难易乎？", "寂静无声", "好似这世界只有我一个人"];
   
       for text in text_sets {
           let mut stream =
               TcpStream::connect("127.0.0.1:8081".parse::<SocketAddr>().unwrap()).unwrap();
           let params = Params { text };
           let name = "092breakup";
           let params = serde_json::to_string(&params).unwrap();
   
           stream.write_u32::<LE>(name.len() as u32).unwrap();
           stream.write_u32::<LE>(params.len() as u32).unwrap();
           stream.write_all(name.as_bytes()).unwrap();
           stream.write_all(params.as_bytes()).unwrap();
   
           let image_size = stream.read_u32::<LE>().unwrap();
           let mut buffer = vec![0_u8; image_size as usize];
           stream.read_exact(&mut buffer).unwrap();
           let image = image::load(Cursor::new(buffer), ImageFormat::Png).unwrap();
           println!("Image dimension: {:?}", image.dimensions());
       }
   }
   ```
   Output:
   ```
   Image dimension: (762, 1025)
   Image dimension: (860, 564)
   Image dimension: (833, 1371)
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
   ~ ❯ curl 'http://localhost:8081/?name=092breakup&params=%7B%22text%22%3A%22%E5%A4%A9%E4%B8%8B%E4%BA%8B%E6%9C%89%E9%9A%BE%E6%98%93%E4%B9%8E%EF%BC%9F%22%7D' -sS | ffprobe -hide_banner -
   Input #0, png_pipe, from 'fd:':
   Duration: N/A, bitrate: N/A
   Stream #0:0: Video: png, rgba(pc, gbr/bt709/iec61966-2-1), 762x1025, 25 fps, 25 tbr, 25 tbn
   ```
4. If you save the output as a `.png` file plus open it, you can see this:
   ![image](https://github.com/bczhc/092-breakup-generate-image/assets/49330580/edaf27a4-e66d-4f6e-8ed4-b251c8bc8279)

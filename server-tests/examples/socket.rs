use std::io::{Cursor, Read, Write};
use std::net::{SocketAddr, TcpStream};

use byteorder::{ReadBytesExt, WriteBytesExt, LE};
use image::{GenericImageView, ImageFormat};
use server_tests::{Params, TEXT_SETS};

fn main() -> anyhow<()> {
    for text in TEXT_SETS {
        let mut stream =
            TcpStream::connect("127.0.0.1:8081".parse::<SocketAddr>()?)?;
        let params = Params { text };
        let name = "092breakup";
        let params = serde_json::to_string(&params)?;

        stream.write_u32::<LE>(name.len() as u32)?;
        stream.write_u32::<LE>(params.len() as u32)?;
        stream.write_all(name.as_bytes())?;
        stream.write_all(params.as_bytes())?;

        let image_size = stream.read_u32::<LE>()?;
        let mut buffer = vec![0_u8; image_size as usize];
        stream.read_exact(&mut buffer)?;
        let image = image::load(Cursor::new(buffer), ImageFormat::Png)?;
        println!("Image dimension: {:?}", image.dimensions());
    }

    Ok(())
}
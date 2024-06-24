use std::io;
use std::io::{Cursor, Seek, SeekFrom};
use image::{GenericImageView, ImageFormat};
use server_tests::{Params, TEXT_SETS};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let app_name = "092breakup";
    for text in TEXT_SETS {
        let params = serde_json::to_string(&Params { text })?;
        let params_url = urlencoding::encode(&params);
        let url = format!("http://127.0.0.1:8081?name={app_name}&params={params_url}");
        let bytes = reqwest::get(url).await?.bytes().await?;
        let mut buffer = Cursor::new(Vec::new());
        io::copy(&mut Cursor::new(bytes), &mut buffer)?;
        buffer.seek(SeekFrom::Start(0))?;
        let image = image::load(buffer, ImageFormat::Png)?;
        println!("Image dimension: {:?}", image.dimensions());
    }

    Ok(())
}
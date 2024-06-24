use serde::Serialize;

#[derive(Serialize)]
pub struct Params<'a> {
    pub text: &'a str,
}

pub const TEXT_SETS: [&str; 3] = ["天下事有难易乎？", "寂静无声", "好似这世界只有我一个人"];
use ropey::Rope;
use std::sync::Mutex;
use once_cell::sync::Lazy;
use serde::Serialize;

// 1. Global Editor State
static GLOBAL_BUFFER: Lazy<Mutex<Rope>> = Lazy::new(|| {
    Mutex::new(Rope::from_str("// Hidders Editor v0.1\n// Type here..."))
});

#[derive(Serialize)]
pub struct ViewportLines {
    start_line: usize,
    lines: Vec<String>,
    total_lines: usize,
}

// 2. Command: Insert Text
#[tauri::command]
pub fn insert_char(char: char, line_idx: usize, col_idx: usize) -> Result<(), String> {
    let mut rope = GLOBAL_BUFFER.lock().map_err(|e| e.to_string())?;
    
    let char_idx = rope.line_to_char(line_idx) + col_idx;
    
    if char_idx <= rope.len_chars() {
        rope.insert_char(char_idx, char);
        Ok(())
    } else {
        Err("Index out of bounds".to_string())
    }
}

// 3. Command: Get Only Visible Lines
#[tauri::command]
pub fn get_viewport(start_line: usize, height: usize) -> Result<ViewportLines, String> {
    let rope = GLOBAL_BUFFER.lock().map_err(|e| e.to_string())?;
    let total_lines = rope.len_lines();
    
    let end_line = std::cmp::min(start_line + height, total_lines);
    let mut lines = Vec::new();

    for i in start_line..end_line {
        let line = rope.line(i);
        let mut line_str = line.to_string();
        if line_str.ends_with('\n') {
            line_str.pop(); 
        }
        lines.push(line_str);
    }

    Ok(ViewportLines {
        start_line,
        lines,
        total_lines
    })
}
mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        // 2. Register the commands using their full path
        .invoke_handler(tauri::generate_handler![
            commands::editor::insert_char,
            commands::editor::get_viewport
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
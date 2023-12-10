#[tauri::command]
pub fn open_script(args: String) {
    open::that(args);
}

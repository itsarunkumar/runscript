use std::io::{Error, ErrorKind, Read};
use std::process::{Command, Output, Stdio};
use tauri::InvokeError;

#[tauri::command]
pub fn execute_script(command: String, args: String) {
    let mut commander = Command::new(command);

    open::that(args);
}

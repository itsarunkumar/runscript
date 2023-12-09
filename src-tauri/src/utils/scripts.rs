use std::io::Read;
use std::process::{Command, Stdio};

#[tauri::command]
pub fn execute_script(command: String, args: Vec<String>) -> Result<String, std::io::Error> {
    let mut command = Command::new(command);
    command.args(args);
    command.stdout(Stdio::piped());

    let mut output = String::new();

    // Spawn the child process and capture its output
    let mut child = command.spawn()?;
    child.stdout.take().unwrap().read_to_string(&mut output)?;

    // Check for errors
    let exit_status = child.wait()?;
    if !exit_status.success() {
        return Err(std::io::Error::new(
            std::io::ErrorKind::Other,
            "Command failed",
        ));
    }

    Ok(output)
}

mod my_module;
mod scripts;
mod tray;

pub use my_module::say_hello;

// tray handlers
pub use tray::handle_tray_event;
pub use tray::make_tray;

// scripts opener
pub use scripts::__cmd__open_script;
pub use scripts::open_script;

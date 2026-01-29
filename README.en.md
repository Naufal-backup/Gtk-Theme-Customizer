# GTK Theme Customizer

[🇮🇩 Bahasa Indonesia](README.md) | **🇬🇧 English**

GNOME Shell Extension to customize GTK 3 and GTK 4 window control buttons with full control over colors, size, and border radius.

## Features

- ✨ **Full Customization**: Change colors, icon size, padding, margin, and border radius
- 🎨 **Color Picker**: Easily select colors using GTK color picker
- 🎯 **Aggressive Selector**: Uses powerful CSS selectors to ensure changes are applied
- 📱 **GTK 3 & 4 Support**: Automatically generates CSS for both GTK versions
- 💾 **Auto-Save**: Changes are immediately saved to configuration files
- 🔄 **Live Update**: Changes are applied in real-time

## Installation

### Automatic

```bash
cd Gtk-Theme-Customizer
chmod +x install.sh
./install.sh
```

### Manual

1. Copy extension folder to:
   ```bash
   ~/.local/share/gnome-shell/extensions/gtk-theme-customizer@github.com/
   ```

2. Compile schema:
   ```bash
   glib-compile-schemas ~/.local/share/gnome-shell/extensions/gtk-theme-customizer@github.com/schemas/
   ```

3. Enable extension:
   ```bash
   gnome-extensions enable gtk-theme-customizer@github.com
   ```

4. Restart GNOME Shell:
   - **X11**: Press `Alt+F2`, type `r`, press Enter
   - **Wayland**: Log out and log back in

## Usage

1. Open GNOME Extensions or type:
   ```bash
   gnome-extensions prefs gtk-theme-customizer@github.com
   ```

2. Adjust settings:
   - **Icon Size**: Change window button icon size
   - **Border Radius**: Adjust roundness (0 = square, 999 = fully rounded)
   - **Padding & Margin**: Set inner and outer button spacing
   - **Button Colors**: Choose colors for close, minimize, and maximize buttons
   - **Opacity**: Set background transparency for normal and hover states

3. Changes are automatically applied to:
   - `~/.config/gtk-4.0/gtk.css`
   - `~/.config/gtk-3.0/gtk.css`

## Uninstall

```bash
gnome-extensions disable gtk-theme-customizer@github.com
gnome-extensions uninstall gtk-theme-customizer@github.com
```

## Compatibility

- GNOME Shell 45+
- GTK 3.0+
- GTK 4.0+

## License

MIT License

## Repository

https://github.com/naufal453/Gtk-Theme-Customizer

## Contributing

Pull requests are welcome! Please open an issue first to discuss major changes.

## Author

Developed by [naufal453](https://github.com/naufal453)

# GTK Theme Customizer

**�🇧 English** | [🇮🇩 Bahasa Indonesia](README.id.md)

GNOME Shell Extension to customize GTK 3 and GTK 4 window control buttons with full control over colors, size, and border radius.

## Features

- ✨ **Full Customization**: Change colors, icon size, padding, margin, and border radius
- 🎨 **Color Picker**: Easily select colors using GTK color picker
- 🎯 **Aggressive Selector**: Uses powerful CSS selectors to ensure changes are applied
- 📱 **GTK 3 & 4 Support**: Automatically generates CSS for both GTK versions
- 💾 **Auto-Save**: Changes are immediately saved to configuration files
- 🔄 **Live Update**: Changes are applied in real-time
- 🔑 **Apply to Root**: Copy themes and configurations to root user with one click
- 🌍 **Multi-Language**: Automatically follows system language (English, Indonesian)

## Installation

### Easy Installation (Recommended)

Just run the installer script:

```bash
cd Gtk-Theme-Customizer
chmod +x install.sh
./install.sh
```

The script will automatically:
- Install all extension files
- Compile translations
- Compile GSettings schema
- Enable the extension

After installation, restart GNOME Shell:
- **X11**: Press `Alt+F2`, type `r`, press Enter
- **Wayland**: Log out and log back in

### Manual Installation

1. Copy extension folder to:
   ```bash
   ~/.local/share/gnome-shell/extensions/gtk-theme-customizer@naufal453/
   ```

2. Compile schema:
   ```bash
   glib-compile-schemas ~/.local/share/gnome-shell/extensions/gtk-theme-customizer@naufal453/schemas/
   ```

3. Enable extension:
   ```bash
   gnome-extensions enable gtk-theme-customizer@naufal453
   ```

4. Restart GNOME Shell (see above)

## Usage

1. Open GNOME Extensions or type:
   ```bash
   gnome-extensions prefs gtk-theme-customizer@naufal453
   ```

2. Adjust settings:
   - **Icon Size**: Change window button icon size
   - **Border Radius**: Adjust roundness (0 = square, 999 = fully rounded)
   - **Padding & Margin**: Set inner and outer button spacing
   - **Button Colors**: Choose colors for close, minimize, and maximize buttons
   - **Opacity**: Set background transparency for normal and hover states
   - **Apply to Root**: Copy your themes and GTK configurations to root user

3. Changes are automatically applied to:
   - `~/.config/gtk-4.0/gtk.css`
   - `~/.config/gtk-3.0/gtk.css`

### Apply to Root User

To apply your themes and GTK configurations to the root user (useful for applications running as root):

1. Open extension preferences
2. Scroll to **Actions** section
3. Click **Apply to Root** button
4. Enter your password when prompted
5. Your themes from `~/.themes` and configurations from `~/.config/gtk-3.0` and `~/.config/gtk-4.0` will be copied to `/root/`

**New:** The script now automatically detects your current theme settings including:
- GTK theme name
- Icon theme
- Color scheme (dark/light mode)

These settings will be automatically applied to the root user, ensuring the root environment matches your normal user environment.

## Uninstall

```bash
gnome-extensions disable gtk-theme-customizer@naufal453
gnome-extensions uninstall gtk-theme-customizer@naufal453
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

## Support Me

https://saweria.co/Naufal453

## Author

Developed by [naufal453](https://github.com/naufal453)

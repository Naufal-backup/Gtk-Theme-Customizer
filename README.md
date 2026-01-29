# GTK Theme Customizer

**🇬🇧 English** | [🇮🇩 Bahasa Indonesia](README.id.md)

A standalone GTK application to customize GTK 3 and GTK 4 window control buttons with full control over colors, size, and border radius.

## Features

- ✨ **Full Customization**: Change colors, icon size, padding, margin, and border radius
- 🎨 **Color Picker**: Easily select colors using GTK color picker
- 🎯 **Aggressive Selector**: Uses powerful CSS selectors to ensure changes are applied
- 📱 **GTK 3 & 4 Support**: Automatically generates CSS for both GTK versions
- 💾 **Auto-Save**: Changes are immediately saved to configuration files
- 🔄 **Live Update**: Changes are applied in real-time
- 🔑 **Apply to Root**: Copy themes and configurations to root user with one click
- 🌍 **Multi-Language**: Automatically follows system language (English, Indonesian)
- 🖥️ **Standalone App**: Works as a regular application, no GNOME Shell extension needed

## Requirements

- GTK 4.0+
- GTK 3.0+
- libadwaita
- GJS (GNOME JavaScript)
- GNOME 40+ (for libadwaita support)

## Installation

### Easy Installation (Recommended)

Just run the installer script:

```bash
cd Gtk-Theme-Customizer
chmod +x install.sh
sudo ./install.sh
```

The script will automatically:
- Install application files to `/usr/share/gtk-theme-customizer/`
- Install desktop entry
- Compile GSettings schema
- Install translations

After installation, you can launch the app from your application menu or run:
```bash
gjs /usr/share/gtk-theme-customizer/main.js
```

### Manual Installation

1. Create installation directory:
   ```bash
   sudo mkdir -p /usr/share/gtk-theme-customizer
   ```

2. Copy application files:
   ```bash
   sudo cp main.js window.js apply-to-root.sh /usr/share/gtk-theme-customizer/
   sudo chmod +x /usr/share/gtk-theme-customizer/main.js
   sudo chmod +x /usr/share/gtk-theme-customizer/apply-to-root.sh
   ```

3. Install schemas:
   ```bash
   sudo mkdir -p /usr/share/gtk-theme-customizer/schemas
   sudo cp schemas/*.xml /usr/share/gtk-theme-customizer/schemas/
   sudo glib-compile-schemas /usr/share/gtk-theme-customizer/schemas/
   ```

4. Install desktop entry:
   ```bash
   sudo cp com.github.naufal453.GtkThemeCustomizer.desktop /usr/share/applications/
   sudo update-desktop-database /usr/share/applications/
   ```

## Usage

1. Launch **GTK Theme Customizer** from your application menu, or run:
   ```bash
   gjs /usr/share/gtk-theme-customizer/main.js
   ```

2. Adjust settings:
   - **Icon Size**: Change window button icon size
   - **Border Radius**: Adjust roundness (0 = square, 999 = fully rounded)
   - **Padding & Margin**: Set inner and outer button spacing
   - **Button Colors**: Choose colors for close, minimize, and maximize buttons
   - **Opacity**: Set background transparency for normal and hover states
   - **GTK 3 Settings**: Additional settings specific to GTK 3 applications
   - **Apply to Root**: Copy your themes and GTK configurations to root user

3. Changes are automatically applied to:
   - `~/.config/gtk-4.0/gtk.css`
   - `~/.config/gtk-3.0/gtk.css`

### Apply to Root User

To apply your themes and GTK configurations to the root user (useful for applications running as root):

1. Open the application
2. Scroll to **Actions** section
3. Click **Apply** button
4. Enter your password when prompted
5. Your themes from `~/.themes` and configurations from `~/.config/gtk-3.0` and `~/.config/gtk-4.0` will be copied to `/root/`

The script automatically detects your current theme settings including:
- GTK theme name
- Icon theme
- Color scheme (dark/light mode)

These settings will be automatically applied to the root user, ensuring the root environment matches your normal user environment.

## Uninstall

```bash
cd Gtk-Theme-Customizer
sudo ./uninstall.sh
```

Or manually:
```bash
sudo rm -rf /usr/share/gtk-theme-customizer
sudo rm /usr/share/applications/com.github.naufal453.GtkThemeCustomizer.desktop
sudo update-desktop-database /usr/share/applications/
```

## Compatibility

- GNOME 40+
- GTK 3.0+
- GTK 4.0+
- libadwaita 1.0+

## What Changed?

This project was previously a GNOME Shell extension but has been converted to a standalone GTK application based on reviewer feedback. The application now:
- Runs independently without requiring GNOME Shell extension system
- Uses pure GJS (GNOME JavaScript) with libadwaita
- Can be launched anytime without affecting GNOME Shell
- Follows modern GNOME application design patterns

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

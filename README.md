# GTK Theme Customizer

**🇮🇩 Bahasa Indonesia** | [🇬🇧 English](README.en.md)

GNOME Shell Extension untuk mengkustomisasi tombol window GTK 3 dan GTK 4 dengan kontrol penuh atas warna, ukuran, dan border radius.

## Fitur

- ✨ **Customisasi Penuh**: Ubah warna, ukuran ikon, padding, margin, dan border radius
- 🎨 **Color Picker**: Pilih warna dengan mudah menggunakan color picker GTK
- 🎯 **Selector Agresif**: Menggunakan selector CSS yang kuat untuk memastikan perubahan diterapkan
- 📱 **Support GTK 3 & 4**: Otomatis generate CSS untuk kedua versi GTK
- 💾 **Auto-Save**: Perubahan langsung tersimpan ke file konfigurasi
- 🔄 **Live Update**: Perubahan diterapkan secara real-time

## Instalasi

### Otomatis

```bash
cd Gtk-Theme-Customizer
chmod +x install.sh
./install.sh
```

### Manual

1. Copy folder extension ke:
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
   - **X11**: `Alt+F2`, ketik `r`, tekan Enter
   - **Wayland**: Log out dan log in kembali

## Penggunaan

1. Buka GNOME Extensions atau ketik:
   ```bash
   gnome-extensions prefs gtk-theme-customizer@github.com
   ```

2. Sesuaikan pengaturan:
   - **Ukuran Ikon**: Ubah ukuran ikon tombol window
   - **Border Radius**: Sesuaikan kelengkungan (0 = kotak, 999 = bulat penuh)
   - **Padding & Margin**: Atur jarak dalam dan luar tombol
   - **Warna Tombol**: Pilih warna untuk close, minimize, dan maximize
   - **Opacity**: Atur transparansi background normal dan hover

3. Perubahan otomatis diterapkan ke:
   - `~/.config/gtk-4.0/gtk.css`
   - `~/.config/gtk-3.0/gtk.css`

## Uninstall

```bash
gnome-extensions disable gtk-theme-customizer@github.com
gnome-extensions uninstall gtk-theme-customizer@github.com
```

## Kompatibilitas

- GNOME Shell 45+
- GTK 3.0+
- GTK 4.0+

## Lisensi

MIT License

## Repository

https://github.com/naufal453/Gtk-Theme-Customizer

## Kontribusi

Pull requests are welcome! Silakan buka issue terlebih dahulu untuk diskusi perubahan besar.

## Author

Developed by [naufal453](https://github.com/naufal453)

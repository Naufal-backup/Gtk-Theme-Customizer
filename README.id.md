# GTK Theme Customizer

[🇬🇧 English](README.md) | **🇮🇩 Bahasa Indonesia**

GNOME Shell Extension untuk mengkustomisasi tombol window GTK 3 dan GTK 4 dengan kontrol penuh atas warna, ukuran, dan border radius.

## Fitur

- ✨ **Customisasi Penuh**: Ubah warna, ukuran ikon, padding, margin, dan border radius
- 🎨 **Color Picker**: Pilih warna dengan mudah menggunakan color picker GTK
- 🎯 **Selector Agresif**: Menggunakan selector CSS yang kuat untuk memastikan perubahan diterapkan
- 📱 **Support GTK 3 & 4**: Otomatis generate CSS untuk kedua versi GTK
- 💾 **Auto-Save**: Perubahan langsung tersimpan ke file konfigurasi
- 🔄 **Live Update**: Perubahan diterapkan secara real-time
- 🔑 **Terapkan ke Root**: Salin tema dan konfigurasi ke pengguna root dengan satu klik
- 🌍 **Multi-Bahasa**: Otomatis mengikuti bahasa sistem (English, Indonesian)

## Instalasi

### Instalasi Mudah (Direkomendasikan)

Cukup jalankan script installer:

```bash
cd Gtk-Theme-Customizer
chmod +x install.sh
./install.sh
```

Script akan otomatis:
- Install semua file ekstensi
- Compile translations
- Compile GSettings schema
- Enable ekstensi

Setelah instalasi, restart GNOME Shell:
- **X11**: `Alt+F2`, ketik `r`, tekan Enter
- **Wayland**: Log out dan log in kembali

### Instalasi Manual

1. Copy folder extension ke:
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

4. Restart GNOME Shell (lihat di atas)

## Penggunaan

1. Buka GNOME Extensions atau ketik:
   ```bash
   gnome-extensions prefs gtk-theme-customizer@naufal453
   ```

2. Sesuaikan pengaturan:
   - **Ukuran Ikon**: Ubah ukuran ikon tombol window
   - **Border Radius**: Sesuaikan kelengkungan (0 = kotak, 999 = bulat penuh)
   - **Padding & Margin**: Atur jarak dalam dan luar tombol
   - **Warna Tombol**: Pilih warna untuk close, minimize, dan maximize
   - **Opacity**: Atur transparansi background normal dan hover
   - **Terapkan ke Root**: Salin tema dan konfigurasi GTK Anda ke pengguna root

3. Perubahan otomatis diterapkan ke:
   - `~/.config/gtk-4.0/gtk.css`
   - `~/.config/gtk-3.0/gtk.css`

### Terapkan ke Pengguna Root

Untuk menerapkan tema dan konfigurasi GTK Anda ke pengguna root (berguna untuk aplikasi yang berjalan sebagai root):

1. Buka preferensi ekstensi
2. Scroll ke bagian **Aksi**
3. Klik tombol **Terapkan ke Root**
4. Masukkan password Anda saat diminta
5. Tema dari `~/.themes` dan konfigurasi dari `~/.config/gtk-3.0` dan `~/.config/gtk-4.0` akan disalin ke `/root/`

**Baru:** Script sekarang secara otomatis mendeteksi pengaturan tema Anda saat ini termasuk:
- Nama tema GTK
- Tema ikon
- Skema warna (mode gelap/terang)

Pengaturan ini akan secara otomatis diterapkan ke pengguna root, memastikan lingkungan root sesuai dengan lingkungan pengguna normal Anda.

## Uninstall

```bash
gnome-extensions disable gtk-theme-customizer@naufal453
gnome-extensions uninstall gtk-theme-customizer@naufal453
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

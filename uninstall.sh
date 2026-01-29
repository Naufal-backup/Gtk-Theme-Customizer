#!/bin/bash

# GTK Theme Customizer - Uninstallation Script

APP_NAME="gtk-theme-customizer"
INSTALL_DIR="/usr/share/$APP_NAME"
DESKTOP_FILE="com.github.naufal453.GtkThemeCustomizer.desktop"

echo "===================================="
echo "GTK Theme Customizer Uninstaller"
echo "===================================="
echo ""

# Check for root/sudo
if [ "$EUID" -ne 0 ]; then
    echo "⚠️  This uninstallation requires root privileges."
    echo "   Please run with sudo: sudo ./uninstall.sh"
    echo ""
    read -p "Do you want to continue with sudo? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        exec sudo bash "$0" "$@"
    else
        echo "Uninstallation cancelled."
        exit 1
    fi
fi

echo "🗑️  Removing application files..."

# Remove application directory
if [ -d "$INSTALL_DIR" ]; then
    rm -rf "$INSTALL_DIR"
    echo "✓ Application directory removed"
else
    echo "⚠️  Application directory not found"
fi

# Remove desktop file
if [ -f "/usr/share/applications/$DESKTOP_FILE" ]; then
    rm "/usr/share/applications/$DESKTOP_FILE"
    echo "✓ Desktop entry removed"
else
    echo "⚠️  Desktop file not found"
fi

# Update desktop database
if command -v update-desktop-database &> /dev/null; then
    update-desktop-database /usr/share/applications/
    echo "✓ Desktop database updated"
fi

echo ""
echo "✅ Uninstallation complete!"
echo ""
echo "📝 Note: Your GTK configurations in ~/.config/gtk-3.0 and ~/.config/gtk-4.0"
echo "   have been preserved. You can manually delete them if needed."
echo ""

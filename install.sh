#!/bin/bash

# GTK Theme Customizer - Installation Script
# This script installs the GNOME Shell extension

EXTENSION_UUID="gtk-theme-customizer@github.com"
EXTENSION_DIR="$HOME/.local/share/gnome-shell/extensions/$EXTENSION_UUID"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "================================"
echo "GTK Theme Customizer Installer"
echo "================================"
echo ""

# Check if GNOME Shell is installed
if ! command -v gnome-shell &> /dev/null; then
    echo "❌ Error: GNOME Shell is not installed"
    exit 1
fi

echo "✓ GNOME Shell detected"
GNOME_VERSION=$(gnome-shell --version | cut -d' ' -f3 | cut -d'.' -f1)
echo "  Version: $GNOME_VERSION"
echo ""

# Create extension directory
echo "📁 Creating extension directory..."
mkdir -p "$EXTENSION_DIR"

# Copy extension files
echo "📋 Copying extension files..."
cp "$SCRIPT_DIR/extension.js" "$EXTENSION_DIR/"
cp "$SCRIPT_DIR/prefs.js" "$EXTENSION_DIR/"
cp "$SCRIPT_DIR/metadata.json" "$EXTENSION_DIR/"
cp "$SCRIPT_DIR/stylesheet.css" "$EXTENSION_DIR/"

# Copy and compile schema
echo "⚙️  Installing GSettings schema..."
mkdir -p "$EXTENSION_DIR/schemas"
cp "$SCRIPT_DIR/schemas/org.gnome.shell.extensions.gtk-theme-customizer.gschema.xml" "$EXTENSION_DIR/schemas/"

# Compile schema
if command -v glib-compile-schemas &> /dev/null; then
    glib-compile-schemas "$EXTENSION_DIR/schemas/"
    echo "✓ Schema compiled successfully"
else
    echo "⚠️  Warning: glib-compile-schemas not found. Schema compilation skipped."
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "To enable the extension, run:"
echo "  gnome-extensions enable $EXTENSION_UUID"
echo ""
echo "Or use GNOME Extensions app to enable it."
echo ""
echo "To configure, run:"
echo "  gnome-extensions prefs $EXTENSION_UUID"
echo ""
echo "📝 Note: You may need to restart GNOME Shell:"
echo "  - On X11: Press Alt+F2, type 'r', press Enter"
echo "  - On Wayland: Log out and log back in"
echo ""

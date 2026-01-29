#!/bin/bash

# GTK Theme Customizer - Installation Script
# This script installs the GNOME Shell extension

EXTENSION_UUID="gtk-theme-customizer@naufal453"
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
cp "$SCRIPT_DIR/apply-to-root.sh" "$EXTENSION_DIR/"
chmod +x "$EXTENSION_DIR/apply-to-root.sh"

# Compile and copy locale files
echo "🌍 Installing translations..."
mkdir -p "$EXTENSION_DIR/locale"
if [ -d "$SCRIPT_DIR/locale" ]; then
    # Compile .po files to .mo if msgfmt is available
    if command -v msgfmt &> /dev/null; then
        echo "  Compiling translations..."
        for po_file in "$SCRIPT_DIR"/locale/*/LC_MESSAGES/*.po; do
            if [ -f "$po_file" ]; then
                mo_file="${po_file%.po}.mo"
                msgfmt "$po_file" -o "$mo_file"
                echo "  ✓ Compiled $(basename "$po_file")"
            fi
        done
    fi
    cp -r "$SCRIPT_DIR/locale"/* "$EXTENSION_DIR/locale/"
    echo "✓ Translations installed"
fi

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

# Enable extension automatically
echo ""
echo "🔌 Enabling extension..."
if command -v gnome-extensions &> /dev/null; then
    gnome-extensions enable "$EXTENSION_UUID" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✓ Extension enabled"
    else
        echo "⚠️  Could not enable automatically. You may need to restart GNOME Shell first."
    fi
else
    echo "⚠️  gnome-extensions command not found. Please enable manually."
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "📝 Note: You may need to restart GNOME Shell:"
echo "  - On X11: Press Alt+F2, type 'r', press Enter"
echo "  - On Wayland: Log out and log back in"
echo ""
echo "After restart, the extension should be active."
echo "To configure, run: gnome-extensions prefs $EXTENSION_UUID"
echo "Or open GNOME Extensions app."
echo ""

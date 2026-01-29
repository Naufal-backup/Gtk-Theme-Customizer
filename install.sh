#!/bin/bash

# GTK Theme Customizer - Installation Script
# This script installs the standalone GTK application

APP_NAME="gtk-theme-customizer"
INSTALL_DIR="/usr/share/$APP_NAME"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DESKTOP_FILE="com.github.naufal453.GtkThemeCustomizer.desktop"

echo "================================"
echo "GTK Theme Customizer Installer"
echo "================================"
echo ""

# Detect distribution
detect_distro() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        echo "$ID"
    elif [ -f /etc/lsb-release ]; then
        . /etc/lsb-release
        echo "$DISTRIB_ID" | tr '[:upper:]' '[:lower:]'
    else
        echo "unknown"
    fi
}

DISTRO=$(detect_distro)
echo "🔍 Detected distribution: $DISTRO"
echo ""

# Check dependencies
echo "🔎 Checking dependencies..."
MISSING_DEPS=()

# Check GJS
if ! command -v gjs &> /dev/null; then
    MISSING_DEPS+=("gjs")
fi

# Check glib-compile-schemas
if ! command -v glib-compile-schemas &> /dev/null; then
    case "$DISTRO" in
        ubuntu|debian|linuxmint|pop)
            MISSING_DEPS+=("libglib2.0-dev-bin")
            ;;
        fedora|rhel|centos)
            MISSING_DEPS+=("glib2-devel")
            ;;
        arch|manjaro|endeavouros)
            MISSING_DEPS+=("glib2")
            ;;
    esac
fi

# Check GTK4 (try to import in gjs if gjs is available)
if command -v gjs &> /dev/null; then
    if ! gjs -c "imports.gi.Gtk" &> /dev/null; then
        case "$DISTRO" in
            ubuntu|debian|linuxmint|pop)
                MISSING_DEPS+=("libgtk-4-1" "gir1.2-gtk-4.0")
                ;;
            fedora|rhel|centos)
                MISSING_DEPS+=("gtk4")
                ;;
            arch|manjaro|endeavouros)
                MISSING_DEPS+=("gtk4")
                ;;
        esac
    fi
fi

# Check libadwaita
if command -v gjs &> /dev/null; then
    if ! gjs -c "imports.gi.Adw" &> /dev/null; then
        case "$DISTRO" in
            ubuntu|debian|linuxmint|pop)
                MISSING_DEPS+=("libadwaita-1-0" "gir1.2-adw-1")
                ;;
            fedora|rhel|centos)
                MISSING_DEPS+=("libadwaita")
                ;;
            arch|manjaro|endeavouros)
                MISSING_DEPS+=("libadwaita")
                ;;
        esac
    fi
fi

# If there are missing dependencies, offer to install them
if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
    echo "❌ Missing dependencies detected:"
    for dep in "${MISSING_DEPS[@]}"; do
        echo "   - $dep"
    done
    echo ""
    
    # Show install command based on distro
    case "$DISTRO" in
        ubuntu|debian|linuxmint|pop)
            INSTALL_CMD="sudo apt update && sudo apt install -y ${MISSING_DEPS[*]}"
            PKG_MANAGER="apt"
            ;;
        fedora)
            INSTALL_CMD="sudo dnf install -y ${MISSING_DEPS[*]}"
            PKG_MANAGER="dnf"
            ;;
        rhel|centos)
            INSTALL_CMD="sudo yum install -y ${MISSING_DEPS[*]}"
            PKG_MANAGER="yum"
            ;;
        arch|manjaro|endeavouros)
            INSTALL_CMD="sudo pacman -S --noconfirm ${MISSING_DEPS[*]}"
            PKG_MANAGER="pacman"
            ;;
        *)
            echo "⚠️  Unknown distribution. Please install the following manually:"
            echo "   - GJS (GNOME JavaScript)"
            echo "   - GTK 4.0+"
            echo "   - libadwaita 1.0+"
            echo "   - GLib development tools (glib-compile-schemas)"
            exit 1
            ;;
    esac
    
    echo "Would you like to install dependencies automatically?"
    echo "Command: $INSTALL_CMD"
    echo ""
    read -p "Install dependencies? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📦 Installing dependencies..."
        if [ "$PKG_MANAGER" = "apt" ]; then
            sudo apt update
        fi
        eval "$INSTALL_CMD"
        
        if [ $? -eq 0 ]; then
            echo "✓ Dependencies installed successfully"
        else
            echo "❌ Failed to install dependencies"
            exit 1
        fi
    else
        echo "❌ Installation cancelled. Please install dependencies manually."
        exit 1
    fi
else
    echo "✓ All dependencies are satisfied"
fi

echo ""

# Verify GJS after potential installation
if ! command -v gjs &> /dev/null; then
    echo "❌ Error: gjs is still not available after installation attempt"
    exit 1
fi

echo "✓ GJS detected"
GJS_VERSION=$(gjs --version)
echo "  $GJS_VERSION"
echo ""

# Check for root/sudo
if [ "$EUID" -ne 0 ]; then
    echo "⚠️  This installation requires root privileges."
    echo "   Please run with sudo: sudo ./install.sh"
    echo ""
    read -p "Do you want to continue with sudo? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        exec sudo bash "$0" "$@"
    else
        echo "Installation cancelled."
        exit 1
    fi
fi

# Create application directory
echo "📁 Creating application directory..."
mkdir -p "$INSTALL_DIR"

# Copy application files
echo "📋 Copying application files..."
cp "$SCRIPT_DIR/main.js" "$INSTALL_DIR/"
cp "$SCRIPT_DIR/window.js" "$INSTALL_DIR/"
cp "$SCRIPT_DIR/apply-to-root.sh" "$INSTALL_DIR/"
chmod +x "$INSTALL_DIR/main.js"
chmod +x "$INSTALL_DIR/apply-to-root.sh"

# Copy schemas
echo "📦 Installing GSettings schemas..."
mkdir -p "$INSTALL_DIR/schemas"
cp "$SCRIPT_DIR/schemas/org.gnome.shell.extensions.gtk-theme-customizer.gschema.xml" "$INSTALL_DIR/schemas/"

# Compile schema in install directory
if command -v glib-compile-schemas &> /dev/null; then
    glib-compile-schemas "$INSTALL_DIR/schemas/"
    echo "✓ Schema compiled successfully"
else
    echo "⚠️  Warning: glib-compile-schemas not found. Schema compilation skipped."
fi

# Install locale files
echo "🌍 Installing translations..."
if [ -d "$SCRIPT_DIR/locale" ]; then
    mkdir -p "$INSTALL_DIR/locale"
    cp -r "$SCRIPT_DIR/locale"/* "$INSTALL_DIR/locale/"
    echo "✓ Translations installed"
fi

# Install desktop file
echo "🖥️  Installing desktop entry..."
cp "$SCRIPT_DIR/$DESKTOP_FILE" "/usr/share/applications/"
echo "✓ Desktop entry installed"

# Update desktop database
if command -v update-desktop-database &> /dev/null; then
    update-desktop-database /usr/share/applications/
    echo "✓ Desktop database updated"
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "📝 You can now:"
echo "  - Launch from application menu: 'GTK Theme Customizer'"
echo "  - Or run from terminal: gjs $INSTALL_DIR/main.js"
echo ""
echo "To uninstall, run: sudo ./uninstall.sh"
echo ""

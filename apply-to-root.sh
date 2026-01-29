#!/bin/bash
# Script to apply GTK themes and configurations to root
# This script should be run with pkexec

set -e

USER_HOME="$1"
USER_NAME="$2"
if [ -z "$USER_HOME" ]; then
    echo "Error: User home directory not provided"
    exit 1
fi

if [ -z "$USER_NAME" ]; then
    echo "Error: Username not provided"
    exit 1
fi

echo "Applying GTK themes and configurations to root..."

# Detect current user's theme settings
echo "Detecting user's theme settings..."
DBUS_SESSION_BUS_ADDRESS_FILE="$USER_HOME/.dbus/session-bus/$(cat /var/lib/dbus/machine-id)-0"
if [ ! -f "$DBUS_SESSION_BUS_ADDRESS_FILE" ]; then
    # Try alternative location
    DBUS_SESSION_BUS_ADDRESS_FILE="/run/user/$(id -u $USER_NAME)/bus"
fi

# Get GTK theme settings from user
GTK_THEME=$(sudo -u "$USER_NAME" DBUS_SESSION_BUS_ADDRESS="unix:path=/run/user/$(id -u $USER_NAME)/bus" gsettings get org.gnome.desktop.interface gtk-theme 2>/dev/null | tr -d "'")
ICON_THEME=$(sudo -u "$USER_NAME" DBUS_SESSION_BUS_ADDRESS="unix:path=/run/user/$(id -u $USER_NAME)/bus" gsettings get org.gnome.desktop.interface icon-theme 2>/dev/null | tr -d "'")
COLOR_SCHEME=$(sudo -u "$USER_NAME" DBUS_SESSION_BUS_ADDRESS="unix:path=/run/user/$(id -u $USER_NAME)/bus" gsettings get org.gnome.desktop.interface color-scheme 2>/dev/null | tr -d "'")

# Fallback to reading from settings.ini if gsettings fails
if [ -z "$GTK_THEME" ] && [ -f "$USER_HOME/.config/gtk-3.0/settings.ini" ]; then
    GTK_THEME=$(grep "gtk-theme-name" "$USER_HOME/.config/gtk-3.0/settings.ini" | cut -d'=' -f2 | tr -d ' ')
fi
if [ -z "$ICON_THEME" ] && [ -f "$USER_HOME/.config/gtk-3.0/settings.ini" ]; then
    ICON_THEME=$(grep "gtk-icon-theme-name" "$USER_HOME/.config/gtk-3.0/settings.ini" | cut -d'=' -f2 | tr -d ' ')
fi

echo "Detected settings:"
echo "  GTK Theme: ${GTK_THEME:-default}"
echo "  Icon Theme: ${ICON_THEME:-default}"
echo "  Color Scheme: ${COLOR_SCHEME:-default}"
echo ""

# Copy themes from user's .themes to /root/.themes
if [ -d "$USER_HOME/.themes" ]; then
    echo "Copying themes from $USER_HOME/.themes to /root/.themes..."
    mkdir -p /root/.themes
    cp -r "$USER_HOME/.themes/"* /root/.themes/ 2>/dev/null || true
    echo "Themes copied successfully"
else
    echo "Warning: $USER_HOME/.themes not found, skipping themes copy"
fi

# Copy GTK 3.0 configuration
if [ -d "$USER_HOME/.config/gtk-3.0" ]; then
    echo "Copying GTK 3.0 configuration to /root/.config/gtk-3.0..."
    mkdir -p /root/.config/gtk-3.0
    cp -r "$USER_HOME/.config/gtk-3.0/"* /root/.config/gtk-3.0/ 2>/dev/null || true
    
    # Apply detected theme settings to root's GTK 3.0 settings.ini
    if [ -n "$GTK_THEME" ] || [ -n "$ICON_THEME" ] || [ -n "$COLOR_SCHEME" ]; then
        echo "Configuring GTK 3.0 settings for root..."
        cat > /root/.config/gtk-3.0/settings.ini << EOF
[Settings]
$([ -n "$GTK_THEME" ] && echo "gtk-theme-name=$GTK_THEME")
$([ -n "$ICON_THEME" ] && echo "gtk-icon-theme-name=$ICON_THEME")
$([ "$COLOR_SCHEME" = "prefer-dark" ] && echo "gtk-application-prefer-dark-theme=1" || echo "gtk-application-prefer-dark-theme=0")
EOF
    fi
    
    echo "GTK 3.0 configuration copied successfully"
else
    echo "Warning: $USER_HOME/.config/gtk-3.0 not found, skipping GTK 3.0 copy"
fi

# Copy GTK 4.0 configuration
if [ -d "$USER_HOME/.config/gtk-4.0" ]; then
    echo "Copying GTK 4.0 configuration to /root/.config/gtk-4.0..."
    mkdir -p /root/.config/gtk-4.0
    cp -r "$USER_HOME/.config/gtk-4.0/"* /root/.config/gtk-4.0/ 2>/dev/null || true
    
    # Apply detected theme settings to root's GTK 4.0 settings.ini
    if [ -n "$GTK_THEME" ] || [ -n "$ICON_THEME" ] || [ -n "$COLOR_SCHEME" ]; then
        echo "Configuring GTK 4.0 settings for root..."
        cat > /root/.config/gtk-4.0/settings.ini << EOF
[Settings]
$([ -n "$GTK_THEME" ] && echo "gtk-theme-name=$GTK_THEME")
$([ -n "$ICON_THEME" ] && echo "gtk-icon-theme-name=$ICON_THEME")
$([ "$COLOR_SCHEME" = "prefer-dark" ] && echo "gtk-application-prefer-dark-theme=1" || echo "gtk-application-prefer-dark-theme=0")
EOF
    fi
    
    echo "GTK 4.0 configuration copied successfully"
else
    echo "Warning: $USER_HOME/.config/gtk-4.0 not found, skipping GTK 4.0 copy"
fi

# Apply theme settings via dconf/gsettings for root
echo "Applying theme settings to root user profile..."
if [ -n "$GTK_THEME" ]; then
    echo "  Setting GTK theme to: $GTK_THEME"
    dconf write /org/gnome/desktop/interface/gtk-theme "'$GTK_THEME'" 2>/dev/null || true
fi

if [ -n "$ICON_THEME" ]; then
    echo "  Setting Icon theme to: $ICON_THEME"
    dconf write /org/gnome/desktop/interface/icon-theme "'$ICON_THEME'" 2>/dev/null || true
fi

if [ -n "$COLOR_SCHEME" ]; then
    echo "  Setting Color scheme to: $COLOR_SCHEME"
    dconf write /org/gnome/desktop/interface/color-scheme "'$COLOR_SCHEME'" 2>/dev/null || true
fi

echo "Done! GTK themes and configurations have been applied to root."

#!/bin/bash

# Set your Expo API token and project ID
source .env

# Get the list of builds for the specified profile
BUILD_LIST=$(eas build:list --platform android --profile "$BUILD_PROFILE")

# Extract status and logs information
BUILD_STATUS=$(echo "$BUILD_LIST" | grep -e "Status")
BUILD_LINKS=$(echo "$BUILD_LIST" | grep -e "Logs")

# Find the first occurrence of "finished" and get the corresponding log link
INDEX=$(echo "$BUILD_STATUS" | grep -n "finished" | head -n 1 | cut -d: -f1)
if [ -n "$INDEX" ]; then
    LOG_LINK=$(echo "$BUILD_LINKS" | sed -n "${INDEX}p" | awk '{print $2}')
    echo "First finished build log link: $LOG_LINK"
else
    echo "No finished build found."
fi

APK_LINK="$LOG_LINK/artifacts/android.apk"

echo "APK_LINK: " $APK_LINK

curl -o client.apk $APK_LINK
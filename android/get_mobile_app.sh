#!/bin/bash

# Set your Expo API token and project ID
EXPO_API_TOKEN="bzObADYPwNH0-jAPHyrRZPLHOu9izawaEvltGy4I"
EXPO_PROJECT_ID="3d0a4bd6-171a-4f16-b017-847cbe2a3178"
BUILD_PROFILE="production"  # Set the desired profile

export EXPO_TOKEN=$EXPO_API_TOKEN

check_build_running() {
    # Run eas build:list command and check if there is any result
    TMP=$(eas build:list --platform android --profile "$BUILD_PROFILE" | grep "in progress")

    if [ -n "$TMP" ]; then
        return 0  # true
    else
        return 1  # false
    fi
}

wait_for_build_to_finish() {
    # Call the check_build_running function and wait for it to return false
    while check_build_running; do
        echo "Build is still running. Waiting..."
        sleep 60  # Wait for 10 seconds before checking again
    done
    echo "Build has finished."
}

wait_for_build_to_finish

# Get the list of builds for the specified profile
BUILD_LIST=$(eas build:list --platform android --profile "$BUILD_PROFILE")

# Extract the ID of the last successful build (you can modify this as needed)
BUILD_ID=$(echo "$BUILD_LIST" | grep -m 1 "Logs" | awk '{print $2}')

# Get the download link (assuming this is part of the response)
BUILD_URL=$(echo "$BUILD_LIST" | grep "$BUILD_ID" -A 1 | grep -oP 'https://expo.dev/artifacts/eas/\S+')

# If URL is found, download the APK
if [ -n "$BUILD_URL" ]; then
    echo "Downloading APK from: $BUILD_URL"
    curl -o client.apk "$BUILD_URL"
else
    echo "No finished build found or download link not found."
fi
#!/usr/bin/env bash

npm install xcode
ionic build
ionic cordova platform remove ios
chmod +x plugins/cordova-plugin-iosrtc/extra/hooks/iosrtc-swift-support.js
ionic cordova platform add ios

ionic build ios
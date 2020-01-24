#!/usr/bin/env bash

ionic build
ionic cordova platform remove ios
chmod +x plugins/cordova-plugin-iosrtc/extra/hooks/iosrtc-swift-support.js
ionic cordova platform add ios

ionic build ios
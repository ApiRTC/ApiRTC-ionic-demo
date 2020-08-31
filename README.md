# ApiRTC P2P call sample on Ionic (Cordova/Angular)

## Installation
First install Ionic:  
`npm install -g @ionic/cli`

[Follow this link to get started with Ionic](https://ionicframework.com/getting-started/) 

### iOS
Install Xcode, see details:
https://ionicframework.com/docs/developing/ios

Then run:  
`ionic cordova prepare ios`

During the execution accept installation requests.

Then run *.xcworkspace Xcode project from `platforms/ios` folder.

Setup certificates inside *Xcode -> Signing & Capabilities* project section.

Then build from Xcode.

[Read more about iOS deploying](https://ionicframework.com/docs/v3/intro/deploying/)

You can test the app with our [web P2P call sample](https://dev.apirtc.com/demo/peertopeer_call/index.html) 

### Android

Install Android Studio, see details:
https://ionicframework.com/docs/developing/android

Install Android platform:  
`ionic cordova platform add android`

Add required permissions to `platforms/android/app/src/main/AndroidManifest.xml`:
```
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
```

Then compile and deploy app to the connected device:  
`ionic cordova run android --device`

You can test the app with our [web P2P call sample](https://dev.apirtc.com/demo/peertopeer_call/index.html) 

## Requirements
Tested on:
- apiRTC 4
- Ionic 5
- iOS: `cordova-ios` 6.1.0
- iOS: `cordova-plugin-iosrtc` 6.0.13
- iOS: Xcode 11.5
- iOS: iOS 13.5
- Android: cordova 9.0.0

The app may work on lower iOS versions, but don't report issues.

## ApiRTC key

For this demo we use `myDemoApiKey` api key. Please register [on our website](https://cloud.apizee.com) to get your private api key.

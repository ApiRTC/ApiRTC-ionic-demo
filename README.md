# ApiRTC P2P call sample on Ionic (Cordova/Angular)

## Installation
You should have installed Ionic:
`npm install -g @ionic/cli`

[Follow this link to get started with ionic](https://ionicframework.com/getting-started/) 

### iOS
You should have Xcode installed:
https://ionicframework.com/docs/developing/ios

Then run:
`ionic cordova prepare ios`

During the execution accept installation requests.

Then run *.xcworkspace Xcode project from `platforms/ios` folder.

[Read more about iOS deploying](https://ionicframework.com/docs/v3/intro/deploying/)

Setup certificates inside Xcode -> Signing & Capabilities project section.

Then build from Xcode.

You can test this app with our [web P2P call sample](https://dev.apirtc.com/demo/peertopeer_call/index.html) 

## Requirements
- Ionic 5+
- iOS: `cordova-ios` 5.1.1+
- iOS: `cordova-plugin-iosrtc` 6.0.11 version temporary fixed due to degradations of its components ([details](https://github.com/cordova-rtc/cordova-plugin-iosrtc/issues/516)). Better check your `package.json` before rebuilding actions to verify you had this fixed version.
- iOS: Xcode 11.5+
- iOS: iOS 13.5+

The app may work on lower versions, but don't report issues.

# ApiRTC key

For this demo we use `myDemoApiKey` api key. Please register [on our website](https://cloud.apizee.com) to get your private api key.

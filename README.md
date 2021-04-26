# ApiRTC P2P call sample on Ionic/Capacitor

## Installation

Install Ionic:  
`npm install -g @ionic/cli`

Then:

`npm i`

[Follow this link to get started with Ionic](https://ionicframework.com/getting-started/) 

## Build

`ionic build`
### iOS

[Read more about iOS deploying](https://capacitorjs.com/docs/ios)

Install Xcode and developer tools, then run:  

`npx cap add ios`

`npx cap sync`

`npx cap open ios`

Setup certificates inside *Xcode -> Signing & Capabilities* project section.

Then build from Xcode.

You can test the app with our [web P2P call sample](https://dev.apirtc.com/demo/peertopeer_call/index.html) 

### Android

[Read more about Android deploying](https://capacitorjs.com/docs/android)

Install Android Studio, then run:

`npx cap add android`

`npx cap sync`

`npx cap open ios`

Then build from Android Studio.

You can test the app with our [web P2P call sample](https://dev.apirtc.com/demo/peertopeer_call/index.html) 

## Requirements

- apiRTC 4.4.10+
- Android 10+ (may work on 8-9 versions)
- iOS 14.5+

## ApiRTC key

For this demo we use `myDemoApiKey` api key. Please register [on our website](https://cloud.apizee.com) to get your private api key.
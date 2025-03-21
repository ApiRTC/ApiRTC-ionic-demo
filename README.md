# ApiRTC on Ionic/Capacitor
<p>
    Welcome on this ionic ApiRTC tutorial.
</p>
<p>
    You will found two uses cases in this application:
</p>
<ul>
    <li>a <b>conference use case</b></li>
    <li>a P2P use case</li>
</ul>
<p>
    We higly recommend to use the conference use case, as it will enable you to have P2P communication but also communication with several paratcipants in the room.
</p>

## ApiRTC key
For this demo we use the ApiKey "myDemoApiKey". Please register on our website to get [your own private ApiKey](https://cloud.apizee.com/register)

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

`npx cap open android`

Then build from Android Studio.

## Demo Usage
Start application on your mobile,
You can switch between the two use cases by clicking on the tabs at the bottom of the screen.

### Conference use case 
Select Tuto Conf, Enter a room name and connect to the room.
Then you can open [apiRTC Conference demo](https://apirtc.github.io/ApiRTC-examples/conferencing_mute_screen/index.html) in the browser of your computer, and connect to the same room.

### P2P use case 
Select Tuto P2P
You can test the app with our [web P2P call sample](https://apirtc.github.io/ApiRTC-examples/peertopeer_call/index.html) 
On application, enter the identifier of your Web page sample and clic on camera button to start a video call.

## Compatibility
- This demo is compatible with iOS 14+ & Android 10+

## Supported Features
Here is the list of demonstrated feature in this application depending on mobile OS :

### Conference use case 
| Feature | Android | iOS | Web
| :---         |     :---:      |     :---:      |     :---:      |
| Audio / video conf   | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Mute audio   | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Mute video   | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Switch camera   | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Screensharing   | :x: | :x: | :white_check_mark: |

### P2P use case 
| Feature | Android | iOS | Web
| :---         |     :---:      |     :---:      |     :---:      |
| Audio / video conf   | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Mute audio   | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Mute video   | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Record     | :white_check_mark: | :white_check_mark: | :white_check_mark: |

## FAQ

### What are the authorizations that are needed to be declared on application

For Android, edit your AndroidManifest.xml file by adding :
```
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.BLUETOOTH" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

For iOS, edit your Info.plist file by adding :
```
    <key>NSCameraUsageDescription</key>
    <string>Camera permission description</string>
    <key>NSMicrophoneUsageDescription</key>
    <string>Microphone permission description</string>
```

### Android SDK

Make sure that you have set ANDROID_HOME value

Sample for mac :
nano ~/.bash_profile
add following lines in bash_profile file:

    export ANDROID_HOME=/Users/YOUR_USER/Library/Android/sdk/  //Path to your Android SDK

    export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

source ~/.bash_profile //To apply modifications

echo $ANDROID_HOME //To check modifications

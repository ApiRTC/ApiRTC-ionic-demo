import {
  IonContent,IonHeader, IonPage, IonTitle, IonToolbar, withIonLifeCycle, IonText, IonIcon,
  IonButton, IonInput, IonRow, IonCol, IonItem, IonSelect, IonSelectOption,
 } from '@ionic/react';
import './TutoConf.css';

import apiRTC, { ConversationCall } from '@apirtc/apirtc';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { cloud, callOutline, micOutline, micOffOutline, videocamOutline, videocamOffOutline, desktopOutline } from 'ionicons/icons';
import { Component } from 'react';

class TutoConf extends Component {

  state = {
    initialized: false,
    connected: 'notconnected',
    onCall: false,
    userId: '',
    roomName: null,
    status: 'init',
    muted: false,
    mutedVideo: false,
    screenShared: false,
  };

  ua: apiRTC.UserAgent | null = null;
  connectedSession: apiRTC.Session | null = null;
  conversation: apiRTC.Conversation | null = null;
  localStream: apiRTC.Stream | null = null;
  applicationUUID: string = ''; // Your application UUID. Your application UUID need to be authorized on your account (https://cloud.apizee.com)
  localStreamIsPublished = false; //Boolean to know if local stream is published
  localScreenIsPublished = false; //Boolean to know if local screen is published
  localScreen : apiRTC.Stream | null = null;
  selectCamera: HTMLSelectElement | null = null;
  selectMic : HTMLSelectElement | null = null;
  call : ConversationCall | undefined  = undefined;
  userDevicesAccessAccepted : boolean = false;

  ionViewWillEnter() {
    console.log('ionViewWillEnter event fired tuto conf');
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave event fired tuto conf');
  }

  async ionViewDidEnter() {
    console.log('ionViewDidEnter event fired tuto conf');

		if (Capacitor.isNativePlatform()) {
			console.log('Capacitor.isNativePlatform()');

      //Getting application UUID on mobile device
			const info = await App.getInfo();
			this.applicationUUID = info.id;

			if (!this.state.initialized) {
				this.initializeApiRTC();
			} else {
				console.log('apiRTC is already initialized :', this.state.initialized);
			}

		} else {
			console.log('NOT Capacitor.isNativePlatform()');

      //On web, applicationUUID will be localhost
      if (!this.state.initialized) {
        this.initializeApiRTC();
      } else {
        console.log('apiRTC is already initialized :', this.state.initialized);
      }
		}
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave event fired tuto conf');
    this.leaveConversationAndReleaseStreams();
		this.unregisterApiRTC();
  }

	unregisterApiRTC() {
		console.log('unregisterApiRTC conf');

		this.ua?.unregister().then(() => {
			// success
			console.log('User agent unregistered conf');
    }).catch((error) => {
      // error
      console.error('User agent unregistration failed', error);
    });

    this.state.initialized = false;
    this.setState({connected: 'disconnected'}); //This will enable render to display correct connexion status
	}


//CODE FOR SELECT_MEDIA
  setListenersOnDeviceSelect() {
    this.selectCamera?.addEventListener("ionChange", (event) => {
      this.createStream();
    });
    this.selectMic?.addEventListener("ionChange", (event) => {
      this.createStream();
    });
  }

  updateDeviceList(mediaDevices) {

    console.log("updateDeviceList :", mediaDevices);
    let i = 0;

    while (this.selectCamera?.firstChild) {
      //Clean camera list
      this.selectCamera.removeChild(this.selectCamera.firstChild);
    }

    for (i = 0; i < Object.values(mediaDevices.videoinput).length; i++) {
        const v = Object.values(mediaDevices.videoinput)[i];
        const option = document.createElement("ion-select-option");
        option.value = v.id;
        option.textContent = v.label;
        this.selectCamera?.appendChild(option);

        if (this.selectCamera && i === 0) {
          //Set first camera as default
          (this.selectCamera as HTMLSelectElement).value = v.id;
        }
    }

    while (this.selectMic?.firstChild) {
      //Clean mic list
      this.selectMic.removeChild(this.selectMic.firstChild);
    }

    for (i = 0; i < Object.values(mediaDevices.audioinput).length; i++) {
      const v = Object.values(mediaDevices.audioinput)[i];
      const option = document.createElement("ion-select-option");
      option.value = v.id;
      option.textContent = v.label;
      this.selectMic?.appendChild(option);

      if (this.selectMic && i === 0) {
        //Set first mic as default
        (this.selectMic as HTMLSelectElement).value = v.id;
      }
    }
  }

  createStreamToRequestUserAccess() {
    console.log("createStreamToRequestUserAccess");
    //Device list cannot be displayed before user accept to share his devices
    //so we create a first stream to request user access to his devices
    //This stream is released immediately after creation

    const createStreamOptions = {
      "constraints": {
          "audio": true,
          "video": true
      },
    };

    this.ua?.createStream(createStreamOptions)
      .then((stream) => {
        this.userDevicesAccessAccepted = true;
        stream.release();
        const mediaDevices = this.ua?.getUserMediaDevices();
        this.updateDeviceList(mediaDevices);
      }).catch((err) => {
        console.error('ua create stream error', err);
      });
  }

  manageMediaDevices() {

    console.log("manageMediaDevices");

    if(this.userDevicesAccessAccepted === false) {
      this.createStreamToRequestUserAccess();
    } else {
      const mediaDevices = this.ua?.getUserMediaDevices();
      console.log("manageMediaDevices :", mediaDevices);
      this.updateDeviceList(mediaDevices);
    }
  }
//CODE FOR SELECT_MEDIA


  initializeApiRTC() {

    console.log('initializeApiRTC tuto conf');

    this.selectCamera = document.getElementById("select-camera") as HTMLSelectElement | null;
    this.selectMic = document.getElementById("select-mic")  as HTMLSelectElement | null;

    this.state.initialized = true;

    apiRTC.setLogLevel(10);

    this.ua = new apiRTC.UserAgent({
			uri: 'apzkey:myDemoApiKey',
    });

    const registerInformation = {
			cloudUrl: 'https://cloud.apizee.com',
      applicationUUID: this.applicationUUID, // Your application UUID is used on register() for authentication
    };

    this.ua
      .register(registerInformation)
      .then((session) => {
        console.log('Tuto Conf : User registered with session Id : ', session.getId());
        this.connectedSession = session;
        this.setState({connected: 'connected'}); //This will enable render to display correct connexion status
      })
      .catch((error) => {
        console.error('User agent registration failed', error);
      });

      this.setListenersOnDeviceSelect();

//CODE FOR SELECT_MEDIA
      this.ua.on("mediaDeviceChanged", (updatedContacts) => {
          console.log("mediaDeviceChanged");
          this.manageMediaDevices();
      });
      this.manageMediaDevices();
//CODE FOR SELECT_MEDIA
  }

  createStream() {
    console.log('createStream');

    if (this.localStream !== null) {
      this.call = this.conversation?.getConversationCall(this.localStream);
      this.localStream.release();
    }

    let createStreamOptions = {
        "constraints": {
            "audio": {
                //"echoCancellation": true,
                //"noiseSuppression": true,
                deviceId: {
                  exact: this.selectMic?.value
                },
            },
            "video": {
              deviceId: {
                exact: this.selectCamera?.value
              },
            }
        },
    };

    const callbacks = {};
    callbacks.getStream = () => {
      return new Promise((resolve, reject) => {
        this.ua?.createStream(createStreamOptions)
          .then((stream) => {
            // Save local stream
            this.localStream = stream;
            try {
              this.localStream?.removeFromDiv('local-stream', 'local-media');
              this.localStream?.addInDiv('local-stream', 'local-media', {}, false);
            } catch (e) {
              console.error('Error remove/addInDiv :', e);
            }
            resolve(stream);
          })
          .catch((err) => {
              console.error('ua create stream error in getStream', err);
              reject();
          });
      });
    };

    if (this.call !== null && this.call !== undefined) {
      //Switch the camera if call is ongoing
      return this.call?.replacePublishedStream(null, callbacks)
          .then((stream) => {
              console.log('replacePublishedStream OK');
              //return stream;
          })
          .catch((err) => {
              console.error('replacePublishedStream NOK');
              //return "error";
          });
    } else {
        return callbacks.getStream();
    }
  }

  joinConversation() {

    this.setState({status: 'onCall'});

    this.createStream().then((stream) => {
          this.conversation?.join()
              .then((response) => {

                let options = {};

                this.conversation?.publish(stream, options)
                  .then(() => {
                    this.localStreamIsPublished = true;
                    console.log('publish OK');
                  })
                  .catch(err => {
                    console.error('Error publish stream :', err);
                  });
              }).catch(err => {
                console.error('Error on createStreamFromUserMedia : ', err);
              });

      }).catch((err) => {
          console.error('create stream error in joinConversation', err);
      });
  }

  setConversationListeners() {

    this.conversation?.on('streamAdded', remoteStream => {
      //setting remote stream video width to 300px
      remoteStream.addInDiv('remote-container', 'remote-media-' + remoteStream.streamId, { width: '300px'}, false);
    });

    this.conversation?.on('streamRemoved', stream => {
      stream.removeFromDiv('remote-container', 'remote-media-' + stream.streamId);
    });

    this.conversation?.on('streamListChanged', streamInfo => {
      if (
        streamInfo.listEventType === 'added' &&
        streamInfo.isRemote === true
      ) {
        this.conversation?.subscribeToStream(streamInfo.streamId)
          .then(() =>
            console.info('Subscribe to stream : ' + streamInfo.streamId),
          )
          .catch(err => {
            console.error('Error on subscribe to stream :', err);
          });
      }
    });

    this.conversation?.on('recordingAvailable', recordingInfo => {
      console.log('recordingInfo :', recordingInfo);
      console.log('recordingInfo.mediaURL :', recordingInfo.mediaURL);
    });
  }

  mute = () => {
    if (this.state.muted === false) {
      console.info('Mute');
      this.localStream?.disableAudio();
      this.setState({muted: true});
    } else {
      console.info('Unmute');
      this.localStream?.enableAudio();
      this.setState({muted: false});
    }
  };

  muteVideo = () => {
    if (this.state.mutedVideo === false) {
      console.info('MuteVideo');
      this.localStream?.disableVideo();
      this.setState({mutedVideo: true});
    } else {
      console.info('UnmuteVideo');
      this.localStream?.enableVideo();
      this.setState({mutedVideo: false});
    }
  };

  screenShare = () => {
    console.log('screenShare');

    const displayMediaStreamConstraints = {
      video: true,
      audio: false,
    };

    apiRTC.Stream.createDisplayMediaStream(displayMediaStreamConstraints, false)
      .then(localScreenShare => {
        console.log('localScreenShare OK');
        this.setState({screenShared: true});
        this.localScreen = localScreenShare;
        localScreenShare.addInDiv('local-stream', 'local-mediascreen', {}, false);

        this.conversation?.publish(localScreenShare)
          .then(() => {
            this.localScreenIsPublished = true;
          })
          .catch(err => {
            console.error('Error on publish stream for screenShare :', err);
          });
      })
      .catch(err => {
        console.error(err);
      });
  };

  onJoinButtonClick = () => {
    console.log('onJoinButtonClick');

    if (this.state.roomName === null || this.state.roomName === '') {
      console.error('Room name is empty');
      return;
    }

    //on video call
    if (this.connectedSession) {
      this.conversation = this.connectedSession.getOrCreateConversation(this.state.roomName);
      this.setConversationListeners();
      this.joinConversation();
    } else {
      console.error(
        'Session is not connected : check your network connection',
      );
    }
  }

  cleanConversationContext = () => {
    this.setState({
      status: 'init',
    });
    this.conversation?.destroy();
    this.conversation = null;
  };

  stopScreenSharingProcess = () => {
    //Stop screen sharing
    this.setState({screenShared: false});
    this.localScreen?.removeFromDiv('local-stream', 'local-mediascreen');

    if (
      this.localScreen &&
      this.localScreen !== null &&
      this.localScreenIsPublished
    ) {
      this.conversation?.unpublish(this.localScreen);
      this.localScreenIsPublished = false;
    }
    this.localScreen?.release();
    this.localScreen = null;
  };

  leaveConversationAndReleaseStreams = () => {
    if (this.localStream && this.localStreamIsPublished) {
      this.conversation?.unpublish(this.localStream);
      this.localStreamIsPublished = false;
    }
    if (this.localStream) {
      this.localStream?.removeFromDiv('local-stream', 'local-media');
      this.localStream.release();
      this.localStream = null;
    }
    //Managing stop screen sharing on the application
    if (this.state.screenShared) {
      this.stopScreenSharingProcess();
      this.localScreen?.release();
      this.localScreen = null;
    }
    this.conversation?.leave()
      .then(() => {
        this.cleanConversationContext();
      })
      .catch(err => {
        console.error('Error on leave conversation :', err);
        this.cleanConversationContext();
      });
  };

  onHangupButtonClick = () => {
    console.log('onHangupButtonClick');
    this.leaveConversationAndReleaseStreams();
  };

  render() {
    function renderApiRTCCnx(ctx) {
      if (ctx.state.connected === 'connected') {
        return (
          <IonRow>
            <IonText>
                {' ApiRTC connection status :'}
                <IonIcon icon={cloud} color="success"></IonIcon>
            </IonText>
          </IonRow>
        );
      } else if (ctx.state.connected === 'reconnecting') {
        return (
          <IonRow>
            <IonText>
                {' ApiRTC connection status :'}
                <IonIcon icon={cloud} color="warning"></IonIcon>
            </IonText>
          </IonRow>
        );
      } else {
        return (
          <IonRow>
            <IonText>
                {' ApiRTC connection status :'}
              <IonIcon icon={cloud} color="danger"></IonIcon>
            </IonText>
          </IonRow>
        );
      }
    }

    function renderPicker(ctx) {
      if (ctx.state.status === 'onCall') {
        return null;
      }
      return (
        <IonRow>
          <IonInput
            id="input-roomName"
            placeholder='Enter room name'
            value = {ctx.state.roomName}
            onIonChange={(e) => {
                console.log('onIonChange e.detail.value:', e.detail.value);
                ctx.state.roomName = e.detail.value;
                //ctx.setState({roomName: e.detail.value});
              }
            }
          ></IonInput>
          <IonButton color='primary' onClick={ctx.onJoinButtonClick}>
            Join
          </IonButton>
        </IonRow>
      );
    }

    function renderSelectDevice(ctx) {
      return (
        <IonItem>
          <IonRow>
            <IonSelect label="Camera :" labelPlacement="fixed" placeholder="Camera 1" id='select-camera'>
              <IonSelectOption value="camera 1">Camera 1</IonSelectOption>
            </IonSelect>
          </IonRow>
        </IonItem>
      );
    }

    function renderSelectMicDevice(ctx) {
      return (
        <IonItem>
          <IonRow>
            <IonSelect label="Microphone :" labelPlacement="fixed" placeholder="Microphone 1" id='select-mic'>
              <IonSelectOption value="camera 1">Microphone 1</IonSelectOption>
            </IonSelect>
          </IonRow>
        </IonItem>
      );
    }

    function renderSelfView(ctx) {
      if (ctx.state.status !== 'onCall' && ctx.localStream === null) {
        return null;
      }
      return (
        <IonRow>
          <IonCol id={'local-stream'} size='3'></IonCol>
        </IonRow>
      );
    }

    function renderRemoteView(ctx) {
      if (ctx.state.status !== 'onCall') {
        return null;
      }
      return (
        <IonRow>
          <IonCol id={'remote-container'} size='3'></IonCol>
        </IonRow>
      );
    }

    function renderMuteButton(ctx) {
      if (ctx.state.muted === false) {
        return (
          <IonButton color='white' onClick={ctx.mute}>
            <IonIcon slot="icon-only" icon={micOutline} color="success"></IonIcon>
          </IonButton>
        );
      }
      return (
        <IonButton color='white' onClick={ctx.mute}>
          <IonIcon slot="icon-only" icon={micOffOutline} color="danger"></IonIcon>
        </IonButton>
      );
    }

    function renderMuteVideoButton(ctx) {
      if (ctx.state.mutedVideo === false) {
        return (
          <IonButton color='white' onClick={ctx.muteVideo}>
            <IonIcon slot="icon-only" icon={videocamOutline} color="success"></IonIcon>
          </IonButton>
        );
      }
      return (
        <IonButton color='white' onClick={ctx.muteVideo}>
          <IonIcon slot="icon-only" icon={videocamOffOutline} color="danger"></IonIcon>
        </IonButton>
      );
    }

    function renderScreenShareButton(ctx) {

      if (Capacitor.isNativePlatform()) {
        //Screensharing is not supported on mobile with ionic/Cordova
        return null;
      }

      if (ctx.state.screenShared === false) {
        return (
          <IonButton color='white' onClick={ctx.screenShare}>
            <IonIcon slot="icon-only" icon={desktopOutline} color="success"></IonIcon>
          </IonButton>
        );
      }
      return (
        <IonButton color='white' onClick={ctx.stopScreenSharingProcess}>
          <IonIcon slot="icon-only" icon={desktopOutline} color="danger"></IonIcon>
        </IonButton>
      );
    }

    function renderCallsButtons(ctx) {
      if (ctx.state.status !== 'onCall') {
        return null;
      }
      return (
        <IonRow>
          {renderMuteButton(ctx)}
          {renderMuteVideoButton(ctx)}
          {renderScreenShareButton(ctx)}

          <IonButton color='white' onClick={ctx.onHangupButtonClick}>
            <IonIcon slot="icon-only" icon={callOutline} color="danger"></IonIcon>
          </IonButton>
        </IonRow>
      );
    }

    return (
      <IonPage>
        <IonHeader>
        <IonToolbar>
          <IonTitle>Conference ApiRTC</IonTitle>
        </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          {renderApiRTCCnx(this)}
          {renderPicker(this)}
          {renderSelectDevice(this)}
          {renderSelectMicDevice(this)}
          {renderRemoteView(this)}
          {renderSelfView(this)}
          {renderCallsButtons(this)}
        </IonContent>
      </IonPage>
    );
  }
};

export default withIonLifeCycle(TutoConf);

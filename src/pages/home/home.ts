import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { ApirtcProvider } from '../../providers/apirtc/apirtc';

declare var iosrtc;
declare var apiCC;
declare var AudioToggle;

const STATE_WAIT = "wait";
const STATE_INCALL = "incall";

const LABEL_CALL = "Call";
const LABEL_HANGOUT = "Hangout";

const COLOR_CALL = "#5cb85c";
const COLOR_HANGOUT = "#d9534f";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  distantNumber:any;
  infoLabel:any;
  buttonLabel:any;
  buttonColor:any;
  state:any;
  
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public platform: Platform, public apirtcProvider:ApirtcProvider) {
    this.refreshVideoView = this.refreshVideoView.bind(this);

    this.sessionReadyHandler = this.sessionReadyHandler.bind(this);
    this.incomingCallHandler.bind(this);
    this.incomingCallHandler = this.userMediaErrorHandler.bind(this);
    this.remoteStreamAddedHandler = this.remoteStreamAddedHandler.bind(this);
    this.hangupHandler = this.hangupHandler.bind(this);
    this.userMediaSuccessHandler =this.userMediaSuccessHandler.bind(this);
    apirtcProvider.events.subscribe('apiRtcSessionReady',this.sessionReadyHandler);
    apirtcProvider.events.subscribe('incomingCallHandler',this.incomingCallHandler);
    apirtcProvider.events.subscribe('userMediaErrorHandler',this.userMediaErrorHandler);
    apirtcProvider.events.subscribe('remoteStreamAddedHandler',this.remoteStreamAddedHandler);
    apirtcProvider.events.subscribe('hangupHandler',this.hangupHandler);
    apirtcProvider.events.subscribe('userMediaSuccessHandler',this.userMediaSuccessHandler);
  }
  sessionReadyHandler(){
    this.buttonColor = COLOR_CALL;
    this.buttonLabel = LABEL_CALL;
    this.infoLabel = "Your local ID : "+apiCC.session.apiCCId;
  }
  /**
   * Call Action
   */
  pushCall() {
    console.log("Push, callState="+this.state);
    if(this.distantNumber && this.state == STATE_WAIT) {
      setTimeout(this.refreshVideoView,4000);
      this.apirtcProvider.getWebRtcClient().call(this.distantNumber);
    } else if(this.state == STATE_INCALL) {
      this.state = STATE_WAIT;
      this.buttonColor = COLOR_CALL;
      this.buttonLabel = LABEL_CALL;
      this.apirtcProvider.getWebRtcClient().hangUp();
    }
  }

  refreshVideoView() {
    if (this.platform.is('ios')) {
      console.log("REFRESH");
      iosrtc.refreshVideos();
    }
  }

  incomingCallHandler(e) {
    console.log("incomingCallHandler");
    this.state = STATE_INCALL;
    this.buttonColor = COLOR_HANGOUT;
    this.buttonLabel = LABEL_HANGOUT;
    setTimeout(this.refreshVideoView,2000);
  }

  hangupHandler(e) {
    console.log("hangupHandler");
    this.state = STATE_WAIT;
    this.buttonColor = COLOR_CALL;
    this.buttonLabel = LABEL_CALL;

    this.initMediaElementState(e.detail.callId);
  }

  userMediaSuccessHandler(e) {
    console.log("userMediaSuccessHandler",e);
    this.apirtcProvider.getWebRtcClient().addStreamInDiv(
      e.detail.stream,
      e.detail.callType,
      "mini",
      'miniElt-' + e.detail.callId,
      {width : "128px", height : "96px"},
      true
    );
  }

  userMediaErrorHandler(e) {
  }

  remoteStreamAddedHandler(e) {
    console.log("remoteStreamAddedHandler",e);
    this.state = STATE_INCALL;
    this.buttonColor = COLOR_HANGOUT;
    this.buttonLabel = LABEL_HANGOUT;
    
    this.apirtcProvider.getWebRtcClient().addStreamInDiv(
      e.detail.stream,
      e.detail.callType,
      "remote",
      'remoteElt-' + e.detail.callId,
      {width : "100%"},
      false
    );
    AudioToggle.setAudioMode(AudioToggle.EARPIECE);
    setTimeout(this.refreshVideoView,100);
  }

  initMediaElementState(callId) {
    this.apirtcProvider.getWebRtcClient().removeElementFromDiv('mini', 'miniElt-' + callId);
    this.apirtcProvider.getWebRtcClient().removeElementFromDiv('remote', 'remoteElt-' + callId);
  }
}

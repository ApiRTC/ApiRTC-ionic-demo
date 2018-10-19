import { Injectable } from '@angular/core';
import {Events} from 'ionic-angular';
import 'rxjs/add/operator/map';
declare var apiRTC;
declare var apiCC;
/*
  Generated class for the ApirtcProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApirtcProvider {
  session: any = null;
  webRtcClient:any=null;
  ApirtcProvider:ApirtcProvider =this;
  constructor( public events:Events ) {
    console.log('Hello ApirtcProvider Provider',events);
    this.apiRTCInit = this.apiRTCInit.bind(this);
    this.apiRTCSessionReadyHandler = this.apiRTCSessionReadyHandler.bind(this);
    this.receiveDataHandler = this.receiveDataHandler.bind(this);
    this.incomingCallHandler = this.incomingCallHandler.bind(this);
    this.userMediaErrorHandler = this.userMediaErrorHandler.bind(this);
    this.userMediaSuccessHandler = this.userMediaSuccessHandler.bind(this);
    this.remoteStreamAddedHandler = this.remoteStreamAddedHandler.bind(this);
    this.hangupHandler = this.hangupHandler.bind(this);
  }
  getWebRtcClient(){
      return this.webRtcClient;
  }
      
  apiRTCInit(){
    console.log('[apiRTCProvider] apiRTCInit',this);
      apiRTC.init({
          onReady: this.apiRTCSessionReadyHandler,
          apiKey: "myDemoApiKey",
          apiCCId : "123456789"
        });
      }
  
      apiRTCSessionReadyHandler(){
          apiRTC.addEventListener("receiveData" , this.receiveDataHandler);
          apiRTC.addEventListener("incomingCall", this.incomingCallHandler);
          apiRTC.addEventListener("userMediaError", this.userMediaErrorHandler);
          apiRTC.addEventListener("remoteStreamAdded", this.remoteStreamAddedHandler);
          apiRTC.addEventListener("userMediaSuccess", this.userMediaSuccessHandler);
          apiRTC.addEventListener("hangup", this.hangupHandler);
          this.webRtcClient = apiCC.session.createWebRTCClient({});
          console.log('[apirtcProvider] this events',this);
          this.ApirtcProvider.events.publish('apiRtcSessionReady');
      }
  
      receiveDataHandler(e){
          console.log('[ApiRtcProvider] incomingcallHandler',e);
          this.ApirtcProvider.events.publish('incomingcallHandler', e);
      }
  
      incomingCallHandler(e) {
          console.log('[ApiRtcProvider] incomingcallHandler',e);
          this.ApirtcProvider.events.publish('incomingCallHandler', e);
      }
  
      userMediaErrorHandler(e){
          console.log('[ApiRtcProvider] userMediaErrorHandler',e);
          this.ApirtcProvider.events.publish('userMediaErrorHandler', e);
      }
  
      remoteStreamAddedHandler(e){
          console.log('[ApiRtcProvider] remoteStreamAddedHandler',e);
          this.ApirtcProvider.events.publish('remoteStreamAdded', e);
      }
  
      userMediaSuccessHandler(e){
          console.log('[ApiRtcProvider] userMediaSuccessHandler',e);
          this.ApirtcProvider.events.publish('userMediaSuccessHandler', e);
      }
      
      hangupHandler(e){
          console.log('[ApiRtcProvider] hangupHandler',e);
          this.ApirtcProvider.events.publish('hangupHandler', e);
      }
}

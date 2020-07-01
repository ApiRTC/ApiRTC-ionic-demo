import { Component } from '@angular/core';
import { Renderer2, ElementRef } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage {
	ua: apiRTC.UserAgent = null;
	connectedSession: apiRTC.Session = null;
	currentCall: apiRTC.Call = null;
	localStream: apiRTC.Stream = null;
    remoteStream: apiRTC.Stream = null;

    onCall: boolean;

	opponentId: any;

	infoLabel: string;

    constructor(private renderer: Renderer2, private elementRef: ElementRef, public platform: Platform) {
        this.onCall = false;
		this.infoLabel = 'Initializing...';
    }

    ngOnInit() {
        const script = this.renderer.createElement('script');
        script.src = 'https://cloud.apizee.com/apiRTC/apiRTC-latest.min.js';
        script.onload = () => {
          console.log('ngOnInit: apiRTC loaded');
          this.startApp(); 
        };
        this.renderer.appendChild(this.elementRef.nativeElement, script);
    }

    startApp() {
        console.log('startApp');

        apiRTC.setLogLevel(10);

        this.ua = new apiRTC.UserAgent({
            uri: 'apzkey:myDemoApiKey',
        });

        var registerInformation = {
            cloudUrl: 'https://cloud.apizee.com',
        };

        this.ua
            .register(registerInformation)
            .then((session) => {
                console.log('User registered with session: ', session);

                session
                    .on('contactListUpdate', (updatedContacts) => {
                        console.log('contactListUpdate', updatedContacts);
                    })
                    .on('incomingCall', (invitation) => {
                        invitation.accept().then((call) => {
                            this.currentCall = call;
                            this.setCallListeners();
                            this.onCall = true;
                        });
                    });
                this.connectedSession = session;
                this.infoLabel = 'Your id: ' + session.getId();
            })
            .catch(function (error) {
                console.error('User agent registration failed', error);
            });
    }

	setCallListeners = () => {
		this.currentCall
			.on('localStreamAvailable', (stream) => {
				console.log('localStreamAvailable', stream);
				this.localStream = stream;
				stream.addInDiv(
					'local-stream',
					'local-media',
					{ height: '150px' },
					false
                );
			})
			.on('streamAdded', (stream) => {
                console.log('streamAdded :', stream);
                this.remoteStream = stream; 
                stream.addInDiv(
                    'remote-stream',
                    'remote-media',
                    { height: '150px' },
                    false
                );
			})
			.on('streamRemoved', (stream) => {
				stream.removeFromDiv(
					'remote-stream',
					'remote-media'
                );
                this.remoteStream = null;
			})
			.on('userMediaError', (e) => {
				console.error('userMediaError detected : ', e);
				console.error('userMediaError detected with error : ', e.error);
			})
			.on('hangup', () => {
                this.clearStreams();
				this.currentCall = null;
				this.onCall = false;
			});
	};

	onClickCall = () => {
		if (!this.opponentId) {
			console.warn('Opponent number is null');
			return;
        }
        if (this.onCall) {
            console.warn('Call is already started');
			return;
        }
		let contact = this.connectedSession.getOrCreateContact(this.opponentId);
		let call = contact.call();
		if (!call) {
			console.warn('Cannot establish the call');
			return;
		}
		this.currentCall = call;
		this.setCallListeners();
		this.onCall = true;
	};

	onClickHangUp = () => {
        this.clearStreams();
		this.currentCall.hangUp();
		this.currentCall = null;
		this.onCall = false;
    };

    clearStreams = () => {
        if (this.localStream) {
            this.localStream.removeFromDiv('local-stream', 'local-media');
        }
        if (this.remoteStream) {
            this.localStream.removeFromDiv('local-stream', 'local-media');
        }
        this.localStream = null;
        this.remoteStream = null;
    }
}

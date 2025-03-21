import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
	IonLabel,
	IonGrid,
	IonRow,
	IonCol,
  IonInput,
  withIonLifeCycle,
  IonText,
  IonIcon
} from '@ionic/react';

import apiRTC from '@apirtc/apirtc';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { cloud } from 'ionicons/icons';

import './TutoP2P.css';

import { Component } from 'react';

class TutoP2P extends Component {

	state = {
		initialized: false,
		connected: 'notconnected',
		onCall: false,
		userId: '',
		calleeId: null,
	};

	ua: apiRTC.UserAgent | null = null;
	connectedSession: apiRTC.Session | null = null;
	currentCall: apiRTC.Call | null = null;
	localStream: apiRTC.Stream | null = null;
	applicationUUID: string = ''; // Your application UUID. Your application UUID need to be authorized on your account (https://cloud.apizee.com)

	constructor(props) {
		console.log('TutoP2P constructor');
		super(props);
	}

	ionViewWillEnter() {
		console.log('ionViewWillEnter event fired tuto P2P');
	}

	ionViewWillLeave() {
		console.log('ionViewWillLeave event fired tuto P2P');
	}

	async ionViewDidEnter() {
		console.log('ionViewDidEnter event fired tuto P2P');

		if (Capacitor.isNativePlatform()) {
			console.log('Capacitor.isNativePlatform()');

			//Getting application UUID on mobile device
			const info = await App.getInfo();
			this.applicationUUID = info.id;

			if (!this.state.initialized) {
				this.initializeApiRTC();
			} else {
				console.error('apiRTC is already initialized :', this.state.initialized);
			}

		} else {
			console.log('NOT Capacitor.isNativePlatform()');

      		//On web, applicationUUID will be localhost
			if (!this.state.initialized) {
				this.initializeApiRTC();
			} else {
				console.error('apiRTC is already initialized :', this.state.initialized);
			}
		}
	}

	ionViewDidLeave() {
		console.log('ionViewDidLeave event fired tuto P2P');
		this.unregisterApiRTC();
	}

	unregisterApiRTC() {
		console.log('unregisterApiRTC P2P');

		this.ua?.unregister().then(() => {
			// success
			console.log('User agent unregistered P2P');
		}).catch((error) => {
			// error
			console.error('User agent unregistration failed', error);
		});

		this.state.initialized = false;
		this.setState({connected: 'disconnected'}); //This will enable render to display correct connexion status
	}

	setUAListeners() {
		this.ua?.on('ccsConnectionStatus', event => {
		  	console.debug('ccsConnectionStatus : ', event);
		  	switch (event.status) {
				case 'connected':
					console.debug('connected : ', event);
					this.setState({connected: 'connected'}); //This will enable render to display correct connexion status
					break;
				case 'retry':
					console.debug('reconnecting : ', event);
					this.setState({connected: 'reconnecting'}); //This will enable render to display correct connexion status
					break;
				case 'disconnected':
					console.debug('disconnect : ', event);
					this.setState({connected: 'disconnect'}); //This will enable render to display correct connexion status
					break;
				case 'error':
					console.debug('error : ', event);
					this.setState({connected: 'disconnect'}); //This will enable render to display correct connexion status
					break;
				default:
					console.log(
						'ccsConnectionStatus not managed case for :',
						event.status,
					);
		  	}
		});
	}

	setCallListeners = () => {
		this.currentCall?.on('localStreamAvailable', (stream) => {
				console.log('localStreamAvailable');
				this.localStream = stream;
				stream.addInDiv('local-stream', 'local-media', {}, false);
			})
			.on('streamAdded', (stream) => {
				console.log('streamAdded :', stream);
				stream.addInDiv('remote-stream', 'remote-media-' + stream.getId(), {}, false);
			})
			.on('streamRemoved', (stream) => {
				console.log('streamRemoved :', stream);
				stream.removeFromDiv('remote-stream', 'remote-media-' + stream.getId());
			})
			.on('userMediaError', (e) => {
				console.error('userMediaError detected : ', e);
				console.error('userMediaError detected with error : ', e.error);
			})
			.on('hangup', () => {
				this.localStream?.removeFromDiv('local-stream', 'local-media');
				this.currentCall = null;
				this.setState({ onCall: false });
			});
	};

	initializeApiRTC() {

		console.log('initializeApiRTC tuto P2P');

		this.state.initialized = true;

		apiRTC.setLogLevel(10);

		this.ua = new apiRTC.UserAgent({
			uri: 'apzkey:myDemoApiKey',
		});

		this.setUAListeners();

		const registerInformation = {
			cloudUrl: 'https://cloud.apizee.com',
      		applicationUUID: this.applicationUUID, // Your application UUID is used on register() for authentication
		};

		this.ua
			.register(registerInformation)
			.then((session) => {
				console.log('Tuto P2P : User registered with session Id: ', session.getId());

				this.setState({connected: 'connected'}); //This will enable render to display correct connexion status

				session
					.on('contactListUpdate', (updatedContacts) => {
						console.log('contactListUpdate', updatedContacts);
					})
					.on('incomingCall', (invitation) => {
						invitation.accept().then((call) => {
							this.currentCall = call;
							this.setCallListeners();
							this.setState({ onCall: true });
						});
					});
				this.connectedSession = session;
				this.setState({ userId: session.getId() });
			})
			.catch((error) => {
				console.error('User agent registration failed', error);
			});
	}

	onCallButtonClick = () => {
		console.log('Call button clicked');
		let calleeId = this.state.calleeId;
		if (!calleeId) {
			console.warn('Callee number is null');
			return;
		}
		let contact = this.connectedSession?.getOrCreateContact(calleeId);
		let call = contact?.call();
		if (!call) {
			console.warn('Cannot establish call');
			return;
		}
		this.currentCall = call;
		this.setCallListeners();
		this.setState({ onCall: true });
	}

	onRecordedCallButtonClick = () => {
		console.log('Recorded Call button clicked');
		let calleeId = this.state.calleeId;
		if (!calleeId) {
			console.warn('Callee number is null');
			return;
		}
		let contact = this.connectedSession?.getOrCreateContact(calleeId);
		let callOptions = {
			record : true
		};
		let call = contact?.call(undefined, callOptions);
		if (!call) {
			console.warn('Cannot establish call');
			return;
		}
		this.currentCall = call;
		this.setCallListeners();
		this.setState({ onCall: true });
	}

	onHangupButtonClick = () => {
		console.log('Hangup button clicked');

		if (this.localStream) {
			this.localStream?.removeFromDiv('local-stream', 'local-media');
			this.localStream.release();
			this.localStream = null;
		  }
		this.currentCall?.hangUp();
		this.currentCall = null;
		this.setState({ onCall: false });
	}

  	render() {
		let button;
		if (!this.state.onCall) {
			button = (
				<IonButton color='primary' onClick={this.onCallButtonClick}>
					Call
				</IonButton>
			);
		} else {
			button = (
				<IonButton color='danger' onClick={this.onHangupButtonClick}>
					Hang Up
				</IonButton>
			);
		}

		let buttonRecord;

		if (!this.state.onCall) {
			buttonRecord = (
				<IonButton color='danger' onClick={this.onRecordedCallButtonClick}>
					Record
				</IonButton>
			);
		}

		function renderApiRTCCnx(ctx) {
			if (ctx.state.connected === 'connected') {
				return (
					<IonText>
				  		{' ApiRTC connection status :'}
				  		<IonIcon icon={cloud} color="success"></IonIcon>
					</IonText>
				);
			} else if (ctx.state.connected === 'reconnecting') {
				return (
					<IonText>
				  		{' ApiRTC connection status :'}
				  		<IonIcon icon={cloud} color="warning"></IonIcon>
					</IonText>
			  	);
			} else {
				return (
					<IonText>
				  		{' ApiRTC connection status :'}
						<IonIcon icon={cloud} color="danger"></IonIcon>
					</IonText>
			  	);
			}
		}

		return (
			<IonPage>
				<IonHeader>
				<IonToolbar>
					<IonTitle>P2P ApiRTC</IonTitle>
				</IonToolbar>
				</IonHeader>
				<IonContent fullscreen>
					{renderApiRTCCnx(this)}
					<IonGrid>
						<IonLabel color='primary'>{'Your id: ' + this.state.userId}</IonLabel>
						<br />
						<IonRow style={{ height: '10px' }}></IonRow>
						<IonInput
							placeholder='Enter number'
							onIonChange={(e) => {
									console.log('onIonChange e.detail.value:', e.detail.value);
									this.setState({calleeId: e.detail.value});
								}
							}
						></IonInput>
						<IonRow style={{ height: '10px' }}></IonRow>
						{button}
						{buttonRecord}
						<IonRow style={{ height: '10px' }}></IonRow>
						<IonRow>
							<IonCol id={'remote-stream'} size='3'></IonCol>
						</IonRow>
						<IonRow>
							<IonCol id={'local-stream'} size='3'></IonCol>
						</IonRow>
					</IonGrid>
				</IonContent>
			</IonPage>
		);
	}
}

export default withIonLifeCycle(TutoP2P);
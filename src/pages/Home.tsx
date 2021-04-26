import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonInput,
	IonButton,
	IonLabel,
	IonGrid,
	IonRow,
	IonCol,
} from '@ionic/react';
import React from 'react';
import './Home.css';

import apiRTC from '@apizee/apirtc';

interface IState {
	onCall: boolean;
	userId: string;
	opponentId: string;
}

export default class Home extends React.Component<{}, IState> {
	ua: apiRTC.UserAgent = null;
	connectedSession: apiRTC.Session = null;
	currentCall: apiRTC.Call = null;
	localStream: apiRTC.Stream = null;

	constructor(props) {
		super(props);

		this.state = {
			onCall: false,
			userId: '',
			opponentId: null,
		};
	}

	async componentDidMount() {
		this.initializeApiRTC();
	}

	initializeApiRTC() {
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
							this.setState({ onCall: true });
						});
					});
				this.connectedSession = session;
				this.setState({ userId: session.getId() });
			})
			.catch(function (error) {
				console.error('User agent registration failed', error);
			});
	}

	onCallButtonClick = () => {
		let opponentId = this.state.opponentId;
		if (!opponentId) {
			console.warn('Opponent number is null');
			return;
		}
		let contact = this.connectedSession.getOrCreateContact(opponentId);
		let call = contact.call();
		if (!call) {
			console.warn('Cannot establish call');
			return;
		}
		this.currentCall = call;
		this.setCallListeners();
		this.setState({ onCall: true });
	};

	setCallListeners = () => {
		this.currentCall
			.on('localStreamAvailable', (stream) => {
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
				this.localStream.removeFromDiv('local-stream', 'local-media');
				this.currentCall = null;
				this.setState({ onCall: false });
			});
	};

	onHangupButtonClick = () => {
		this.localStream.removeFromDiv('local-stream', 'local-media');
		this.currentCall.hangUp();
		this.currentCall = null;
		this.setState({ onCall: false });
	};

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

		return (
			<>
				<IonHeader>
					<IonToolbar>
						<IonTitle>P2P call ApiRTC Ionic sample</IonTitle>
					</IonToolbar>
				</IonHeader>

				<IonRow style={{ height: '20px' }}></IonRow>
				<IonContent>
					<IonGrid>
						<IonLabel color='primary'>{'Your id: ' + this.state.userId}</IonLabel>
						<br />
						<IonRow style={{ height: '30px' }}></IonRow>
						<IonInput
							placeholder='Enter number'
							onIonChange={(e) =>
								this.setState({
									opponentId: e.detail.value,
								})
							}
						></IonInput>
						<IonRow style={{ height: '30px' }}></IonRow>
						{button}
						<IonRow style={{ height: '30px' }}></IonRow>
						<IonRow>
							<IonCol id={'local-stream'} size='3'></IonCol>
							<IonCol id={'remote-stream'} size='3' offset='3'></IonCol>
						</IonRow>
					</IonGrid>
				</IonContent>
			</>
		);
	}
}

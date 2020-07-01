// Type definitions for apiRTC
// Project: apiRTC

declare namespace apiRTC {

    const version: string;

    const ERROR_OTHER: number;
    const ERROR_INVALID_CREDENTIALS: number;
    const ERROR_NETWORK_UNAVAILABLE: number;
    const ERROR_SERVER_UNAVAILABLE: number;
    const ERROR_UNAUTHORIZED: number;
    const ERROR_APIRTC_INITIALISATION_FAILED: number;
    const ERROR_APIRTC_SESSION_ALREADY_ON: number;
    const ERROR_REGISTRATION_URI_INVALID: number;
    const ERROR_NOT_FOUND: number;
    const ERROR_BAD_PARAMETER: number;
    const ERROR_INVITATION_STATE_INVALID: number;
    const ERROR_TIMED_OUT: number;
    const ERROR_STREAM_RECORD: number;
    const ERROR_HTTP: number;
    const ERROR_NOT_ALLOWED: number;
    const ERROR_OPERATION_CANCELED: number;
    const ERROR_WRONG_STATE: number;

    const LOG_LEVEL_OFF: number;
    const LOG_LEVEL_ERROR: number;
    const LOG_LEVEL_WARN: number;
    const LOG_LEVEL_INFO: number;
    const LOG_LEVEL_DEBUG: number;
    const LOG_LEVEL_TRACE: number;

    const CALL_STATUS_WAITING_FOR_CALLEE: Symbol;
    const CALL_STATUS_ENDED: Symbol;
    const CALL_STATUS_ONGOING: Symbol;

    const CONVERSATION_ACCESS_GRANTED: String;
    const CONVERSATION_NEED_MODERATOR_ACCEPTATION: String;

    const CONVERSATION_ROLE_MODERATOR: String;
    const CONVERSATION_ROLE_CONTRIBUTOR: String;
    const CONVERSATION_ROLE_GUEST: String;

    const CONVERSATION_STATUS_JOINED: Symbol;
    const CONVERSATION_STATUS_NOT_JOINED: Symbol;
    const CONVERSATION_STATUS_WAITING: Symbol;
    const CONVERSATION_STATUS_JOINING: Symbol;

    const INVITATION_STATUS_ACCEPTED: Symbol;
    const INVITATION_STATUS_DECLINED: Symbol;
    const INVITATION_STATUS_STANDBY: Symbol;
    const INVITATION_STATUS_EXPIRED: Symbol;

    const STREAM_TYPE_NO_INPUT: String;
    const STREAM_TYPE_AUDIO: String;
    const STREAM_TYPE_VIDEO: String;

    const userAgentInstance: UserAgent;

    const browser: string;
    const browser_version: string;
    const browser_major_version: string;
    const deviceType: string;
    const osName: string;
    const osVersion: string;

    class ApiCCWhiteBoardClient {
        setCanvas(canvasId: string): void;
        getScale(): number;
        setReadOnly(value: boolean): void;
        setScale(factor: number): void;
        getContext(): CanvasRenderingContext2D;
        setBrushColor(color: string): void;
        setBrushSize(value: number): void;
        setFocusOnDrawing(value: boolean): void;
        stop(): void;
        refreshCanvas(): void;
        undo(): void;
        redo(): void;
        printSharedText: (x: number, y: number, text: string, size: number, font: string, border: number) => void;
        redraw(): void;
        setDrawingTool(tool: string): void;
        deactivateTouchScreen(): void;
        activateTouchScreen(): void;
        clearPaper(): void;
        drawElements: any[];
    }

    interface ApiRTCError {
        code: number;
        error: Error;
    }

    interface UserAgentOptions {
        uri?: string;
    }

    interface CreateStreamOptions {
        audioInputId: string|boolean;
        videoInputId: string|boolean;
        constraints?: object;
        enhancedAudioActivated?: boolean;
        facingMode?: string;
    }

    interface NetworkInformation {
        testServer: string;
        httpPing: number;
        upload: any;
        download: any;
    }

    interface RegisterInformation {
        cloudUrl: string;
        id?: string;
        uri?: string;
        ccs?: string;
        mcu?: string;
        password?: string;
        groups?: Array<string>;
        subscribeTo?: Array<string>;
        userData?: object;
    }

    interface DefaultDevices {
        audioInput: MediaDevice;
        audioOutput: MediaDevice;
        videoInput: MediaDevice;
    }

    interface MediaDeviceList {
        audioinput: {[key: string] : MediaDevice;};
        audiooutput: {[key: string] : MediaDevice;};
        videoinput: {[key: string] : MediaDevice;};
    }

    class Observable {
        constructor();
        static getAvailableEvents(): Array<string>;
        on(eventType: string, listener: Function): Observable;
        removeListener(eventType: string, listener: Function): Observable;
    }

    interface GeolocationPositionOptions {
        enableHighAccuracy: boolean;
        timeout: number;
        maximumAge: number;
    }

    type GeolocationCoordonates = {
        latitude: number;
        longitude: number;
        altitude: number;
        accuracy: number;
        altitudeAccuracy: number;
        heading: number;
        speed: number;
    }

    type GeolocationPosition = {
        coords: GeolocationCoordonates;
        timestamp: number;
    }

    type GeolocationPositionError = {
        code: number;
        message: string;
    }

    class UserAgent extends Observable {
        constructor(opts: UserAgentOptions);
        startWhiteboard(canvasId: string, cursorColor: string): ApiCCWhiteBoardClient;
        fetchUserMediaDevices(): Promise<MediaDeviceList>;
        getUserMediaDevices(): MediaDeviceList;
        createStream(opts: CreateStreamOptions): Promise<Stream>;
        createStreamFromMediaStream(MediaStream): Promise<Stream>;
        getDefaultDevices(): DefaultDevices;
        fetchNetworkInformation(testServer: string, bandwidthRatingThresholds : Array<number> ): Promise<NetworkInformation>;
        fetchNetworkInformation_v1(testServer: string, bandwidthRatingThresholds : Array<number> ): Promise<NetworkInformation>;
        fetchNetworkInformation_v2(testServer: string, bandwidthRatingThresholds : Array<number> ): Promise<NetworkInformation>;
        setUserData(userdata: any): void;
        setUsername(username: string): void;
        setPhotoUrl(url: string): void;
        getUserData(): UserData;
        getUsername(): string;
        getPhotoUrl(): string;
        fetchProfileInformation(forceUpdate?: boolean): Promise<object>;
        getEnterprise(): Enterprise;
        getCurrentSession(): Session;
        getEventCenter(): EventCenter;
        register(opts: RegisterInformation): Promise<Session>;
        unregister(): Promise<void>;
        isRegistered(): boolean;
        setTargetBandwidthUsage(kbps: number): void;
        setOverallOutgoingVideoBandwidth(bandwidth: number): void;
        setPerCallOutgoingVideoBandwidth(bandwidth: number): void;
        startWhiteboard(): void;
        stopWhiteboard(): void;
        getWhiteboardClient(): any;
        enableCallStatsMonitoring(enabled: boolean, options?: object): void;
        enableActiveSpeakerDetecting(enabled: boolean, options?: object): void;
        enableMeshRoomMode(enabled: boolean): void;
        fetchGeolocationInformation(positionOptions?: GeolocationPositionOptions): Promise<GeolocationPosition>;
    }

    interface SnapshotOptions {
        filters?: object;
    }

    interface StreamLabels {
        audioSourceLabel?: string;
        videoSourceLabel?: string;
    }

    class Stream extends Observable {
        constructor(data: MediaStream | null, opts: any);
        static createStreamFromUserMedia(audioInput: MediaDevice | null, videoinput: MediaDevice | null, constraints?: object): Promise<Stream>;
        static createScreensharingStream(): Promise<Stream>;
        data: MediaStream;
        streamId: string | number;
        callId: string | number;
        isRemote: boolean;
        publishedInConversations: Map<string, string>;
        callAudioActive: boolean;
        callAudioMuted: boolean;
        callAudioAvailable: boolean;
        callVideoActive: boolean;
        callVideoMuted: boolean;
        callVideoAvailable: boolean;
        getContact(): Contact;
        getData(): MediaStream;
        getConversations(): Array<Contact>;
        isScreensharing(): boolean;
        hasData(): boolean;
        hasAudio(): boolean;
        hasVideo(): boolean;
        isAudioMuted(): boolean;
        isVideoMuted(): boolean;
        getType(): string;
        release(): void;
        releaseAudio(): void;
        releaseVideo(): void;
        muteAudio(): void;
        muteVideo(): void;
        unmuteAudio(): void;
        unmuteVideo(): void;
        attachToElement(element: HTMLElement): void;
        startRecord(): void;
        stopRecord(): Blob;
        enableAudioAnalysis(): void;
        disableAudioAnalysis(): void;
        takeSnapshot(opts?: SnapshotOptions): Promise<string>;
        getLocalStreams(): Stream[];
        getStream(id: string): Stream;
        getOwner(): UserAgent|Contact;
        getLabels(): StreamLabels;
        addInDiv(divId: string, mediaEltId: string, style: object, muted: boolean);
        removeFromDiv(divId: string, mediaEltId: string);
    }

    interface RecordInformation {
        filename: string;
        url: string;
    }

    interface DisconnectOptions {
        invalidateUserToken?: boolean;
    }

    class Session extends Observable {
        constructor(ua: UserAgent, opts?: any);
        getToken(): string;
        getId(): string;
        getUserAgent(): UserAgent;
        getContact(id: string): Contact;
        getOrCreateContact(id: string): Contact;
        getConversation(name: string, opts?: any): Conversation;
        getOrCreateConversation(name: string): Conversation;
        getConference(name: string, opts?: any): Conference;
        getOrCreateConference(name: string, opts?: any): Conversation|Conference;
        getActiveConversations(opts?: any): {[key: string]: Conversation};
        getActiveConferences(opts?: any): {[key: string]: Conference};
        setUserData(userdata: any): void;
        setUsername(username: string): void;
        setPhotoUrl(url: string): void;
        getUserData(): UserData;
        getUsername(): string;
        getPhotoUrl(): string;
        subscribeToGroup(group: string): void;
        unsubscribeToGroup(group: string): void;
        joinGroup(group: string): void;
        leaveGroup(group: string): void;
        disconnect(opts?: DisconnectOptions): Promise<void>;
        getContacts(group: string): {[key: string]: Contact};
        getContactsArray(group: string): [Contact];
        getOnlineContactsArray(group: string):[Contact];
        cloudRequest(url: string, params: object, method: string): Promise<object>;
        sendRawData(contact: Contact, data: object): Promise<void>;
        startRecordingOutgoingStream(mode: string, filename: string): void;
        stopRecordingOutgoingStream(): Promise<RecordInformation>;
        init(id: string): void;
        setMCUServer(server: string): void;
        allowMultipleCalls(v: boolean): void;
        getContactFromWebSession(webSessionId: string): Promise<Contact>;
        getWhiteboardClient(): any;
        getCall(id: string): Call;
        getCalls(): {[key: string]: Call};
        joinPointerSharingRoom(roomId): Promise<PointerSharingRoom>;
        joinConversationSpace(conversationSpace: string): void;
    }

    class MediaDevice {
        constructor(id: string, type: string, label: string);
        id: string;
        getId(): string;
        getType(): string;
        getLabel(): string;
        isCamera(): boolean;
        isMicrophone(): boolean;
        isAudioOutput(): boolean;
    }

    class EventEmitter {
        constructor();
        getListeners(evt: string|RegExp): Function[]|object;
        flattenListeners(listeners: object[]): Function[];
        getListenersAsObject(evt: string|RegExp): object;
        emit(evt: string|RegExp, ...args: any[]): object;
        addListener(evt: string|RegExp, listener: Function): object;
        on(evt: string|RegExp, listener: Function): object;
        addOnceListener(evt: string|RegExp, listener: Function): object;
        once(evt: string|RegExp, listener: Function): object;
        defineEvent(evt: string): object;
        removeListener(evt: string|object|RegExp, listener: Function): object;
        off(evt: string|object|RegExp, listener: Function): object;
        addListeners(evt: string|RegExp, listeners: Function[]): object;
        removeListeners(evt: string|RegExp, listeners: Function[]): object;
        manipulateListeners(remove: boolean, evt: string|RegExp, listeners: Function[]): object;
        removeEvent(evt?: string|RegExp): object;
        removeAllListeners(evt?: string|RegExp): object;
        emitEvent(evt: string|RegExp, args?: Object[]): object;
        trigger(evt: string|RegExp, args?: Object[]): object;
        setOnceReturnValue(value: any): object;
    }

    class EventCenter {
        constructor();
        id: string;
        getStoredData(): object;
        clearStoredData(): void;
        enableConsoleOutput(): void;
    }

    interface UploadOptions {
        title: string;
        description: string;
        type: string;
    }

    interface PrivateConferenceCreationOptions {
        password?: string;
        friendlyName?: string;
    }

    interface EnterpriseInformation {
        id: string;
        name: string;
        logo: string;
        city: string;
        address: string;
        timeRanges: any;
        preferedCCS: string;
        apiKey: string;
        sessionId: number;
    }

    interface fetchEnterpriseInformationOptions {
        id?: string;
        apiKey?: string;
        siteKey?: string;
        cloudUrl?: string;
        convId?: string;
    }

    interface Agent {
        contact: Contact;
        title: string;
        nickname: string;
        isPrefered: boolean;
    }

    interface fetchSiteAgentsOptions {
        usePresence?: boolean;
        useAcd?: boolean;
        cloudUrl?: string;
        convId?: string;
    }

    interface EnterpriseTag {
        id: string;
        name: string;
        selected?: boolean;
    }

    class Enterprise {
        constructor(id: string, apikey: string, session: Session, opts?: object);
        static fetchEnterpriseInformation(options: fetchEnterpriseInformationOptions): Promise<EnterpriseInformation>;
        static fetchSiteAgents(siteKey: string, options: fetchSiteAgentsOptions): Promise<Array<Agent>>;
        getSession(): Session;
        getId(): string;
        getApiKey(): string;
        load(): Promise<void>;
        getContacts():  {[key: string]: Contact};
        uploadFile(file: Blob, opts: UploadOptions): Promise<string>;
        getAvailableConferences(): Promise<{[key: string]: Conference}>;
        getConference(name: string): Promise<Conference>;
        createPrivateConference(opts: PrivateConferenceCreationOptions): Promise<Conference>;
        getTags(conference?: Conference): Promise<Array<EnterpriseTag>>;
    }

    interface CallStats {
        audioSent?: object;
        videoSent?: object;
        audioReceived?: object;
        videoReceived?: object;
        quality?: object;
    }

    interface JoinOptions {
        session?: Session;
        password?: string;
    }

    interface QOSSubscribeOptions {
        videoForbidInactive: boolean;
    }

    interface SubscribeOptions {
        qos?: QOSSubscribeOptions;
        audioOnly?: boolean;
        videoOnly?: boolean;
    }

    interface StreamInfo {
        streamId: number;
        type: string;
        isRemote: boolean;
        contact?: Contact;
        hasAudio: boolean;
        hasVideo: boolean;
        isAudioMuted: boolean;
        isVideoMuted: boolean;
        isScreensharing: boolean;
        isSIP?: boolean;
        descriptor?: object;
        context?: object;
        time: Date;
        listEventType?: string;
    }

    interface CloudMediaInfo {
        url: string;
        id: string;
    }

    interface ConversationMessage {
        content: string;
        sender: Contact;
        time: Date;
        metadata?: object;
    }

    interface ConferenceAccessStatus {
        access: string;
        role: string;
        moderator?: string;
        friendlyName?: string;
    }

    interface PushMediaOptions {
        metadata?: object;
        asFile?: boolean;
    }

    interface PushDataFileDescriptor {
        file: File;
        filename?: string;
        filetype?: string;
        sourceType?: string;
        overwrite?: boolean;
        ttl?: number;
        checksumEnabled?: boolean;
        metadata?: object;
    }

    interface PushDataBufferDescriptor {
        buffer: ArrayBuffer;
        filename: string;
        filetype: string;
        sourceType?: string;
        overwrite?: boolean;
        ttl?: number;
        checksumEnabled?: boolean;
        metadata?: object;
    }

    interface PushDataOptions {
        token?: string;
        session?: Session;
    }

    interface RecordingOptions {
        audioOnly?: boolean;
        videoOnly?: boolean;
        customIdInFilename?: string;
        mode?: string
        labelEnabled?: boolean;
        labels?: Array<string>;
        data?: object;
        ttl?: number;
    }

    interface RecordingInfo {
        roomName: string;
        callId: string;
        recordType: string;
        convId: string;
        mediaId: string;
        mediaURL: string;
        recordedFileName: string;
        audioOnly: boolean;
        videoOnly: boolean;
        mode: string;
        labelEnabled: boolean;
        labels?: Array<string>;
    }

    interface StreamingOptions {
        service?: string;
        server?: string;
        streamKey?: string;
    }

    interface StreamingInfo {
        roomName: string;
        callId: string;
        clientId: string;
    }

    interface QOSPublishOptions {
        videoMinBitrate?: number;
        videoMinQuality?: string;
        videoStartBitrate?: number;
        videoStartQuality?: string;
        videoForbidInactive?: boolean;
    }

    interface PublishOptions {
        turnServerAddress?: string;
        qos?: QOSPublishOptions;
        audioLabels?: string[];
        videoLabels?: string[];
        audioOnly?: boolean;
        videoOnly?: boolean;
        context?: object;
    }

    class ConversationCall extends Observable {
        getConversation(): Conversation;
        getCallId(): string;
        getStream(): Stream;
        isRecorded(): boolean;
        getRecordingInfo(): RecordingInfo|null;
        startRecordingPublishedStream(options?: RecordingOptions): Promise<RecordingInfo>;
        stopRecordingPublishedStream(): Promise<RecordingInfo>;
        replacePublishedStream(newStream?: Stream, callbacks?: any, options?: any): Promise<Stream>;
        isStreamed(): boolean;
        getStreamingInfo(): StreamingInfo|null;
        startStreaming(opts: StreamingOptions): Promise<StreamingInfo>;
        stopStreaming(): Promise<StreamingInfo>;
    }

    class Conversation extends Observable {
        constructor(name: string, opts: any);
        destroy(): void;
        isBound(): boolean;
        bind(opts: object): Promise<string>;
        getStatus(): Symbol;
        getName(): string;
        getData(): any;
        updateData(): Promise<void>;
        setData(data: any): void;
        getCloudConversationId(): string;
        isGroupChatJoined(): boolean;
        joinGroupChat(): Promise<any>;
        leaveGroupChat(): Promise<any>;
        isJoined(): boolean;
        isPublishedStream(s: Stream): boolean;
        startScreensharing(): number;
        stopScreensharing(streamId: number): void;
        publish(s?: Stream, opts?: PublishOptions): Promise<Stream>;
        unpublish(s: Stream, opts?: any): void;
        checkAccess(opts?: object): Promise<ConferenceAccessStatus>;
        join(opts?: JoinOptions): Promise<void>;
        cancelJoin(): boolean;
        leave(): Promise<any>;
        subscribeToMedia(streamId: string, opts?: SubscribeOptions): Promise<Stream>;
        updateSubscribedStream(streamId: string, opts?: SubscribeOptions): Promise<any>;
        unsubscribeToMedia(streamId: string): void;
        getContacts(): {[key: string]: Contact};
        getContactsNumber(): number;
        getAvailableMediaList(): Array<StreamInfo>;
        getAvailableStreamList(): Array<StreamInfo>;
        startNewWhiteboardSession(canvasId: string, cursorColor: string): Promise<void>;
        stopNewWhiteboardSession(): Promise<void>;
        sendData(data: object, opts?: object): Promise<void>;
        sendRawData(data: object, opts?: object): void;
        sendCustomEvent(event: string, content?: any): void;
        sendMessage(msg: string, opts?: object): Promise<number>;
        pushMedia(media: string, opts?: PushMediaOptions): Promise<CloudMediaInfo>;
        pushData(data: PushDataFileDescriptor|PushDataBufferDescriptor, opts?: PushDataOptions): Promise<CloudMediaInfo>;
        cancelPushData(id: string): void;
        fetchMediaList(session: Session, opts: object): Promise<Array<object>>;
        getMessageHistory(): Array<ConversationMessage>;
        sendInvitation(contact: Contact, opts: object): SentInvitation;
        enablePointerSharing(enabled: boolean): Promise<string>;
        getConversationCall(stream: Stream): ConversationCall;
        startRecording(options?: RecordingOptions): Promise<RecordingInfo>;
        stopRecording(): Promise<RecordingInfo>;
        isRecorded(): boolean;
        getRecordingInfo(): RecordingInfo;
        startComposite(): Promise<void>;
        stopComposite(): Promise<void>;
    }

    interface ConferenceInfo {
        dtmfCode: string;
        endTime: number;
        hasPassword: boolean;
        sipNumber: string;
        startTime: number;
        state: string;
        type: string;
    }

    class Conference extends Conversation {
        constructor(name: string, opts: any);
        destroy(): void;
        getRole(): string;
        getFriendlyName(): string;
        sendJoinRequest(session: Session): void;
        getModerator(): Contact;
        getWaitingRoomContacts(): {[key: string]: Contact};
        allowEntry(contact: Contact): void;
        denyEntry(contact: Contact): void;
        getTags(): Promise<Array<EnterpriseTag>>;
        setTags(tags: Array<EnterpriseTag>): Promise<void>;
        getInfo(): Promise<ConferenceInfo>;
    }

    interface WebSessionInfo {
        webSessionId: string;
        conversationId: string;
        siteKey: string;
    }

    interface CallOptions {
        audioOnly?: boolean;
        mediaTypeForOutgoingCall?: String;
        mediaRoutingMode?: String;
        turnServerAddress?: String;
        record?: boolean;
        muted?: String;
        cloudConversationId?: String;
    }

    interface FileInfo {
        name: string;
        type: string;
    }

    class Contact extends Observable {
        constructor(id: string, userData: object, opts?: any);
        getId(): string;
        fetchProfileInformation(forceUpdate?: boolean): Promise<object>;
        getActiveStreams(): Array<Stream>;
        getPreviousMessages(): Array<ConversationMessage>;
        getUsername(): string;
        getUserData(): UserData;
        getPhotoUrl(): string;
        fetchWebSessionInformation(session: Session): Promise<WebSessionInfo>;
        loadMessageHistory(session: Session, opts?: object): Promise<void>;
        inGroup(group: string): boolean;
        isOnline(): boolean;
        sendData(data: object, opts?: object): Promise<void>;
        sendCustomEvent(event: string, content?: any): Promise<void>;
        sendMessage(msg: string, opts?: object): Promise<number>;
        inviteTo(conversation: Conversation, opts?: object): SentInvitation;
        sendWhiteboardInvitation(roomId: string, opts?: object): SentInvitation;
        call(stream?: Stream, opts?: CallOptions): Call;
        startDataChannel(opts?: any): DataChannel;
        sendFile(fileInfo: FileInfo, data: any, opts?: object): SentInvitation;
        pushMedia(media: string, session: Session, opts?: object): Promise<CloudMediaInfo>;
        fetchMediaList(session: Session, opts?: object): Promise<Array<object>>;
        shareScreen(): Call;
    }

    class UserData {
        constructor(data: object);
        get(prop: string): any;
        setToSession(): any;
        setProp(prop: string, value: any): UserData;
        setProps(props: string): UserData;
        static equals(objA: any, objB: any): boolean;
    }

    class CloudApi {
        static get(url: string, params: any, headers?:any): Promise<any>;
        static post(url: string, params: any, onProgress?:void, headers?:any): Promise<any>;
        static put(url: string, params: any, onProgress?:void, headers?:any): Promise<any>;
        static delete(url: string, params: any, headers?:any): Promise<any>;
        static setCloudURL(url: string): any;
    }

    class Call extends Observable {
        constructor(id: string, contact: Contact, opts: any);
        getId(): string;
        getContact(): Contact;
        getStatus(): Symbol;
        getReceivedStreams(): Array<Stream>;
        getPublishedStreams(): Array<Stream>;
        getStats(): CallStats;
        hangUp(): void;
        stopPublishedStreams(opts?: any): Promise<any>;
        replacePublishedStreams(stream: Stream, callbacks: object, opts?: any): Promise<Stream>;
        isRecorded(): boolean;
        getRecordingInfo(): RecordingInfo|null;
        startRecording(): Promise<RecordingInfo>;
        stopRecording(): Promise<RecordingInfo>;
    }

    class DataChannel extends Observable {
        constructor(id: string, contact: Contact, opts: any);
        getId(): string;
        getContact(): Contact;
        getStatus(): Symbol;
        hangUp(): void;
    }

    abstract class Invitation extends Observable {
        constructor(conversation?: Conversation);
        getStatus(): Symbol;
    }

    class SentInvitation extends Invitation {
        constructor(destination: Contact, conversation: Conversation | null, opts?: any);
        onResponse(listener: Function): void;
    }

    abstract class ReceivedInvitation extends Invitation {
        constructor(sender: Contact, conversation: Conversation | null, id: string);
        accept(): Promise<any>;
        decline(reason: string): void;
        getSender(): Contact;
        getReceiveTime(): Date;
        getId(): string;
    }

    class ReceivedConversationInvitation extends ReceivedInvitation {
        constructor(sender: Contact, conversation: Conversation | null, id: string);
        accept(stream?: Stream, options?: JoinOptions): Promise<Conversation>;
    }

    class ReceivedConversationJoinRequest extends ReceivedInvitation {
        constructor(sender: Contact, conversation: Conversation | null, id: string);
        getConversation(): Conversation | null;
    }

    interface AnswerOptions {
        mediaTypeForIncomingCall?: String;
        mediaRoutingMode?: String;
        turnServerAddress?: String;
        muted?: String;
    }

    class ReceivedCallInvitation extends ReceivedInvitation {
        constructor(sender: Contact, id: string, calltype: string);
        accept(stream?: Stream, opts?: AnswerOptions): Promise<Call>;
        getCallType(): string;
        isRecorded(): boolean;
    }

    class ReceivedWhiteboardInvitation extends ReceivedInvitation {
        constructor(sender: Contact, id: string);
        accept(): Promise<string>;
    }

    class ReceivedFileTransferInvitation extends ReceivedInvitation {
        constructor(sender: Contact, id: string, fileinfo: FileInfo);
        accept(): Promise<string>;
        getFileInfo(): FileInfo;
    }

    class ReceivedPointerSharingInvitation extends ReceivedInvitation {
        constructor(sender: Contact, id: string);
        accept(): Promise<PointerSharingRoom>;
    }

    interface PointerSharingRoom {
        getRoomId(): string;
        isActive(): boolean;
        leaveRoom(): Promise<any>;
        invite(contact: Contact, data?: object): Promise<any>;
        sendPointerLocation(source: object, x: number, y: number, data?: object): Promise<any>;
    }

    function setLogLevel(level: number): void;
    const utils: any;
}

//declare var apiRTC2: apiRTC; // Added for retro compatibility

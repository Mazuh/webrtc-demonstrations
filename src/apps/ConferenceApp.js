import React from 'react';
import VertinhoClient from 'vertinho';

export default class ConferenceApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      remoteStream: null,
      clientReady: false,
      loadingCall: false,
      displaying: '',
    };

    this.video = React.createRef();
    this.vertinho = null;
    this.call = null;
  }

  bootstrapClient() {
    if (this.vertinho) {
      return;
    }

    this.vertinho = new VertinhoClient({
      webSocket: {
        url: 'wss://cantina.freeswitch.org/wss2',
        login: '1008@cantina.freeswitch.org',
        password: '1234',
      },
      deviceParams: {
        useMic: 'any',
        useSpeak: 'any',
        useCamera: 'any',
      },
      remoteVideo: true,
      blockSessionRecovery: true,
    }, {
      onClientReady: (feedback) => {
        const reattachedSessions = feedback['reattached_sessions'].length;
        console.log('Client ready, reattaching', reattachedSessions, 'sessions');
        this.setState({ clientReady: true });
      },
      onDisplay: (display) => {
        console.log('Displaying remote video of', display.number);
        this.setState({ loadingCall: false, displaying: display.number });
      },
      onInfo: info => console.log('Info received:', info),
      onCallStateChange: diff => console.log('Call state changed to', diff.current.name),
    });
  }

  componentDidUpdate() {
    this.bootstrapClient();
    this.startCall();

    if (this.state.remoteStream && this.video.current && !this.video.current.srcObject) {
      this.video.current.srcObject = this.state.remoteStream;
    }
  }

  startCall() {
    if (this.state.clientReady && !this.call) {
      this.setState({ loadingCall: true });
      this.call = this.vertinho.makeVideoCall({
        to: '3590',
        from: '1008',
        callerName: 'Vertinho User',
      }, {
        playRemoteVideo: (remoteStream) => {
          this.setState({ remoteStream });
        },
        stopRemoteVideo: () => {
          const { remoteStream } = this.state;
          if (remoteStream) {
            remoteStream.getTracks().forEach(t => t.stop());
            this.setState({ remoteStream: null });
          }
        },
      });
    }
  }

  componentWillUnmount() {
    this.stopCall();
  }

  stopCall() {
    if (this.call) {
      this.call.hangup();
    }
  }

  render() {
    if (this.state.loadingCall) {
      return <p>Carregando chamada...</p>
    }

    return (
      <div>
        {this.state.clientReady
          ? <video
            width={640}
            height={360}
            ref={this.video}
            className="remote-video"
            autoPlay
            playsInline></video>
          : <p>Tentando acessar Vertinho...</p>
        }
      </div>
    );
  }
}

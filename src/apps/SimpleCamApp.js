import React from 'react';

export default class SimpleCamApp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.video = React.createRef();
    this.state = { error: false };
  }

  componentDidMount() {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      this.video.current.srcObject = stream;
    }).catch((error) => {
      this.setState({ error: true });
      console.error('SimpleCallApp', error);
    });
  }

  componentWillMount() {
    const video = this.video.current;

    if (!video || !video.srcObject) {
      return;
    }

    video.srcObject.getTracks().forEach(t => t.stop());
  }

  render() {
    return (
      <React.Fragment>
        <video ref={this.video} playsInline autoPlay></video>
        {this.state.error ? <p>Failed to capture video.</p> : null}
      </React.Fragment>
    );
  }
}

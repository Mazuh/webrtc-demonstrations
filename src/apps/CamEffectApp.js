import React from 'react';
import 'webrtc-adapter';
import 'tracking';
import 'tracking/build/data/face';
import VideoStreamMerger from 'video-stream-merger';
import mask64 from '../assets/mask.png';

const OPTIONS = { width: 426, height: 240, muted: true };

export default class CamEffectApp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.merger = null;
    this.video = React.createRef();
    this.originalVideo = React.createRef();
    this.canvas = React.createRef();
    this.state = { error: false };
  }

  componentDidMount() {
    const originalVideo = this.originalVideo.current;
    const video = this.video.current;
    const canvas = this.canvas.current;
    const context = canvas.getContext('2d');
    const mask = new Image();
    mask.src = mask64;

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      originalVideo.srcObject = stream;

      this.merger = new VideoStreamMerger(OPTIONS);
      this.merger.addStream(stream, OPTIONS);
      const tracker = new window.tracking.ObjectTracker('face');
      tracker.setInitialScale(4);
      tracker.setStepSize(2);
      tracker.setEdgesDensity(0.1);

      window.tracking.track(`#${originalVideo.id}`, tracker, { camera: true });
      let cleaner = null;
      tracker.on('track', (event) => {
        event.data.forEach((face) => {
          if (cleaner) {
            clearInterval(cleaner);
            cleaner = null;
          }

          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(mask, face.x, face.y, face.width, face.height);
          cleaner = setTimeout(() => {
            context.clearRect(0, 0, canvas.width, canvas.height);
          }, 1000);
        });
      });

      this.merger.addStream(canvas.captureStream(), OPTIONS);
      this.merger.start();
      video.srcObject = this.merger.result;
    }).catch((error) => {
      this.setState({ error: true });
      console.error('CamEffectApp', error);
    });
  }

  componentWillUnmount() {
    const merger = this.merger;
    const originalVideo = this.originalVideo.current;
    const video = this.video.current;
    const canvas = this.canvas.current;

    if (!merger || !originalVideo || !video || !canvas) {
      return;
    }

    merger._streams.forEach((streamWrapper) => {
      streamWrapper.element.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
    });

    if (originalVideo.srcObject) {
      originalVideo.srcObject.getTracks().forEach(t => t.stop());
    }
  }

  render() {
    return (
      <React.Fragment>
        <br/>
        <video id="video" ref={this.video} playsInline autoPlay width={OPTIONS.width} height={OPTIONS.height}></video>
        <video id="original-video" style={{visibility: 'hidden', position: 'fixed'}} ref={this.originalVideo} playsInline autoPlay width={OPTIONS.width} height={OPTIONS.height}></video>
        <canvas id="canvas" style={{visibility: 'hidden', position: 'fixed'}} ref={this.canvas} width={OPTIONS.width} height={OPTIONS.height}></canvas>
        {this.state.error ? <p>Failed to capture video.</p> : null}
      </React.Fragment>
    );
  }
}

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable import/extensions */
/**
 * React renderer.
 */
// Import the styles here to process them with webpack
import '_public/style.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ArrowRight } from 'react-feather';
import { desktopCapturer, remote } from 'electron'

async function showSources() {

navigator.mediaDevices.enumerateDevices()
    .then(devices => {
        let audDevice = devices.filter(device => {
            return device.kind == "audiooutput" && device.label == "Soundflower (2ch)" && device.deviceId != "default"
        })[0]
 
        const audioStream = navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId:{exact: audDevice.deviceId}
            }
        })
        console.log(audioStream)
    })
  
  const videoElement = document.querySelector("video")

}

function CloseButton(): JSX.Element {
  function closeWindow() {
    window.close();
  }

  return (
      <div
      className="close"
      onClick={closeWindow}
      />
      );
}

function printer() {
  console.log("HALLO");
}

function AbstractSquare(): JSX.Element {
  return (
      <>
      <div className="abstractSquare topRight" />
      <div className="abstractSquare lowerLeft" />
      </>
      );
}

function GetStartedButton() {
  return (
      <button type="submit" className="startbutton" onClick={showSources}>
      <span>
      start your session
      </span>
      <ArrowRight size={20} color="#FFFFFF" />
      </button>
      );
}

function App(): JSX.Element {
  return (
      <div className="app splashactive">
      <CloseButton />
      <AbstractSquare />
      <div className="splashcontentcontainer">
      <h3 className="slogan">Talk to anyone.</h3>
      <h3 className="slogan">Your way.</h3>
      <GetStartedButton />
      <p className="stream-text">Hello</p>
      <video>Loading</video>
      </div>
      </div>
      );
}

ReactDOM.render(
    <div style={{
width: '100%', height: '100%', margin: 0, overflow: 'hidden',
}}
>
<App />
</div>,
document.getElementById('app'),
);

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
import { ipcRenderer } from 'electron';

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

function AbstractSquare(): JSX.Element {
  return (
    <>
      <div className="abstractSquare topRight" />
      <div className="abstractSquare lowerLeft" />
    </>
  );
}

function GetStartedButton({ onClick }: {onClick: () => void}) {
  return (
    <button type="submit" className="startbutton">
      <span>
        start your session
      </span>
      <ArrowRight size={20} color="#FFFFFF" />
    </button>
  );
}

function TextEnterForm({ onClick }: {onClick: () => void}): JSX.Element {
  let text;
  function handleChange() {

  }

  return (
    <form onSubmit={onClick}>        
      <label>
        Name:
        <input type="text" value={} onChange={this.handleChange} />        
      </label>
      <input type="submit" value="Submit" />  
    </form>
  );
}

function App(): JSX.Element {
  function OnClickSpeak() {
    let text = "Hello, world";
    let speed = 1; // Defaults
    let pitch = 1;
    let filename = "output";
    if (text.length > 1) {
      let options = {
        text: text,
        speed: speed,
        pitch: pitch,
        filename: filename
      };
      ipcRenderer.send("generate-voice", options);
    }
  }

  return (
    <div className="app splashactive">
      <CloseButton />
      <AbstractSquare />
      <div className="splashcontentcontainer">
        <h3 className="slogan">Talk to anyone.</h3>
        <h3 className="slogan">Your way.</h3>
        <GetStartedButton onClick={() => OnClickSpeak()} />
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

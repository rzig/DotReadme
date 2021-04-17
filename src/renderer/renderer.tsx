/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */
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
    <button type="submit" className="startbutton" onClick={onClick}>
      <span>
        start your session
      </span>
      <ArrowRight size={20} color="#FFFFFF" />
    </button>
  );
}

function App(): JSX.Element {
  const [sessionActive, setSessionActive] = React.useState(false);
  const [captionDisplay, setCaptionDisplay] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [captionText, setCaptionText] = React.useState('');

  function addNewText(text: string): void {
    setCaptionText((old) => old + text);
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }

  function startTranscription() {
    setSessionActive(true);
    setTimeout(() => {
      // eslint-disable-next-line no-restricted-globals
      window.resizeTo(screen.width, screen.height);
      // (window as unknown as BrowserWindow).setIgnoreMouseEvents(true);
      setCaptionDisplay(true);
      ipcRenderer.send('set-ignore-mouse-events', true);
      const input1 = 'We begin by finding a linear transformation from any quadrilateral';
      const input2 = ' to the master element, and then computing the Jacobian.';
      let time = 1;
      input1.split(' ').forEach((word) => {
        setTimeout(() => {
          addNewText(`${word} `);
        }, time * 200);
        time += 1;
      });
      input2.split(' ').forEach((word) => {
        setTimeout(() => {
          addNewText(`${word} `);
        }, time * 200);
        time += 1;
      });
    }, 200);
  }

  React.useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={sessionActive ? 'app sessionactive' : 'app splashactive'}>
        <CloseButton />
        <AbstractSquare />
        <div className="splashcontentcontainer">
          <h3 className="slogan">Talk to anyone.</h3>
          <h3 className="slogan">Your way.</h3>
          <GetStartedButton onClick={() => startTranscription()} />
        </div>
      </div>
      <div
        className={captionDisplay ? 'captioncontaineractive' : 'captioncontainerinactive'}
        ref={containerRef}
      >
        <p className="caption">
          {captionText}
        </p>
      </div>
    </>
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

/* eslint-disable jsx-a11y/label-has-associated-control */
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
import { ArrowRight, Check, Settings } from 'react-feather';
import { ipcRenderer } from 'electron';
const {OAuth2Client} = require('google-auth-library');
const recorder = require('node-record-lpcm16');

const authClient = new OAuth2Client('271502938493-17lrho43m7khv4c9kn7afgkimnp9a7l3.apps.googleusercontent.com','OsMMmsG52GMmzyNZcNpkd1qZ', 'https://google.com')
const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient({auth: authClient});
const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';

const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  interimResults: false, // If you want interim results, set this to true
};

const recognizeStream = client
  .streamingRecognize(request)
  .on('error',console.error)
  .on('data', (data: { results: { alternatives: { transcript: any; }[]; }[]; }) =>
    process.stdout.write(
      data.results[0] && data.results[0].alternatives[0]
        ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
        : '\n\nReached transcription time limit, press Ctrl+C\n'
    )
  );

recorder
  .record({
    sampleRateHertz: sampleRateHertz,
    threshold: 0,
    // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
    verbose: false,
    recordProgram: 'sox', // Try also "arecord" or "sox"
    silence: '10.0',
  })
  .stream()
  .on('error', console.error)
  .pipe(recognizeStream);

console.log('Listening, press Ctrl+C to stop.'); 
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

function AbstractSquare({ hidden }: {hidden: boolean}): JSX.Element {
  const extraClass = hidden ? 'hiddenSquare' : '';
  return (
      <>
      <div className={`abstractSquare topRight ${extraClass}`} />
      <div className={`abstractSquare lowerLeft ${extraClass}`} />
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

function SettingsButton({ onClick, visible }: {onClick: () => void, visible: boolean}) {
  const ec = visible ? '' : 'hiddenicon';
  return (
      <button type="submit" className={`settingsicon ${ec}`} onClick={onClick}>
      <Settings size={30} color="#868686" />
      </button>
      );
}

function CheckmarkButton({ onClick, visible }: {onClick: () => void, visible: boolean}) {
  const ec = visible ? '' : 'hiddenicon';
  return (
      <button type="submit" className={`checkicon ${ec}`} onClick={onClick}>
      <Check size={30} color="#868686" />
      </button>
      );
}

type CaptionPosition = 'topleft' | 'topcenter' | 'topright' | 'bottomleft' | 'bottomcenter' | 'bottomright';
type CaptionTextSize = 'small' | 'medium' | 'large';

function App(): JSX.Element {
  const [sessionActive, setSessionActive] = React.useState(false);
  const [captionDisplay, setCaptionDisplay] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [settingsDisplay, setSettingsDisplay] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [captionPosition, setCaptionPosition] = React.useState<CaptionPosition>('topleft');
  const [captionTextSize, setCaptionTextSize] = React.useState<CaptionTextSize>('medium');

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
        }, 200);
  }

  function openSettings() {
    setSettingsOpen(true);
    setTimeout(() => {
        setSettingsDisplay(true);
        }, 200);
  }

  function closeSettings() {
    setSettingsDisplay(false);
    setTimeout(() => {
        setSettingsOpen(false);
        }, 200);
  }

  const extraContainerClass = settingsOpen ? 'contenthidden' : '';
  const extraSettingsClass1 = settingsOpen ? 'settingsvisible' : '';
  const extraSettingsClass2 = settingsDisplay ? 'settingsfade' : '';

  React.useEffect(() => {
      ipcRenderer.on('new-caption-text', (event, words: string[]) => {
          addNewText(words.reduce((i, w) => `${i} ${w}`, ''));
          });
      }, []);

  return (
      <>
      <div className={sessionActive ? 'app sessionactive' : 'app splashactive'}>
      <CloseButton />
      <AbstractSquare hidden={settingsOpen} />
      <SettingsButton onClick={() => openSettings()} visible={!settingsDisplay} />
      <CheckmarkButton onClick={() => closeSettings()} visible={settingsDisplay} />
      <div className={`splashcontentcontainer ${extraContainerClass}`}>
      <h3 className="slogan">Talk to anyone.</h3>
      <h3 className="slogan">Your way.</h3>
      <GetStartedButton onClick={() => startTranscription()} />
      </div>
      <div className={`settingspage ${extraSettingsClass1} ${extraSettingsClass2}`}>
      <h3 className="slogan">Settings</h3>
      <div className="settingsform">
      <div className="formrow">
      <label htmlFor="positions">Caption position</label>
      <select id="positions" value={captionPosition} onChange={(e) => { setCaptionPosition(e.target.value as CaptionPosition); }}>
      <option value="topleft">Top Left</option>
      <option value="topcenter">Top Center</option>
      <option value="topright">Top Right</option>
      <option value="bottomleft">Bottom Left</option>
      <option value="bottomcenter">Bottom Center</option>
      <option value="bottomright">Bottom Right</option>
      </select>
      </div>
      <div className="formrow">
      <label htmlFor="fontsizes">Caption text size</label>
      <select id="fontsizes" value={captionTextSize} onChange={(e) => { setCaptionTextSize(e.target.value as CaptionTextSize); }}>
      <option value="small">Small</option>
      <option value="medium">Medium</option>
      <option value="large">Large</option>
      </select>
      </div>
      </div>
      </div>
      </div>
      <div
      className={`${captionPosition} ${captionDisplay ? 'captioncontaineractive' : 'captioncontainerinactive'}`}
  ref={containerRef}
  >
    <p className={`caption ${captionPosition} ${captionTextSize} `}>
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

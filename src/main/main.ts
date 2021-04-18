/**
 * Entry point of the Election app.
 */
import * as path from 'path';
import * as url from 'url';
// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow, app, ipcMain, webContents } from 'electron';
import * as protos from "@google-cloud/text-to-speech/build/protos/protos";
import { TextToSpeechClient } from "@google-cloud/text-to-speech/build/src/v1/text_to_speech_client";

const Speaker = require('speaker');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');

const speaker = new Speaker({
  channels: 2,          // 2 channels
  bitDepth: 16,         // 16-bit samples
  sampleRate: 44100     // 44,100 Hz sample rate
});

let mainWindow: Electron.BrowserWindow | null;
let client : TextToSpeechClient;

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    maxHeight: 470,
    maxWidth: 325,
    minHeight: 470,
    minWidth: 325,
    maximizable: false,
    height: 470,
    width: 325,
    transparent: true,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
    title: 'DotReadme',
  });

  // and load the index.html of the app.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, './index.html'),
      protocol: 'file:',
      slashes: true,
    }),
  ).finally(() => { /* no action */ });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  initGoogleService();
}

function initGoogleService() {
  client = new textToSpeech.TextToSpeechClient();
}

// Wavenet-F, pitch 1.2, speed 1.0 For female
// Wavenet-D, pitch 1.2, speed 1.0 for male
ipcMain.on('generate-voice', (event, message) => {
  let request : protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
    input: {text: message.text},
    voice: {languageCode: 'en-US', ssmlGender: protos.google.cloud.texttospeech.v1.SsmlVoiceGender.FEMALE},
    audioConfig: {
      audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.LINEAR16,
    },
  };

  makeRequest(request, `${message.filename}.mp3`).then(() => {
    console.log("Success");
  }).catch((err) => {
    console.error("ERROR: ", err);
  });
});

async function makeRequest(request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest, filename: string) {
  console.log(request);
  let final_destination = path.join(app.getPath("downloads"), filename);
  const response = await client.synthesizeSpeech(request);
  const fileWrite = util.promisify(fs.writeFile);
  console.log(response);
  // TODO: This part is where we get binary data response[0].audioContent
  await fileWrite(final_destination, response[0].audioContent, 'binary');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('set-ignore-mouse-events', (event, on: boolean) => {
  // alert(`god it ${on}`);
  BrowserWindow.fromWebContents(event.sender)?.setIgnoreMouseEvents(on);
  BrowserWindow.fromWebContents(event.sender)?.setAlwaysOnTop(true);
});

// eslint-disable-next-line max-len
const input1 = 'We begin by determining a set of linear transformations to map a quadrilateral in R2 to the master element. Then, we compute the Jacobian.';
let time = 1;
input1.split(' ').forEach((word) => {
  setTimeout(() => {
    webContents.getAllWebContents()[0].send('new-caption-text', [word]);
  }, time * 800);
  time += 1;
});

/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * Entry point of the Election app.
 */
import * as path from 'path';
import * as url from 'url';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  BrowserWindow, app, ipcMain, webContents,
} from 'electron';

import { Express } from 'express';

const express = require('express');

let mainWindow: Electron.BrowserWindow | null;

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const server = express() as Express;

  server.get('/', (req, res) => {
    res.send('Hi');
  });

  server.get('/getwords', (req, res) => {
    const { text } = req.query as {text: string};
    const words = text.split(' ');
    webContents.getAllWebContents()[0].send('new-caption-text', words);
    res.send('OK');
  });

  server.listen(3001, () => {
    // pass
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
  BrowserWindow.fromWebContents(event.sender)?.setIgnoreMouseEvents(on);
  BrowserWindow.fromWebContents(event.sender)?.setAlwaysOnTop(true);
});

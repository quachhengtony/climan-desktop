/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  BrowserView,
  webFrame,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
const os = require('os');
const pty = require('node-pty');

let browserViews: Array<BrowserView> = new Array<BrowserView>();
let ptyProcesses: Array<any> = new Array<any>();
let tabIds: Array<number> = new Array<number>();
let activeBrowserView: number = 0;

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1920,
    height: 1080,
    minWidth: 436,
    minHeight: 147,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      zoomFactor: 0.5,
    },
    frame: false,
  });

  // mainWindow.loadURL(resolveHtmlPath('index.html'));
  mainWindow.webContents.loadURL('http://localhost:1212');

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

ipcMain.on('window-closed', () => {
  mainWindow?.close();
});

ipcMain.on('window-restored', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.restore();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.on('window-minimized', () => {
  mainWindow?.minimize();
});

// const sh = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];
const sh = os.platform() === 'win32' ? 'cmd.exe' : 'bash';

ipcMain.on('browserview-create', (event, arg) => {
  activeBrowserView = browserViews.length;
  tabIds[activeBrowserView] = arg;

  browserViews[activeBrowserView] = new BrowserView({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      zoomFactor: 0.5,
    },
  });

  browserViews[activeBrowserView].setBounds({
    x: 0,
    y: 100,
    width: 1920,
    height: 980,
  });

  browserViews[activeBrowserView].setAutoResize({
    width: true,
    height: true,
  });

  browserViews[activeBrowserView].webContents.loadURL(
    `http://localhost:1212/tabs/${tabIds[activeBrowserView]}`
  );

  mainWindow?.setBrowserView(browserViews[activeBrowserView]);

  ptyProcesses[activeBrowserView] = pty.spawn(sh, [], {
    name: 'xterm-color',
    // cols: 80,
    // rows: 30,
    cols: 120,
    rows: 40,
    cwd: process.cwd(),
    env: process.env,
  });

  ptyProcesses[activeBrowserView].on('data', (data) => {
    browserViews[activeBrowserView].webContents.send(
      `terminal${tabIds[activeBrowserView]}-incomingData`,
      data
    );
  });

  ipcMain.on(`terminal${tabIds[activeBrowserView]}-keystroke`, (event, key) => {
    ptyProcesses[activeBrowserView].write(key);
  });
});

ipcMain.on('browserview-switch', async (event, arg) => {
  mainWindow?.setBrowserView(browserViews[arg]);
  activeBrowserView = arg;
});

ipcMain.on('browserview-delete', async (event, arg) => {
  if (browserViews.length > 0) {
    try {
      (browserViews[arg].webContents as any).destroy();
      ptyProcesses[arg].kill();
      tabIds.splice(arg, 1);
    } catch (error) {
      try {
        ptyProcesses[arg].kill('SIGKILL');
      } catch (error) {
        console.log(`>>> Killing ptyProcesses[${arg}] failed.`);
      }
    }
    mainWindow?.setBrowserView(browserViews[arg]);
    activeBrowserView = arg;
  }
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

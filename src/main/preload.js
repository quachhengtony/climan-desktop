const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    on(channel, func) {
      // const validChannels = [
      //   'ipc-example',
      //   'terminal-incomingData',
      //   'terminal-keystroke',
      //   'terminal-incomingData2',
      //   'terminal-keystroke2',
      //   'browserview-create',
      //   'browserview-switch',
      //   'tab-create',
      // ];
      // if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      // ipcRenderer.on(channel, (event, ...args) => func(...args));
      ipcRenderer.on(channel, (...args) => func(...args));
      // }
    },
    once(channel, func) {
      // const validChannels = ['ipc-example'];
      // if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.once(channel, (event, ...args) => func(...args));
      // }
    },
    send(channel, data) {
      ipcRenderer.send(channel, data);
    },
  },
  windowApi: {
    closeWindow() {
      ipcRenderer.send('window-closed');
    },
    restoreWindow() {
      ipcRenderer.send('window-restored');
    },
    minimizeWindow() {
      ipcRenderer.send('window-minimized');
    },
  },
});

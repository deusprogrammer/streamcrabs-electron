const path = require('path');
const fs = require('fs');
const axios = require('axios');

const { app, ipcMain, shell, protocol, BrowserWindow } = require('electron');
const electronOauth2 = require('electron-oauth2');

const { runImageServer } = require('./fileServer');
const { startBot, stopBot } = require('./bot/bot');

const CONFIG_FILE = path.join(__dirname, "config.json");
const USER_DATA_FILE = path.join(__dirname, "config.json");
const REACT_APP_LOCATION = `file://${path.join(__dirname, '../build/index.html')}`
const FILE_SERVER_PORT = "8080";

let isDev = false;
try {
    isDev = require('electron-is-dev');
} catch (e) {
    console.log("Running in production mode using react app at: " + REACT_APP_LOCATION);
}

let config = JSON.parse(fs.readFileSync(CONFIG_FILE).toString());
let userData = JSON.parse(fs.readFileSync(USER_DATA_FILE).toString());
let botRunning = false;
let uiLocked = false;

const uuidv4 = () => {
    return Date.now();
}

const oauthConfig = {
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    authorizationUrl: 'https://id.twitch.tv/oauth2/authorize',
    tokenUrl: 'https://id.twitch.tv/oauth2/token',
    redirectUri: 'http://localhost'
}

const loginWindowParams = {
    alwaysOnTop: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false
    }
  };

const twitchOauth = electronOauth2(oauthConfig, loginWindowParams);

let win;
const createWindow = async () => {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            webSecurity: false,
            preload: path.join(__dirname, "preload.js") // use a preload script
        },
    });

    // and load the index.html of the app.
    // win.loadFile("index.html");
    win.loadURL(
        isDev ? 'http://localhost:3000' :
        REACT_APP_LOCATION
    );

    // win.webContents.setWindowOpenHandler((e, url) => {
    //     e.preventDefault();
    //     shell.openExternal(url);
    // });

    protocol.interceptFileProtocol('app', function (request, callback) {
        let url = request.url.substr(6);
        let dir = path.normalize(path.join(__dirname, '.', url));
        console.log("FILE: " + url);
        console.log("PATH: " + dir);
        callback(dir);
    }, function (err) {
        if (err) {
            console.error('Failed to register protocol');
        }
    });

    // Open the DevTools.
    if (isDev) {
        win.webContents.openDevTools({ mode: 'detach' });
    }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    runImageServer(FILE_SERVER_PORT);
    createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

const getTwitchUser = async (username, accessToken) => {
    let url = `https://api.twitch.tv/helix/users`;
    if (username) {
        url += `?login=${username}`;
    }
    let [{login, profile_image_url}] = (await axios.get(url, {
        headers: {
            "authorization": `Bearer ${accessToken}`,
            "client-id": config.clientId
        }
    })).data.data;

    return {twitchChannel: login, profileImage: profile_image_url};
}

const twitchRefresh = async () => {
    try {
        let token = await twitchOauth.refreshToken(config.refreshToken);
        config.accessToken = token.access_token;
        config.refreshToken = token.refresh_token;
        fs.writeFileSync(CONFIG_FILE, Buffer.from(JSON.stringify(config, null, 5)));
    } catch (e) {
        console.error("Twitch refresh failed: " + e);
    }
}

const twitchLogin = async () => {
    try {
        let token = await twitchOauth.getAccessToken({
            scope: 'chat:read chat:edit channel:read:redemptions channel:read:subscriptions bits:read'
        });
        let {twitchChannel, profileImage} = await getTwitchUser(null, token.access_token);
        config.accessToken = token.access_token;
        config.refreshToken = token.refresh_token;
        config.twitchChannel = twitchChannel;
        config.profileImage = profileImage;
        fs.writeFileSync(CONFIG_FILE, Buffer.from(JSON.stringify(config, null, 5)));
    } catch (e) {
        console.error("Twitch logon failed: " + e);
    }
}

if (config.clientId && config.clientSecret && config.accessToken && config.refreshToken) {
    twitchRefresh();
}

// Bridged functionality

ipcMain.handle('updateUiLock', (event, locked) => {
    uiLocked = locked;
})

ipcMain.handle('getUiLock', () => {
    return uiLocked;
});

ipcMain.handle('startBot', (event) => {
    startBot(config);
});

ipcMain.handle('stopBot', () => {
    stopBot();
});

ipcMain.handle('login', async () => {
    try {
        await twitchLogin();
        return true;
    } catch (e) {
        console.error('Unable to retrieve access token: ' + e);
        return false;
    }
});

ipcMain.handle('storeMedia', (event, {imagePayload, extension}) => {
    let buffer = Buffer.from(imagePayload, "base64");
    let filename = Date.now() + extension;
    let filePath = path.normalize(`${__dirname}/media/${filename}`);
    fs.writeFileSync(filePath, buffer);
    return `/media/${filename}`;
});

ipcMain.handle('updateEnableList', (event, enabled) => {
    config = {...config, enabled};
    fs.writeFileSync(CONFIG_FILE, Buffer.from(JSON.stringify(config, null, 5)));
    return;
});

ipcMain.handle('saveDynamicAlert', (event, dynamicAlert) => {
    if (dynamicAlert.id) {
        config.dynamicAlerts[dynamicAlert.id] = dynamicAlert;
    } else {
        dynamicAlert.id = uuidv4();
        config.dynamicAlerts.push(dynamicAlert);
    }
    fs.writeFileSync(CONFIG_FILE, Buffer.from(JSON.stringify(config, null, 5)));
    return dynamicAlert.id;
});

ipcMain.handle('removeDynamicAlert', (event, dynamicAlert) => {
    delete config.dynamicAlerts[dynamicAlert.id];
    fs.writeFileSync(CONFIG_FILE, Buffer.from(JSON.stringify(config, null, 5)));
    return;
});

ipcMain.handle('updateVideoPool', (event, videoPool) => {
    if (!config.videoPool) {
        config.videoPool = [];
    }
    config.videoPool = videoPool;
    fs.writeFileSync(CONFIG_FILE, Buffer.from(JSON.stringify(config, null, 5)));
    return;
});

ipcMain.handle('updateAudioPool', (event, audioPool) => {
    if (!config.audioPool) {
        config.audioPool = [];
    }
    config.audioPool = audioPool;
    fs.writeFileSync(CONFIG_FILE, Buffer.from(JSON.stringify(config, null, 5)));
    return;
});

ipcMain.handle('updateUserData', (event, update) => {
    userData[update.username] = update.data;
    return;
});

ipcMain.handle('getUserData', (event) => {
    return userData;
});

ipcMain.handle('updateAlert', (event, alertData) => {
    alertData.config.id = parseInt(alertData.config.id);
    config.alertConfigs[alertData.type] = alertData.config;
    fs.writeFileSync(CONFIG_FILE, Buffer.from(JSON.stringify(config, null, 5)));
});

ipcMain.handle('saveCommand', (event, commandConfig) => {
    commandConfig.config.target = parseInt(commandConfig.config.target);
    config.commands[commandConfig.key] = commandConfig.config;
    fs.writeFileSync(CONFIG_FILE, Buffer.from(JSON.stringify(config, null, 5)));
});

ipcMain.handle('removeCommand', (event, key) => {
    delete config.commands[key];
    fs.writeFileSync(CONFIG_FILE, Buffer.from(JSON.stringify(config, null, 5)));
});

ipcMain.handle('getBotConfig', () => {
    return config;
});

ipcMain.handle('getBotRunning', () => {
    return botRunning;
});
const {
    contextBridge,
    ipcRenderer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        send: async (channel, args) => {
            // whitelist channels
            let validChannels = [
                "updateUiLock",
                "getUiLock",
                "startBot", 
                "stopBot", 
                "getBotRunning",
                "restartBot",
                "login",
                "storeMedia",
                "updateEnableList",
                "getDynamicAlert",
                "saveDynamicAlert",
                "removeRaidAlert",
                "updateVideoPool",
                "updateAudioPool",
                "getUserData",
                "updateUserData",
                "updateAlert",
                "getBotConfig",
                "saveCommand",
                "removeCommand"];
            if (validChannels.includes(channel)) {
                return await ipcRenderer.invoke(channel, args);
            } else {
                throw `Invalid channel: ${channel}`;
            }
        }
    }
);
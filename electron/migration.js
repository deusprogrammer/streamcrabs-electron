const fs = require("fs");
const { default: axios } = require("axios");
const path = require("path");

const downloadFile = async (asset, storeTo) => {
    // Download file and write to file
    let response = await axios.get(asset.url,
        {
            responseType: 'arraybuffer',
            headers: {
                'Accept': 'application/octet-stream'
            }
        }
    );
    let localUrl = path.join(storeTo, `${asset._id}.${asset.extension}`);
    fs.writeFileSync(localUrl, response.data);
    return `app://media/${asset._id}.${asset.extension}`;
}

const reorderObjectKeys = (object, order) => {
    let reorderedObject = {};
    for (let key of order) {
        console.log("WRITING " + key);
        reorderedObject[key] = object[key];
    }

    return reorderedObject;
}

module.exports.migrateConfig = async (config) => {
    const DOWNLOAD_DIRECTORY = path.join(__dirname, "media");
    const CONFIG_FILE = path.join(__dirname, "config.json");
    const ORDER = [
        "videoPool",
        "audioPool",
        "imagePool",
        "dynamicAlerts",
        "alertConfigs",
        "redemptions",
        "gauges",
        "commands",
        "config",
        "clientId",
        "clientSecret",
        "twitchChannel",
        "broadcasterId",
        "profileImage",
        "accessToken",
        "refreshToken"
    ];
    let localConfigObject = JSON.parse(fs.readFileSync(CONFIG_FILE).toString());

    // Insert video clips
    for (let asset of config.videoPool) {
        let url = await downloadFile({...asset, extension: 'mp4'}, DOWNLOAD_DIRECTORY);

        let newAsset = {
            ...asset,
            id: asset._id,
            url
        };
        delete newAsset._id;
        if (!localConfigObject.videoPool) {
            localConfigObject.videoPool = [];
        }
        localConfigObject.videoPool.push(newAsset);
    }

    // Insert audio clips
    for (let asset of config.audioPool) {
        let url = await downloadFile({...asset, extension: 'mp3'}, DOWNLOAD_DIRECTORY);

        let newAsset = {
            ...asset,
            id: asset._id,
            url
        };
        delete newAsset._id;
        if (!localConfigObject.audioPool) {
            localConfigObject.audioPool = [];
        }
        localConfigObject.audioPool.push(newAsset);
    }

    // Insert images
    for (let asset of config.imagePool) {
        let url = await downloadFile({...asset, extension: 'gif'}, DOWNLOAD_DIRECTORY);

        let newAsset = {
            ...asset,
            id: asset._id,
            url
        };
        delete newAsset._id;
        if (!localConfigObject.imagePool) {
            localConfigObject.imagePool = [];
        }
        localConfigObject.imagePool.push(newAsset);
    }

    // Insert dynamic alerts
    for (let dynamicAlert of config.dynamicAlerts) {
        let newDynamicAlert = {...dynamicAlert, id: dynamicAlert._id, sprites: []};
        delete newDynamicAlert._id;
        for (let sprite of dynamicAlert.sprites) {
            let url = await downloadFile({...sprite, extension: 'png', url: sprite.file}, DOWNLOAD_DIRECTORY);
            let newSprite = {
                ...sprite,
                id: sprite._id,
                file: url
            };
            delete newSprite._id;
            delete newSprite.url;
            newDynamicAlert.sprites.push(newSprite);
        }

        let url = await downloadFile({...dynamicAlert.music, extension: 'mp3', url: dynamicAlert.music.file}, DOWNLOAD_DIRECTORY);
        let music = {
            ...dynamicAlert.music,
            id: dynamicAlert.music._id,
            file: url
        };
        delete music._id;
        delete music.url;
        newDynamicAlert.music = music;

        url = await downloadFile({...dynamicAlert.leavingSound, extension: 'mp3', url: dynamicAlert.leavingSound.file}, DOWNLOAD_DIRECTORY);
        let leavingSound = {
            ...dynamicAlert.leavingSound,
            id: dynamicAlert.leavingSound._id,
            file: url
        };
        delete leavingSound._id;
        delete leavingSound.url;
        newDynamicAlert.leavingSound = leavingSound;

        localConfigObject.dynamicAlerts.push(newDynamicAlert);
    }

    // Update alerts
    for (let key in config.alertConfigs) {
        if (!localConfigObject.alertConfigs) {
            localConfigObject.alertConfigs = {};
        }

        localConfigObject.alertConfigs[key] = config.alertConfigs[key];
        delete localConfigObject.alertConfigs[key]._id;
    }

    // Update gauges
    for (let key in config.gauges) {
        if (!localConfigObject.gauges) {
            localConfigObject.gauges = {};
        }

        localConfigObject.gauges[key] = {...config.gauges[key]};
        delete localConfigObject.gauges[key]._id;
    }

    return reorderObjectKeys(localConfigObject, ORDER);
}
const EventQueue = require('../components/base/eventQueue');

const alert = async (message, alertType, {variable}, botContext) => {
    const {enabled, type, name, id} = botContext.botConfig.alertConfigs[alertType];

    if (!enabled) {
        return;
    }

    if (type === "DYNAMIC") {
        let raidCustomTheme;
        let raidTheme;
        if (id) {
            raidTheme = "STORED";
            raidCustomTheme = botContext.botConfig.dynamicAlerts.find(dynamicAlert => dynamicAlert.id === id);
        } else {
            raidTheme = name;
        }
        
        EventQueue.sendEvent({
            type,
            targets: ["panel"],
            eventData: {
                results: {},
                message,
                variable,
                raidCustomTheme,
                raidTheme
            }
        });
    } else if (type === "VIDEO") {
        let {url, volume, name, chromaKey} = botContext.botConfig.videoPool.find(video => video.id === id);

        EventQueue.sendEvent({
            type,
            targets: ["panel"],
            eventData: {
                message,
                mediaName: name,
                url,
                chromaKey,
                volume,
                results: {}
            }
        });
    } else if (type === "AUDIO") {
        let {url, volume, name} = botContext.botConfig.audioPool.find(audio => audio.id === id);

        EventQueue.sendEvent({
            type,
            targets: ["panel"],
            eventData: {
                message,
                message,
                mediaName: name,
                url,
                volume,
                results: {}
            }
        });
    }
}

exports.commands = {
    "!test:raid": (twitchContext, botContext) => {
        if (twitchContext.username !== botContext.botConfig.twitchChannel && !twitchContext.mod) {
            throw "Only a mod can test raid";
        }

        this.raidHook({username: "test_user", viewers: 100}, botContext);
    },
    "!test:sub": (twitchContext, botContext) => {
        if (twitchContext.username !== botContext.botConfig.twitchChannel && !twitchContext.mod) {
            throw "Only a mod can test subs";
        }

        this.subscriptionHook({userName: "test_user", subPlan: "tier 3"}, botContext);
    },
    "!test:follow": (twitchContext, botContext) => {
        if (twitchContext.username !== botContext.botConfig.twitchChannel && !twitchContext.mod) {
            throw "Only a mod can test follow";
        }

        throw "This functionality isn't implemented yet";
    },
    "!test:cheer": (twitchContext, botContext) => {
        if (twitchContext.username !== botContext.botConfig.twitchChannel && !twitchContext.mod) {
            throw "Only a mod can test cheer";
        }

        this.bitsHook({bits: 1000, userName: "test_user"}, botContext);
    }
}

exports.init = async (botContext) => {}
exports.bitsHook = async ({bits, userName}, botContext) => {
    const {enabled, messageTemplate} = botContext.botConfig.alertConfigs.cheerAlert;
    const alertMessage = messageTemplate.replace("${bits}", bits).replace("${username}", userName);

    if (!enabled) {
        return;
    }

    await alert([alertMessage], "cheerAlert", {variable: bits}, botContext);
}

exports.subscriptionHook = async ({userName, gifterName, gifteeName, subPlan, isGift}, botContext) => {
    const {enabled, messageTemplate} = botContext.botConfig.alertConfigs.subAlert;
    const alertMessage = messageTemplate.replace("${username}", userName).replace("${subTier}", subPlan);

    if (!enabled) {
        return;
    }

    await alert([alertMessage], "subAlert", {variable: 100}, botContext);
}

exports.raidHook = async ({username, viewers}, botContext) => {
    const {enabled, messageTemplate} = botContext.botConfig.alertConfigs.raidAlert;
    const alertMessage = messageTemplate.replace("${raider}", username).replace("${viewers}", viewers);

    if (!enabled) {
        return;
    }

    await alert([alertMessage], "raidAlert", {variable: viewers}, botContext);
}

exports.redemptionHook = async ({rewardTitle, userName, userId, message}, botContext) => {
    if (rewardTitle.toUpperCase() === "RANDOM SOUND") {
        if (!EventQueue.isPanelInitialized("SOUND_PLAYER")) {
            EventQueue.sendInfoToChat("Sound panel is not available for this stream");
            return;
        }
        let botConfig = botContext.botConfig;
        let enabledAudio = botConfig.audioPool.filter((element) => {
            return element.enabled;
        })
        let n = Math.floor((Math.random() * enabledAudio.length));
        let url = enabledAudio[n].url;
        let mediaName = enabledAudio[n].name;
        let volume = enabledAudio[n].volume;

        if (!volume) {
            volume = 1.0;
        }

        EventQueue.sendEvent({
            type: "AUDIO",
            targets: ["panel"],
            eventData: {
                requester: userName,
                message: [mediaName, userName],
                mediaName,
                url,
                volume,
                results: {}
            }
        });
    }  else if (rewardTitle.toUpperCase() === "RANDOM VIDEO") {
        if (!EventQueue.isPanelInitialized("MULTI")) {
            EventQueue.sendInfoToChat("Video panel is not available for this stream");
            return;
        }

        // let botConfig = await Xhr.getBotConfig(TWITCH_EXT_CHANNEL_ID);
        let botConfig = {};
        let enabledVideos = botConfig.videoPool.filter((element) => {
            return !element.url.startsWith("*");
        })
        let n = Math.floor((Math.random() * enabledVideos.length));
        let url = enabledVideos[n].url;
        let mediaName = enabledVideos[n].name;
        let chromaKey = enabledVideos[n].chromaKey;
        let volume = enabledVideos[n].volume;

        if (!volume) {
            volume = 1.0;
        }

        EventQueue.sendEvent({
            type: "VIDEO",
            targets: ["panel"],
            eventData: {
                requester: userName,
                message: [mediaName, userName],
                mediaName,
                url,
                chromaKey,
                volume,
                results: {}
            }
        });
    } else if (rewardTitle.toUpperCase() === "BIRD UP") {
        if (!EventQueue.isPanelInitialized("MULTI")) {
            EventQueue.sendInfoToChat("Video panel is not available for this stream");
            return;
        }

        EventQueue.sendEvent({
            type: "BIRDUP",
            targets: ["panel"],
            eventData: {
                requester: userName,
                message: ["Bird Up", userName],
                results: {}
            }
        });
    } else if (rewardTitle.toUpperCase() === "BAD APPLE") {
        if (!EventQueue.isPanelInitialized("MULTI")) {
            EventQueue.sendInfoToChat("Video panel is not available for this stream");
            return;
        }

        EventQueue.sendEvent({
            type: "BADAPPLE",
            targets: ["panel"],
            eventData: {
                requester: userName,
                message: ["Bad Apple", userName],
                results: {}
            }
        });
    }
}

exports.wsInitHook = () => {}
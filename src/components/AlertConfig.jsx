import React, { useEffect, useState } from 'react';

const AlertConfigElement = (props) => {
    let mediaSelector = null;
    switch (props.alertConfig.type) {
        case "VIDEO":
            mediaSelector = (
                <React.Fragment>
                    <td>Video:</td>
                    <td>
                        <select value={props.alertConfig.id} onChange={
                            ({target}) => {
                                props.alertConfig.id = target.value;
                                props.onChange(props.alertConfig);
                            }
                        }>
                            <option value="null">Choose Video...</option>
                            {props.botConfig.videoPool.map((video) => {
                                return <option value={video.id}>{video.name}</option>
                            })}
                        </select>
                    </td>
                </React.Fragment>);
            break;
        case "AUDIO":
            mediaSelector = (<React.Fragment>
                <td>Audio:</td>
                <td>
                    <select value={props.alertConfig.id} onChange={
                        ({target}) => {
                            props.alertConfig.id = target.value;
                            props.onChange(props.alertConfig);
                        }
                    }>
                        <option value="null">Choose Audio...</option>
                        {props.botConfig.audioPool.map((audio) => {
                            return <option value={audio.id}>{audio.name}</option>
                        })}
                    </select>
                </td>
            </React.Fragment>);
            break;
        case "DYNAMIC":
            mediaSelector = (<React.Fragment>
                <td>Dynamic:</td>
                <td>
                    <select value={props.alertConfig.id} onChange={
                        ({target}) => {
                            props.alertConfig.id = target.value;
                            props.onChange(props.alertConfig);
                        }
                    }>
                        <option value="null">Choose Dynamic...</option>
                        {props.botConfig.dynamicAlerts.map((raidAlert) => {
                            return <option value={raidAlert.id}>{raidAlert.name}</option>
                        })}
                    </select>
                </td>
            </React.Fragment>);
            break;
    }

    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <td>Enabled:</td>
                        <td><input type="checkbox" checked={props.alertConfig.enabled} onChange={
                            ({target}) => {
                                props.alertConfig.enabled = target.checked;
                                props.onChange(props.alertConfig);
                            }
                        } /></td>
                    </tr>
                    <tr>
                        <td>Alert Type:</td>
                        <td>
                            <select value={props.alertConfig.type} onChange={
                                ({target}) => {
                                    props.alertConfig.type = target.value;
                                    props.onChange(props.alertConfig);
                                }
                            }>
                                <option value="VIDEO">Video</option>
                                <option value="AUDIO">Audio</option>
                                <option value="DYNAMIC">Dynamic</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        {mediaSelector}
                    </tr>
                    <tr>
                        <td>Message Template:</td>
                        <td>
                            <input style={{width: "300px"}} type="text" value={props.alertConfig.messageTemplate} onChange={({target}) => {
                                props.alertConfig.messageTemplate = target.value;
                                props.onChange(props.alertConfig);
                            }} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

const AlertConfig = (props) => {
    const [botConfig, setBotConfig] = useState({alertConfigs: {cheerAlert: {}, subAlert: {}, raidAlert: {}, followAlert:{}}});
    useEffect(async () => {
        let botConfig = await window.api.send("getBotConfig");
        setBotConfig(botConfig);
    }, []);

    return (
        <div>
            <h1>Alert Config</h1>
            <h3>Cheer Alert</h3>
            <AlertConfigElement 
                type="cheer"
                alertConfig={botConfig.alertConfigs.cheerAlert}
                botConfig={botConfig}
                onChange={
                    async (config) => {
                        await window.api.send("updateAlert", {
                            type: "cheerAlert",
                            config
                        });
                        let botConfig = await window.api.send("getBotConfig");
                        setBotConfig(botConfig);
                    }
                } />
            <h3>Subscription Alert</h3>
            <AlertConfigElement 
                type="subscription"
                alertConfig={botConfig.alertConfigs.subAlert}
                botConfig={botConfig}
                onChange={
                    async (config) => {
                        await window.api.send("updateAlert", {
                            type: "subAlert",
                            config
                        });
                        let botConfig = await window.api.send("getBotConfig");
                        setBotConfig(botConfig);
                    }
                } />
            <h3>Follow Alert</h3>
            <AlertConfigElement 
                type="follow"
                alertConfig={botConfig.alertConfigs.followAlert}
                botConfig={botConfig}
                onChange={
                    async (config) => {
                        await window.api.send("updateAlert", {
                            type: "followAlert",
                            config
                        });
                        let botConfig = await window.api.send("getBotConfig");
                        setBotConfig(botConfig);
                    }
                } />
            <h3>Raid Alert</h3>
            <AlertConfigElement 
                type="raid"
                alertConfig={botConfig.alertConfigs.raidAlert}
                botConfig={botConfig}
                onChange={
                    async (config) => {
                        await window.api.send("updateAlert", {
                            type: "raidAlert",
                            config
                        });
                        let botConfig = await window.api.send("getBotConfig");
                        setBotConfig(botConfig);
                    }
                } />
        </div>
    )
};

export default AlertConfig;
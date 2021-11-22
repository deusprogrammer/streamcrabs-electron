import React, { useEffect, useState } from 'react';

const CommandConfig = (props) => {
    const [botConfig, setBotConfig] = useState({videoPool: [], audioPool: []});
    const [commands, setCommands] = useState({});
    const [newCommand, setNewCommand] = useState({key: "", coolDown: "", type: "VIDEO", target: ""});
    useEffect(async () => {
        let botConfig = await window.api.send("getBotConfig");
        setBotConfig(botConfig);
        setCommands(botConfig.commands);
    }, []);

    const updateCommand = (key, field, value) => {
        let temp = {...commands};

        let config = {...temp[key]};
        if (field === '_key') {
            delete temp[key];
            temp[value] = config;
            setCommands(temp);
            return;
        }
        
        config[field] = value;
        temp[key] = config;
        setCommands(temp);
        window.api.send("saveCommand", {
            key,
            config
        });
    };

    const updateNewCommand = (field, value) => {
        let temp = {...newCommand};
        temp[field] = value;
        setNewCommand(temp);
    };

    const removeCommand = (key) => {
        let temp = {...commands};
        delete temp[key];
        setCommands(temp);
        window.api.send("removeCommand", key);
    }

    const addNewCommand = () => {
        let temp = {...commands};
        let key = newCommand.key;
        delete newCommand["key"];
        temp[key] = newCommand;
        setCommands(temp);
        window.api.send("saveCommand", {
            key,
            config: newCommand
        });
        setNewCommand({key: "", coolDown: "", type: "VIDEO", target: ""});
    };

    let options;
    switch(newCommand.type) {
        case "VIDEO":
            options = (
                <React.Fragment>
                    <option value={null}>Choose a Video...</option>
                    {botConfig.videoPool.map((video) => {
                        return <option value={video.id}>{video.name}</option>
                    })}
                </React.Fragment>
            );
            break;
        case "AUDIO":
            options = (
                <React.Fragment>
                    <option value={null}>Choose a Sound...</option>
                    {botConfig.audioPool.map((audio) => {
                        return <option value={audio.id}>{audio.name}</option>
                    })}
                </React.Fragment>
            );
            break;
    }

    return (
        <div>
            <h1>Custom Command Configuration</h1>
            <table className={"command-config-table"}>
                <tbody>
                    {Object.keys(commands).map((key) => {
                        let command = commands[key];
                        let options;
                        switch(command.type) {
                            case "VIDEO":
                                options = (
                                    <React.Fragment>
                                        <option value={null}>Choose a Video...</option>
                                        {botConfig.videoPool.map((video) => {
                                            return <option value={video.id}>{video.name}</option>
                                        })}
                                    </React.Fragment>
                                );
                                break;
                            case "AUDIO":
                                options = (
                                    <React.Fragment>
                                        <option value={null}>Choose a Sound...</option>
                                        {botConfig.audioPool.map((audio) => {
                                            return <option value={audio.id}>{audio.name}</option>
                                        })}
                                    </React.Fragment>
                                );
                                break;
                        }

                        return (
                            <tr>
                                <td><input type="text" placeholder="command" value={key} onChange={({target}) => {updateCommand(key, '_key', target.value)}} /></td>
                                <td><input type="text" placeholder="cooldown" value={command.coolDown} onChange={({target}) => {updateCommand(key, 'coolDown', target.value)}} /></td>
                                <td>
                                    <select value={command.type} onChange={({target}) => {updateCommand(key, 'type', target.value)}}>
                                        <option value="VIDEO">Video</option>
                                        <option value="AUDIO">Audio</option>
                                    </select>
                                </td>
                                <td>
                                    <select value={command.target} onChange={({target}) => {updateCommand(key, 'target', target.value)}}>
                                        {options}
                                    </select>
                                </td>
                                <td><button onClick={() => {removeCommand(key)}}>Delete</button></td>
                            </tr>
                        );
                    })}
                    <tr>
                        <td><input type="text" placeholder="command" value={newCommand.key} onChange={({target}) => {updateNewCommand("key", target.value)}} /></td>
                        <td><input type="text" placeholder="cooldown" value={newCommand.coolDown} onChange={({target}) => {updateNewCommand("coolDown", target.value)}} /></td>
                        <td>
                            <select value={newCommand.type} onChange={({target}) => {updateNewCommand('type', target.value)}}>
                                <option value="VIDEO">Video</option>
                                <option value="AUDIO">Audio</option>
                            </select>
                        </td>
                        <td>
                            <select value={newCommand.target} onChange={({target}) => {updateNewCommand('target', target.value)}}>
                                {options}
                            </select>
                        </td>
                        <td><button onClick={addNewCommand}>Add Command</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default CommandConfig;
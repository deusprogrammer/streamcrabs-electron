import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import { useEffect, useState } from 'react';
import {HashRouter as Router, Route, Routes, Link} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Bot from './components/Bot';
import Home from './components/Home';
import DynamicAlertCustomizer from './components/DynamicAlertCustomizer';
import MediaPoolConfig from './components/MediaPoolConfig';
import DynamicAlertManager from './components/DynamicAlertManager';
import AlertConfig from './components/AlertConfig';
import CommandConfig from './components/CommandConfig';

const EXAMPLE = `{
    ...
    'clientId': '<YOUR CLIENT ID>',
    'clientSecret': '<YOUR CLIENT SECRET>'
}`

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [profileImage, setProfileImage] = useState();
    const [twitchChannel, setTwitchChannel] = useState();
    const [clientId, setClientId] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    useEffect(async () => {
        let {accessToken, refreshToken, profileImage, twitchChannel, clientId, clientSecret} = await window.api.send("getBotConfig");
        setLoggedIn(accessToken && refreshToken);
        setTwitchChannel(twitchChannel);
        setProfileImage(profileImage);
        setClientId(clientId);
        setClientSecret(clientSecret);
    }, []);

    const onLogin = async () => {
        if (await window.api.send('login')) {
            let {accessToken, refreshToken, profileImage, twitchChannel} = await window.api.send('getBotConfig');
            setLoggedIn(accessToken && refreshToken);
            setTwitchChannel(twitchChannel);
            setProfileImage(profileImage);
        }
    }

    if (!clientId || !clientSecret) {
        return (<div className="splash-screen">
            <img className="streamcrab-logo" src={`${process.env.PUBLIC_URL}/crab.png`} /><br />
            <h3>No client id or secret found!</h3>
            <p>If you built this project from Git Hub, please add your Twitch client id and client secret into the config.js like below and then restart the app.</p>
            <pre style={{display: "inline-block", background: "gray", padding: "5px", textAlign: "left"}}>{EXAMPLE}</pre>
        </div>);
    }

    if (!loggedIn) {
        return (
            <div className="splash-screen">
                <img className="streamcrab-logo" src={`${process.env.PUBLIC_URL}/crab.png`} /><br />
                <button onClick={() => onLogin()}>Twitch Login</button>
            </div>
        );
    }

    return (
        <div>
            <ToastContainer />
            <Router>
                <div style={{textAlign: "center"}}>
                    <Link to='/'>Bot</Link> | <Link to='/configs/overlays'>Overlays</Link> | <Link to='/configs/media'>Media Pool</Link>  | <Link to='/configs/commands'>Commands</Link> | <Link to='/configs/alerts'>Alerts</Link> | <Link to='/configs/dynamic-alerts'>Dynamic Alerts</Link>
                </div>
                <div className="profile-image">
                    <img src={profileImage} /><br/>
                    {twitchChannel}
                </div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/configs/overlays" element={<Bot />} />
                    <Route path="/configs/media" element={<MediaPoolConfig />} />
                    <Route path="/configs/alerts" element={<AlertConfig />} />
                    <Route path="/configs/commands" element={<CommandConfig />} />
                    <Route path="/configs/dynamic-alert" element={<DynamicAlertCustomizer />} />
                    <Route path="/configs/dynamic-alerts" element={<DynamicAlertManager />} />
                    <Route path="/configs/dynamic-alert/:id" element={<DynamicAlertCustomizer />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;

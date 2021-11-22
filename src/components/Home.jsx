import React, {useState} from 'react';

const Home = (props) => {
    const [botStarted, setBotStarted] = useState(false);

    const startBot = () => {
        window.api.send(`startBot`);
        setBotStarted(true);
    }

    const stopBot = () => {
        window.api.send(`stopBot`);
        setBotStarted(false);
    }

    return (
        <div className="splash-screen">
            <img className="streamcrab-logo" src={`${process.env.PUBLIC_URL}/crab.png`} /><br />
            {!botStarted ? 
                <button style={{width: "200px", height: "100px", fontSize: "20pt", background: "green", color: "white"}} onClick={startBot}>Start Bot</button> 
                :
                <button style={{width: "200px", height: "100px", fontSize: "20pt", background: "red", color: "white"}} onClick={stopBot}>Stop Bot</button>
            }
        </div>
    )
};

export default Home;
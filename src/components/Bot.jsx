import React from 'react';
export default class Bot extends React.Component {

    render() {
        return (
            <div>
            <h1>Overlays</h1>
            <h2>Panel URLs</h2>
            <p>Bring the below into your XSplit or OBS presentation layouts to show monsters and battle notifications.  It is recommended to place the encounter panel on either side of the screen, and the notification panel on the top or bottom of the screen.</p>
            <div style={{display: "table"}}>
                <div style={{display: "table-row"}}>
                    <div style={{display: "table-cell", padding: "10px", fontWeight: "bolder"}}>Soundboard:</div>
                    <div style={{display: "table-cell", padding: "10px", backgroundColor: "white", color: "black", border: "1px solid gray"}}>{`https://deusprogrammer.com/util/twitch-tools/overlays/sound-player`}</div>
                </div>
                <div style={{display: "table-row"}}>
                    <div style={{display: "table-cell", padding: "10px", fontWeight: "bolder"}}>Animation Overlay:</div>
                    <div style={{display: "table-cell", padding: "10px", backgroundColor: "white", color: "black", border: "1px solid gray"}}>{`https://deusprogrammer.com/util/twitch-tools/overlays/multi`}</div>
                </div>
                <div style={{display: "table-row"}}>
                    <div style={{display: "table-cell", padding: "10px", fontWeight: "bolder"}}>Gauge Overlay:</div>
                    <div style={{display: "table-cell", padding: "10px", backgroundColor: "white", color: "black", border: "1px solid gray"}}>{`https://deusprogrammer.com/util/twitch-tools/overlays/mgauge`}</div>
                </div>
            </div>
        </div>
        )
    }
}
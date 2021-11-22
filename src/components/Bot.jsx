import React from 'react';
export default class Bot extends React.Component {

    render() {
        return (
            <div>
                <h1>Overlay URLs</h1>
                <p>Bring the below into your XSplit or OBS presentation layouts to show monsters and battle notifications.  It is recommended to place the encounter panel on either side of the screen, and the notification panel on the top or bottom of the screen.</p>
                <div style={{display: "table"}}>
                    <div style={{display: "table-row"}}>
                        <div style={{display: "table-cell", padding: "10px", fontWeight: "bolder"}}>Death Counter Panel:</div>
                        <div style={{display: "table-cell", padding: "10px"}}><input type="text" value={`http://localhost:8080/overlays/death-counter`} style={{width: "400px"}} /></div>
                    </div>
                    <div style={{display: "table-row"}}>
                        <div style={{display: "table-cell", padding: "10px", fontWeight: "bolder"}}>Request Panel:</div>
                        <div style={{display: "table-cell", padding: "10px"}}><input type="text" value={`http://localhost:8080/overlays/requests`} style={{width: "400px"}} /></div>
                    </div>
                    <div style={{display: "table-row"}}>
                        <div style={{display: "table-cell", padding: "10px", fontWeight: "bolder"}}>Soundboard:</div>
                        <div style={{display: "table-cell", padding: "10px"}}><input type="text" value={`http://localhost:8080/overlays/sound-player`} style={{width: "400px"}} /></div>
                    </div>
                    <div style={{display: "table-row"}}>
                        <div style={{display: "table-cell", padding: "10px", fontWeight: "bolder"}}>Animation Overlay:</div>
                        <div style={{display: "table-cell", padding: "10px"}}><input type="text" value={`http://localhost:8080/overlays/multi`} style={{width: "400px"}} /></div>
                    </div>
                </div>
            </div>
        )
    }
}
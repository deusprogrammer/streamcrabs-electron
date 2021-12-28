import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';

const DynamicAlertManager = () => {
    let [dynamicAlerts, setDynamicAlerts] = useState([]);
    useEffect(() => {
        (async () => {
            let {dynamicAlerts} = await window.api.send("getBotConfig");
            setDynamicAlerts(dynamicAlerts);
        })()
    }, []);

    return (
        <div>
            <h1>Dynamic Alerts Manager</h1>
            <table>
                <tbody>
                    {dynamicAlerts.map((dynamicAlert) => {
                        console.log("RAID ALERT ID: " + dynamicAlert.id);
                        return (
                            <tr>
                                <td>{dynamicAlert.name}</td>
                                <td>
                                    <Link to={`/configs/dynamic-alert/${dynamicAlert.id}`}><button type="button">Edit</button></Link>
                                    <button onClick={() => {alert("This doesn't function yet")}}>Delete</button>
                                </td>
                            </tr>
                        )
                    })}
                    <tr>
                        <td></td>
                        <td><Link to="/configs/dynamic-alert"><button>New Raid Alert</button></Link></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default DynamicAlertManager;
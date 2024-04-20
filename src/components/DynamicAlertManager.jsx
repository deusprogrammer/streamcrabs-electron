import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import { getBotConfig } from '../api/StreamCrabsApi';

const RaidAlertManager = (props) => {
    let [dynamicAlerts, setDynamicAlerts] = useState([]);

    useEffect(() => {
        (async () => {
            let {dynamicAlerts} = await getBotConfig();
            setDynamicAlerts(dynamicAlerts);
        })()
    }, []);

    return (
        <div>
            <h1>Dynamic Alerts Manager</h1>
            <table className="dynamic-alerts-table">
                <tbody>
                    {dynamicAlerts.map((dynamicAlert) => {
                        return (
                            <tr>
                                <td>{dynamicAlert.name}</td>
                                <td>
                                    <Link to={`/configs/dynamic-alert/${dynamicAlert.id}`}><button className="primary" type="button">Edit</button></Link>
                                    <button className="destructive" onClick={() => {alert("This doesn't function yet")}}>Delete</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Link to={`${process.env.PUBLIC_URL}/configs/dynamic-alert`}><button>Create New Dynamic Alert</button></Link>
        </div>
    )
}

export default RaidAlertManager;
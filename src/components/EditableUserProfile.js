import { useState, useEffect } from 'react';
import Group from './Group';
import { months, calcButtonTextColor } from '../tools';

function renderMonthOptions() {
    return months.getMonths().map( (m, i) => {
        return <option
            key={i}
            value={i}>
            {m.shortName}
        </option>
    });
}

function bound(value, floor, ceil) {
    return Math.min(ceil, Math.max(value, floor));
}

export default function EditableUserProfile({
    stored,
    editCompleteCallback
}) {

    console.log("Edit User Profile");

    const [name, setName] = useState(stored.name);
    const [month, setMonth] = useState(stored.month);
    const [day, setDay] = useState(stored.day);
    const [color, setColor] = useState(stored.color);

    const maxDay = months.getMaxDays(month);

    function handleCancelClicked() {
        editCompleteCallback(null);
    }

    function handleSaveClicked() {
        console.log("Saved");
        editCompleteCallback({name, month, day, color});
    }

    useEffect(() => {
        setDay(bound(day, 1, maxDay));
    }, [month]);

    const buttonStyle = {
        backgroundColor: color,
        color: calcButtonTextColor(color)
    };

    calcButtonTextColor(color);

    return( <>
        <div className="row">
            <div className="col-3"><h4>Name:</h4></div>
            <div className="col-9">
                <input
                className="form-text"
                type='text'
                value={name}
                onChange={e => setName(e.target.value)} /> </div>
        </div>
        <div className="row">
            <div className="col-3"><h4>Birthday:</h4></div>
            <div className="col-4">
                <select
                value={month}
                onChange={e => setMonth(bound(e.target.value, 0, 11))}>
                {renderMonthOptions()}
            </select>
            </div>
            <div className="col-4">
                <input
                type='number'
                value={day}
                onChange={e => setDay(bound(e.target.value, 1, maxDay))}
                style={{width: "50px"}}
            />
            </div>
        </div>
        <div className="row">
            <div className="col-3"><h4>Fav Color:</h4></div>
            <div className="col-9">
                <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                />
            </div>
        </div>
        <div className="row">
            <button style={buttonStyle} className="btn" onClick={handleSaveClicked}>Save</button>
            <button style={buttonStyle} className="btn" onClick={handleCancelClicked}>Cancel</button>
        </div>
    </>)
}
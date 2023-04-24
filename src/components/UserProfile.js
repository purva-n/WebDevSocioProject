import Group from './Group';
import ColorBox from './ColorBox';
import { months, calcButtonTextColor } from '../tools';

export default function UserProfile({
    stored,
    state,
    startEditCallback
}) {

    const buttonStyle = {
        backgroundColor: stored.color,
        color: calcButtonTextColor(stored.color)
    };

    return ( <div>
        <div className="row">
            <div className="col-3"><h5>Name:</h5></div>
            <div className="col-9 h5">{stored.name}</div>
        </div>
        <div className="row">
            <div className="col-3"><h5>Birthday:</h5></div>
            <div className="col-9 h5">{months.getShortName(stored.month)} {stored.day} </div>
        </div>
        <div className="row">
            <div className="col-3"><h5>Fav Color:</h5></div>
            <ColorBox className="col-8 h5" color={stored.color}/>
        </div>
        <div className="row">
            { state.username === state.postusername ? (
                    <button
                        className="btn btn-primary"
                        style={buttonStyle}
                        onClick={startEditCallback}>Edit</button>
                ) :(<></>)
            }
        </div>
    </div>);
}
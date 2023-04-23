import { useState, useEffect } from 'react';
import './Profile.css';
import '../App.css';
import EditableUserProfile from '../components/EditableUserProfile';
import UserProfile from '../components/UserProfile';
import logo from '../images/title.png';
import { useLocation } from 'react-router-dom'
import  {db, auth}  from '../firebase'
import ProfileUpload from '../ImageUpload/ProfileUpload';
import { useNavigate } from 'react-router-dom';

function randomColor() {
    return "#" + Math.floor(Math.random()*16777215).toString(16);
}

function Profile() {
    const navi= useNavigate();
    const now = new Date(Date.now());
    const defaultBirthday = new Date(now.getTime() + 86400000);
    const {state} = useLocation();
    console.log(state)
    const username = state.postusername;
    const myusername = state.username;
    const [editMode, setEditMode] = useState(false);

    const [name, setName] = useState(username);
    const [month, setMonth] = useState(defaultBirthday.getMonth());
    const [day, setDay] = useState(defaultBirthday.getDate());
    const [color, setColor] = useState(randomColor());
    const [imageUrl, setImageUrl] = useState('');

    const stored = {name, month, day, color};

    useEffect(() => {

          db.collection('profile').where('username', '==', username).get()
                .then(doc => {
                    setImageUrl(doc.imageUrl);
          });
     });

    function handleEditComplete(result) {
        console.log("handleEditComplete", result);
        if (result != null) {
            setName(result.name);
            setMonth(result.month);
            setDay(result.day);
            setColor(result.color);
        }        
        setEditMode(false);
    }
    
    return (
        <div style={{backgroundColor: "powderblue"}}>
            <div className="container">
                {/* Header */}
                <div className='app__header'>
                    <img onClick={()=>{navi("*")}}
                         className='app_headerImage'
                         src={logo}
                         alt='header'
                    />
                </div>

                <div className="Profile">

                    <div className="row" style={{backgroundColor: "powderblue"}}><center className="h2">Profile Info</center></div>
                    <div className="mt-2">
                        {editMode
                            ? <>

                                <EditableUserProfile
                                    stored={stored}
                                    editCompleteCallback={handleEditComplete}
                                />
                            </>
                            : <>
                                <UserProfile
                                    stored={stored}
                                    state={state}
                                    startEditCallback={() => setEditMode(true)}
                                />
                            </>
                        }
                    </div>

                    <div className="row">
                        <div className="col-6"><h5>Profile Picture</h5></div>
                        <div className="col-6"><img className='post__image' src = {imageUrl} /></div>
                    </div>
                    {
                        username === myusername ? (
                            <ProfileUpload className="uploader" username={username}/>
                        ) : (
                            <></>
                        )
                    }
                </div>
            </div>
        </div>

    );
}

export default Profile;
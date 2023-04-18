import { useState, useEffect } from 'react';
import './Profile.css';
import '../App.css';
import EditableUserProfile from '../components/EditableUserProfile';
import UserProfile from '../components/UserProfile';
import logo from '../images/title.png';
import { useLocation } from 'react-router-dom'
import  {db, auth}  from '../firebase'
import ProfileUpload from '../ImageUpload/ImageUpload';
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
    const user = state.username;
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
                {
                    
                    editMode
                        ? <>
                            <h1>My Profile</h1>
                            <EditableUserProfile
                                    stored={stored}
                                    editCompleteCallback={handleEditComplete}                            
                            />
                        </>
                        : <>
                            <UserProfile
                                    stored={stored}
                                    startEditCallback={() => setEditMode(true)}
                            />
                        </>
                }
                <h2>Profile Picture</h2><img className='post__image' src = {imageUrl} />
                <ProfileUpload className="uploader" username={username}/>
            </div>
        </div>
    );
}

export default Profile;
import React, { useState, useEffect } from 'react';
import './Profile.css';
import '../App.css';
import EditableUserProfile from '../components/EditableUserProfile';
import UserProfile from '../components/UserProfile';
import logo from '../images/socio.png';
import { useLocation } from 'react-router-dom'
import  {db, auth}  from '../firebase'
import ProfileUpload from '../ImageUpload/ProfileUpload';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from "use-local-storage";

function randomColor() {
    return "#" + Math.floor(Math.random()*16777215).toString(16);
}

function Profile() {
    const navi= useNavigate();
    const now = new Date(Date.now());
    const defaultBirthday = new Date(now.getTime() + 86400000);
    const {state} = useLocation();
    console.log(state);
    const username = state.postusername;
    const myusername = state.username;
    const [editMode, setEditMode] = useState(false);

    const [name, setName] = useState(username);
    const [month, setMonth] = useState(defaultBirthday.getMonth());
    const [day, setDay] = useState(defaultBirthday.getDate());
    const [color, setColor] = useState(randomColor());
    const [imageUrl, setImageUrl] = useState('');
    const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'dark' : 'light');
    const switchTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }

    const stored = {name, month, day, color};

    useEffect(() => {
          db.collection('profile').where('username', '==', username).get()
                .then(doc => {
                    doc.forEach((docu) => {
                        setImageUrl(docu.get('imageUrl'));
                    })
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
            <div className="profile-app">
                {/*Header*/}
                <div className="app__header">
                    <img className="logo-img-component" src={logo} alt="header image"/>
                </div>

                <div className="container home-page-top">
                    <div className='row'>
                        <div className="col-md-2 app__loginContainer">
                            <div className="btn-group-vertical ">
                                <button
                                    type="button"
                                    className={`btn btn-outline-info ${
                                        theme === "light" ? "btn-outline-dark" : "btn-outline-light"
                                    }`}
                                    onClick={()=>{navi("*")}}>
                                    Home</button>
                                <button
                                    type="button"
                                    className={`btn btn-outline-info ${
                                        theme === "light" ? "btn-outline-dark" : "btn-outline-light"
                                    }`}
                                    onClick={() => {auth.signOut(); navi("*")}}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                        <div className="col-8 Profile">
                            <div className="row" style={{backgroundColor: '#B0E0E6FF'}}><center className="h2">Profile Info</center></div>
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
                                <img className='profile__img align-items-center' src ={imageUrl}  alt="profile photo"/>
                            </div>
                            {
                                username === myusername ? (
                                    <ProfileUpload className="uploader" username={username}/>
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                        <div className="col-2"></div>
                    </div>
                </div>
            </div>
    );
}

export default Profile;
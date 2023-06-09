import { useState, useEffect } from 'react';
import React from 'react';
import logo from '../images/socio.png';
import bg from '../images/bg2.jpeg';
import connect from '../images/connect.jpg';
import '../App.css';
import './Home.css';
import Post from '../Post/Post'
import Pages from '../Pages'
import  {db, auth}  from '../firebase'
import {makeStyles} from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import {Button, Input} from '@material-ui/core';
import ImageUpload from '../ImageUpload/ImageUpload';
import useLocalStorage from 'use-local-storage';
import { useNavigate } from 'react-router-dom';
import PostList from "../PostList/PostList";
import {light} from "@material-ui/core/styles/createPalette";
import firebase from "firebase";
var axios = require('axios');

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function Home() {
  const navi= useNavigate();
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [pages, setPages] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openPages, setOpenPages] = useState(false);
  const [openPagesModal, setOpenPagesModal] = useState(false);
  const [createPagesModal, setCreatePagesModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [newPageName, setNewPageName] = useState('');
  const [newPageId, setNewPageId] = useState('');
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('user');

  const [user, setUser] = useState(null);
  const [postusername, setPostUserName] = useState('');
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'dark' : 'light');
  const switchTheme = () => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    }


useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((authUser) => {
    if(authUser){
      //login
      console.log(authUser);
      setUser(authUser);
      setUsername(authUser.displayName);
      setPostUserName(authUser.displayName);
    }
    else{
      //logout
      setUser(null);
    }
  })
  return () => {
    //perform cleanup operations
    unsubscribe();
  }
}, [user, username]);

useEffect(() => {
    db.collection('profile').where('username', '==', username).get()
        .then(r => {
            r.forEach(doc => {
                setRole(doc.get('role'));
            })
        });

    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
        console.log(snapshot);
        setPosts(snapshot.docs.map(doc => ({
            id: doc.id,
            post: doc.data()})));
    });

    db.collection('pages').onSnapshot(snapshot => {
        setPages(snapshot.docs.map(doc => ({
            id: doc.id,
            page: doc.data()})));
        snapshot.docs.map((doc) =>doc.data()).forEach((doc) => console.log('Your page:  ' + doc.name));
    });
}, []);

useEffect(() => {
    setFilteredPosts(posts.filter((post) =>
        post.post.username.toLowerCase().includes(search.toLowerCase()) ||
        post.post.caption.toLowerCase().includes(search.toLowerCase())
    ));

    console.log('Your value: ' + filteredPosts.length);
}, [search, posts]);


//--------------------------
const createUser = (user) => {
    const config = {
        method: 'post',
        url: 'https://api.chatengine.io/users/',
        headers: {
            'PRIVATE-KEY': '85ba85d9-00c0-4755-9a3a-1e428aeaacc6'
        },
        data:user
    };
    console.log(config);
      axios.post('https://api.chatengine.io/users/',{
        username:username,
        secret:password
      },
      {
        headers: {
          'PRIVATE-KEY': '6f19de06-d953-4883-88d4-ead290f29e46'
      }
      }
      ).then(res=> {
        console.log(res);
      })
      .catch(err=>console.log(err));
      // axios(config)
      //   .then(function (response) {
      //       console.log(JSON.stringify(response.data));
      //   })
      //   .catch(function (error) {
      //       console.log(error);
      //   });
}
//----------------------------
  const signUp = (event) => {
    event.preventDefault();

    if (username.length > 5) {
      alert('Username must be 5 characters or less');
      return;
    }

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      createUser({ username: username, secret: password });
      authUser.user.updateProfile({
          displayName: username,
      }).then(r  => console.log("user display name set"));

      db.collection('profile').add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          username: username,
          email: email,
          imageUrl: "",
          fileName: "",
          role: role
      }).then(r => console.log("profile added in profile section"));
    })
    .catch((error) => alert(error.message));
  };

 const signIn = (event) => {
   event.preventDefault();

   auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false);
 }

 const createNewPage = (event) => {
     event.preventDefault();

     db.collection('pages').add({
          id: Math.round((new Date()).getTime() / 1000),
          name: newPageName,
          owner: username
     });

     setCreatePagesModal(false);
 }

 const signUpFromLogin = (event) => {
    event.preventDefault();

     setOpenSignIn(false);
     setOpen(true);
  }

  const openPagesMod = (event) => {
      event.preventDefault();
       setOpenPagesModal(true);
    }

    const createPagesMod = (event) => {
          event.preventDefault();
          setCreatePagesModal(true);
    }

    const openNewPage = (event) => {
        event.preventDefault();
        setOpenPagesModal(false);
        navi("/pages",{state:{username,password,newPageId,newPageName,email,theme}});
    }

  const registerFromSignUp = (event) => {
      event.preventDefault();

       setOpen(false);
       setOpenSignIn(true);
  }

  return (
    <div className="App">

{/* ------------------------------------------------------------------ */}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        >

        <div style={modalStyle} className={`card ${classes.paper}`}>
        <center><img className='app_Image' src={logo} alt='header image' /></center>
          <center><h3>Register Yourself</h3></center>
          <form className='app__signup'>
              <div className="row">
                  <div className="col-1"><i className=""></i></div>
              </div>
          <Input
              placeholder='Create username'
              type='text'
              value={username}
              onChange={(e)=> setUsername(e.target.value)}
            />

            <Input
              placeholder='E-mail'
              type='text'
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
            />

            <Input
              placeholder='Password'
              type='password'
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
            />

              <select name="Role" className="form-select" defaultValue="user" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="admin">
                    Admin
                  </option>
                  <option value="user">
                    User
                  </option>
              </select>

            <Button type='submit' onClick={signUp}>Sign Up</Button>
            <center>Already have an account yet? <Button onClick={registerFromSignUp}>Login</Button></center>
          </form>
        </div>
      </Modal>
{/* ------------------------------------------------------------------ */}
      <Modal
        open={openPagesModal}
        onClose={() => setOpenPagesModal(false)}
        >

        <div style={modalStyle} className={`card ${classes.paper}`}>
          <center><img className='app_Image' src={logo} alt='header' /></center>
          <form className='app__signup'>

          <select name="pages" onChange={(e)=> setNewPageId(e.target.value)}>
                  <option value="">Choose any page</option>
                    {
                         pages.length && pages.map(({id, page}) => (
                         <option value={id}>{page.name}</option>
                         ))
                    }
          </select>
            <input type='text' style={{ visibility: "hidden" }}></input>
            <button type='submit' className='btn btn-dark' onClick={openNewPage}>Open Page</button>
              {
                  role === 'admin' ? (
                      <>
                          <center>Wish to create a new page?</center>
                          <center><Button onClick={createPagesMod} className='btn btn-dark'>Create New Page</Button></center>
                      </>
                  ) : (
                      <></>
                  )
              }
          </form>
        </div>
      </Modal>

      {/* ------------------------------------------------------------------ */}
            <Modal
              open={createPagesModal}
              onClose={() => setCreatePagesModal(false)}
              >

              <div style={modalStyle} className={`card ${classes.paper}`}>
                <center><img className='app_Image' src={logo} alt='header image' /></center>
                <form className='app__signup'>

                <Input placeholder='name'
                              type='text'
                              onChange={(e)=> setNewPageName(e.target.value)}
                            />

                  <Button type='submit' onClick={createNewPage}><h2>Create New Page</h2></Button>
                </form>
              </div>
            </Modal>
{/* ------------------------------------------------------------------ */}
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        >

        <div style={modalStyle} className={`card ${classes.paper}`}>
          <center><img className='app_Image' src={logo} alt='header image' /></center>
          <form className='app__signup'>
              <div className="mt-2 row">
                  <div className="col-1"><i className="bi bi-envelope bi-envelope-at"></i></div>
                  <div className="col-11">
                      <Input
                      className="w-100"
                      placeholder='E-mail address'
                      type='text'
                      value={email}
                      onChange={(e)=> setEmail(e.target.value)}/>
                  </div>
              </div>

              <div className="mt-2 row">
                  <div className="col-1"><i className="bi bi-key"></i></div>
                  <div className="col-11">
                      <Input
                          className="w-100"
                          placeholder='Password'
                          type='password'
                          value={password}
                          onChange={(e)=> setPassword(e.target.value)}
                      />
                  </div>
              </div>

            <button className="btn btn-outline-dark mt-2" type='submit' onClick={signIn}>Sign In</button>
              <div className="row mt-2">
                  <div className="col-8">Don't have an account yet?</div>
                  <div className="col-4"><button type="button" className="btn btn-outline-primary" onClick={signUpFromLogin}>Sign Up</button></div>
              </div>
          </form>
        </div>
      </Modal>
{/* ------------------------------------------------------------------ */}

      {/*Header*/}
      <div className="app__header">
        <img className="logo-img-component" src={logo} alt="header image"/>
        {user ? (

            <div className="display-name-component h4" onClick={() => {navi("/profile",{state:{postusername, username}})}}><i className="bi bi-person-fill"></i>{user.displayName}</div>
        ) : (
            <div className="display-name-component h2"></div>
        )}
      </div>

      {user ? (
          <div className="container home-page-top">
            <div className="row">
              <div className="col-md-2 app__loginContainer">
                <div className="btn-group-vertical ">
                  <button
                      type="button"
                      className={`btn btn-outline-info ${
                          theme === "light" ? "btn-outline-dark" : "btn-outline-light"
                      }`}
                      onClick={()=>{navi("/")}}>
                    Home
                  </button>
                  <button
                      type="button"
                      className={`btn btn-outline-info ${
                          theme === "light" ? "btn-outline-dark" : "btn-outline-light"
                      }`}
                      onClick={openPagesMod}
                  >
                    Pages
                  </button>
                  <button
                      type="button"
                      className={`btn btn-outline-info ${
                          theme === "light" ? "btn-outline-dark" : "btn-outline-light"
                      }`}
                      onClick={switchTheme}
                  >
                    Switch to {theme === "light" ? "Dark" : "Light"} Theme
                  </button>
                  <button
                      type="button"
                      className={`btn btn-outline-info ${
                          theme === "light" ? "btn-outline-dark" : "btn-outline-light"
                      }`}
                      onClick={() => {auth.signOut(); navi("/")}}
                  >
                    Logout
                  </button>
                </div>
              </div>
              <div className="col-md-8 align-content-center">
                <div className="app__posts" data-theme={theme}>
                  <PostList filteredPosts={filteredPosts} user={user} username={username} setSearch={setSearch}/>
                </div>
              </div>
              <div className="col-md-2 align-content-center"></div>
            </div>
          </div>
      ) : (
          <div className="container-fluid">
            <div className="row">
              <div className="col-6 col-xs-0 fill">
                <img src={bg} alt="background" />
              </div>
              <div className="col-6 col-xs-12 app__loginContainer">
                  <div>

                  </div>
                <div className="card " style={getModalStyle()}>
                  <div className="card-img" id="sign_block">
                    <img className="connect" src={connect} alt="connect" />
                  </div>
                  <div className="btn-group card-footer app__loginContainer">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setOpenSignIn(true)}>
                      <i className="bi bi-person-check-fill"></i> Sign In
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setOpen(true)}
                    >
                      <i className="bi bi-person-plus-fill"></i> Sign Up
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
      )}
    </div>);
}

export default Home;


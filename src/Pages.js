import { useState, useEffect } from 'react';
import React from 'react';
import logo from './images/title.png';
import bg from './images/bg.png';
import './App.css';
import Post from './Post/Post'
import  {db, auth}  from './firebase'
import {makeStyles} from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import {Button, Input} from '@material-ui/core';
import PagePostUpload from './ImageUpload/PagePostUpload';
import useLocalStorage from 'use-local-storage';
import { useNavigate, useLocation } from 'react-router-dom';

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

const Pages = ({route}) => {
	const navi = useNavigate();
      const classes = useStyles();
      const {state} = useLocation();
      const [modalStyle] = useState(getModalStyle);

      const [posts, setPosts] = useState([]);
      const [pages, setPages] = useState([]);
      const [pagePosts, setPagePosts] = useState([]);
      const [open, setOpen] = useState(false);
      const [openSignIn, setOpenSignIn] = useState(false);
      const [openPages, setOpenPages] = useState(false);
      const [openPagesModal, setOpenPagesModal] = useState(false);
      const [createPagesModal, setCreatePagesModal] = useState(false);

      console.log(state);
      const [username, setUsername] = useState(state.username);
      const [password, setPassword] = useState(state.password);
      const [email, setEmail] = useState(state.email);
      const [newPageName, setNewPageName] = useState(state.newPageName);
      const [newPageId, setNewPageId] = useState(state.newPageId);
      const user = null;

      const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const [theme, setTheme] = useState('light');
      const switchTheme = () => {
          const newTheme = theme === 'light' ? 'dark' : 'light';
          setTheme(newTheme);
        }

    useEffect(() => {

      db.collection('pages').onSnapshot(snapshot => {
          setPages(snapshot.docs.map((doc) =>doc.data()));
          snapshot.docs.map((doc) =>doc.data()).forEach((doc) => console.log('Your page:  ' + doc.name));
      });

      db.collection('pages')
      .doc(newPageId)
      .collection('posts')
      .onSnapshot(snapshot => {
          setPagePosts(snapshot.docs.map((doc) => ({
               id: doc.id,
               post: doc.data()})));
          snapshot.docs.map((doc) =>doc.data()).forEach((doc) => console.log('Your page posts:  ' + doc));
        });
    }, []);

    var axios = require('axios');
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
       auth
       .createUserWithEmailAndPassword(email, password)
       .then((authUser) => {
        createUser({username:username,secret:password})
         return authUser.user.updateProfile({
           displayName: username
         })
       })
       .catch((error) => alert(error.message));

     }

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

            <div style={modalStyle} className={classes.paper}>
            <center><img className='app_Image' src={logo} alt='header image' /></center>
              <center><h1>Register Yourself</h1></center>
              <form className='app__signup'>
              <Input
                  placeholder='username'
                  type='text'
                  value={username}
                  onChange={(e)=> setUsername(e.target.value)}
                />

                <Input
                  placeholder='email'
                  type='text'
                  value={email}
                  onChange={(e)=> setEmail(e.target.value)}
                />

                <Input
                  placeholder='password'
                  type='password'
                  value={password}
                  onChange={(e)=> setPassword(e.target.value)}
                />

                <Button type='submit' onClick={signUp}>SignUP</Button>
                <center>Already have an account yet? <Button onClick={registerFromSignUp}>Login</Button></center>
              </form>
            </div>
          </Modal>
    {/* ------------------------------------------------------------------ */}
          <Modal
            open={openPagesModal}
            onClose={() => setOpenPagesModal(false)}
            >

            <div style={modalStyle} className={classes.paper}>
              <center><img className='app_Image' src={logo} alt='header image' /></center>
              <form className='app__signup'>

              <select name="pages" onChange={(e)=> setNewPageName(e.target.value)}>
                      <option value="">Choose any page</option>
              {
                             pages.length && pages.map((page) => (
                             <option value={page.id}>{page.name}</option>
                             ))
                        }
              </select>

                <Button type='submit' onClick={()=>{navi("/pages",{state:{username,password,user,newPageName,email,theme}})}}><h2>Open Page</h2></Button>
                <center>Wish to create a new page? <Button onClick={createPagesMod}>Create New Page</Button></center>
              </form>
            </div>
          </Modal>

          {/* ------------------------------------------------------------------ */}
                <Modal
                  open={createPagesModal}
                  onClose={() => setCreatePagesModal(false)}
                  >

                  <div style={modalStyle} className={classes.paper}>
                    <center><img className='app_Image' src={logo} alt='header' /></center>
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

            <div style={modalStyle} className={classes.paper}>
              <center><img className='app_Image' src={logo} alt='header image' /></center>
              <form className='app__signup'>
                <Input
                  placeholder='email'
                  type='text'
                  value={email}
                  onChange={(e)=> setEmail(e.target.value)}
                />

                <Input
                  placeholder='password'
                  type='password'
                  value={password}
                  onChange={(e)=> setPassword(e.target.value)}
                />

                <Button type='submit' onClick={signIn}><h2>Login</h2></Button>
                <center>Dont have an account yet? <Button onClick={signUpFromLogin}>Sign Up</Button></center>
              </form>
            </div>
          </Modal>
    {/* ------------------------------------------------------------------ */}

          {/* Header */}
          <div className='app__header' data-theme={theme}>
            <center><img
              className='app_headerImage'
              src={logo}
              alt='header'
            /></center>
          </div>

          <div className='app__uploadBox'>
          {user?.displayName ? (
            <br/>
          ):(
            <h4>Sorry, you need to login to upload</h4>
          )}
          </div>
          <div className='app__uploadBox' data-theme={theme}>
                <div className='app__loginContainer'>
                                                <button onClick={() => auth.signOut()}>Logout</button>
                                            </div>

                <button onClick={switchTheme}>
                                    Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
                                  </button>
                                  <button onClick={openPagesMod}>Pages</button>
                                  <button onClick={()=>{navi("/",{state:{username,password}})}}>Back to Home</button>

                <div className='app__posts' data-theme={theme}>

                                                      <div className='app__postsLeft'>
                                                      <PagePostUpload username={username} newPageId={newPageId} />
                                                      {
                                                        pagePosts && pagePosts.map(({id, post}) =>(
                                                          <Post key={id} postId={id} user={user} username={username} postusername={post.username} caption={post.caption} imageUrl={post.imageUrl} fileName={post.fileName}/>
                                                        ))
                                                      }
                                                      </div>



                                                    </div>


                </div>
        </div>
      );
}

export default Pages;
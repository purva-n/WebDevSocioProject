import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import {db, storage} from './firebase'
import firebase from 'firebase'
import './ImageUpload/ImageUpload.css'
import {Routes, Route} from 'react-router-dom'
import Home from './Home/Home'
import Chat from './Chat'
import Pages from './Pages'
import './App.css'
import Profile from './Profile/Profile'

function App() {
 return(
    <div >
     <Routes>
         <Route path='*' element={<Home/>}></Route>
         <Route path='/chat' element={<Chat/>}></Route>
         <Route path='/pages' element={<Pages/>}></Route>
         <Route path='/profile' element={<Profile/>}></Route>
     </Routes>
 </div>
 );
}

export default App;
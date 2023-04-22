import React, { useEffect, useState } from 'react'
import {db} from '../firebase'
import _ from 'lodash'
import logo from '../images/msd.png'
import firebase from 'firebase'
import './Post.css'
import Like from './Like'
import {
  PokemonCounter,
  PokemonSelector
} from '@charkour/react-reactions';
import Avatar from '@material-ui/core/Avatar'
import { useNavigate } from 'react-router-dom';
import {NavLink} from "reactstrap";

function Post( {postId, user, username, postusername, caption, imageUrl, fileName}) {
  const navi= useNavigate();
  const [comments, setComments ] = useState([]);
  const [comment, setComment] = useState('');
  const [count, setCount] = useState(0);

  const [counters, setCounters] = useState([]);
  const [showSelector, setShowSelector] = useState(false);

  const handleAdd = () => setShowSelector(false);

  const handleSelect = (emoji) => {
      const index = _.findIndex(counters, { by: username })
      if (index > -1) {
        setCounters([
            ...counters.slice(0, index),
            ...counters.slice(index + 1),
        ]);
        setShowSelector(false);
      } else {
        setCounters([
            ...counters, { emoji, by: username }
        ]);
        setShowSelector(false);
      }
      postLike({ emoji, by: username });
    };

  const postLike = (likeObject) => {
      console.log(likeObject);

      db.collection('posts')
        .doc(postId)
        .collection('likes')
        .where('user', '==', username)
        .get()
        .then(doc => {
            if (!doc.exists) {
               return addLike(likeObject);
            }
        });
    };

    const addLike = (likeObject) => {
          db
            .collection('posts')
            .doc(postId)
            .collection('likes')
            .add(likeObject);
        };

    const deletePost = () => {
        db.collection('posts').doc(postId).delete();
    };


//  const incrementCount = (label) => {
//
//    counters.push({
//        emoji: label,
//        by: 'Abhi'
//    });
//
//    setCounters(counters);
//    console.log(counters);
//
//  };

  useEffect(() => {
    let unsubscribe;
    if(postId) {
      unsubscribe = db
              .collection('posts')
              .doc(postId)
              .collection('comments')
              .orderBy('timestamp', 'desc')
              .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) =>doc.data()));
              });

      unsubscribe = db
              .collection('posts')
              .doc(postId)
              .collection('likes')
              .onSnapshot((snapshot) => {
                setCounters(snapshot.docs.map((doc) =>doc.data()));
              });
      }
      return () => {
        unsubscribe();
      };
  }, [postId]);


  const postComment = (event) => {
    event.preventDefault();

    db
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .add({
        text: comment,
        username: username,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      setComment('');
  };

  return (

    <div className='card post'>


        <div className='post__header row'>
        {/* header => avatar + user name */}
            <Avatar className='post__avatar col-1' alt=''/>
            <h4 className="col-9 fw-bold" onClick={()=>{navi("/profile",{state:{postusername, username}})}}>{postusername}</h4>
            {postusername === username ?(
                <div className="col-1">
                    <button  onClick={() => deletePost()}><i className="bi bi-trash"></i></button>
                </div>
            ):(
                <div className='col-1'></div>
            )}
        </div>
        <div>
            <h6 className='col-6 post__text'>{caption}</h6>
        </div>


        {/* Photo */}
        {/*console.log(imageUrl)*/}

            {caption.includes('mp4') ?(
                <video className='post__image' controls>
                  <source src={imageUrl} type="video/mp4" />
                </video>
            ):(
                <img className='post__image' src = {imageUrl} />
            )}

        {/* user name + caption */}

        <div className='post__comment'>

          <PokemonSelector onSelect={(label) => handleSelect(label) } /><br />
          <PokemonCounter counters={ counters }
                          user={ username } onClick={() => handleAdd } />

          {comments.map((comment)=>(
            <p>
              <strong>{comment.username}: </strong>{comment.text}{count}
            </p>
          ))}
        </div>

        {user  && (
          <form className='post__commentBox'>
          <input 
            className='post__input form-control'
            type='text'
            placeholder='Comment here'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button 
            className='post__button btn btn-primary'
            disabled={!comment}
            type='submit'
            onClick={postComment}
          >
            Post
          </button>
        </form>
        )}       
        
    </div>
  )
}

export default Post
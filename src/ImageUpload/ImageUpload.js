import {Box, Button, LinearProgress, Typography} from '@material-ui/core'
import React, { useState } from 'react'
import {db, storage} from '../firebase'
import firebase from 'firebase'
import './ImageUpload.css'
import * as PropTypes from "prop-types";

function CheckIcon(props) {
    return null;
}

CheckIcon.propTypes = {color: PropTypes.string};

function ImageUpload({username}) {
    const [image, setImage] = useState(null);
    //const [url, setUrl] = useState('');
    const [progress, setProgress] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);
    const [caption, setCaption] = useState('');

    const handleChange = (e) =>  {
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // error function
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function
                storage
                    .ref('images')
                    .child(image.name)
                    .getDownloadURL()
                    .then(url =>{
                        // post image inside the database

                        db.collection('posts').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            fileName: image.name,
                            imageUrl: url,
                            username: username 
                        });
                        setProgress(0);
                        setCaption('');
                        setImage(null);
                    });
                setIsSuccess(true);
            }
        );
    };

  return (
    <div className='imageupload'>
      <input className='upload__caption form-control' type='text' placeholder='Enter a caption' onChange={event => setCaption(event.target.value)} value={caption} />
      <div className="flex-container">
          <div className="flex-box"><input className='upload_fileEntry form-control' type='file' onChange={handleChange} /></div>
          <div className="flex-box">
              <Box>
                  <Button type="button" className='upload__button btn btn-success' onClick={handleUpload}>
                      {isSuccess ? (<span className="text-success">POST</span>) : (<span className="text-dark">POST</span>) }
                  </Button>
                  <LinearProgress variant="determinate" value={progress} />
              </Box>
          </div>
      </div>

    </div>
  )
}

export default ImageUpload
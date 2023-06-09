import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import {db, storage} from '../firebase'
import firebase from 'firebase'
import './ImageUpload.css'

function PagePostUpload({username, newPageId}) {
    const [image, setImage] = useState(null);
    //const [url, setUrl] = useState('');
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) =>  {
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if(image.name == null) {return;}
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

                        db.collection('pages')
                        .doc(newPageId)
                        .collection('posts')
                        .add({
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
            }
        );
    };

  return (
    <div className='imageupload'>
      <progress className='imageupload_progress' value={progress} max='100' />
      <input className='upload__caption form-control' type='text' placeholder='Enter a caption' onChange={event => setCaption(event.target.value)} value={caption} />
      <input className='upload_fileEntry form-control' type='file' onChange={handleChange} />
      <Button className='upload__button btn btn-outline-primary' onClick={handleUpload}>
          Upload
      </Button>
    </div>
  )
}

export default PagePostUpload
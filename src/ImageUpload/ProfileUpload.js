import {Button, LinearProgress} from '@material-ui/core'
import React, { useState } from 'react'
import {db, storage} from '../firebase'
import './ImageUpload.css'

function ProfileUpload({username, user}) {
    const [image, setImage] = useState(null);
    //const [url, setUrl] = useState('');
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');
    const authUser = user;

    const handleChange = (e) =>  {
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if(image == null) {
            return;
        }
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

                    db.collection('profile').where('username', '==', username).get()
                    .then((doc) => {
                     doc.forEach((docu) => {
                         docu.ref.update({
                             imageUrl: url,
                             fileName: image.name
                         }).then(r =>
                         console.log("updated ref")).catch((err) =>
                         console.error("Error in updating imageUrl"));
                        });
                    });

                        // authUser.user.updateProfile({
                        //     photoURL: url
                        // }).then(r =>
                        //     console.log(r)
                        // );

                        setProgress(0);
                        setImage(null);
                    });
            }
        );
    };

  return (
    <div className='imageupload'>
      <input className='upload_fileEntry form-control' type='file' onChange={handleChange} />
      <Button className='upload__button btn btn-primary' onClick={handleUpload}>
          Upload
      </Button>
      <LinearProgress variant="determinate" value={progress} />
    </div>
  )
}

export default ProfileUpload;
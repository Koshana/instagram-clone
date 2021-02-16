import React, { useState } from 'react'

import firebase from 'firebase';

import { STORAGE, DB } from '../config/firebase'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Button } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import '../App.css';

function ImageUpload({ username }) {

    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState('');
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleUpload = () => {

        const uploadTask = STORAGE.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

                setProgress(progress)
            },
            (error) => {
                console.log(error)
                alert(error.message)
            },
            () => {
                STORAGE
                .ref('images')
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    DB.collection('posts').add({
                        timestamp : firebase.firestore.FieldValue.serverTimestamp(),
                        caption : caption,
                        imageUrl : url,
                        username : username
                    })
                    setProgress(0)
                    setCaption('')
                    setImage(null)
                })
            }
        )
    }

    return (
        <Card className={'ImageUpload__card'} variant={'outlined'}>
            <CardContent>
                <progress className={'imageUpload__progress'} value={progress} max='100'/>
                <input
                    type={'text'}
                    placeholder={"Enter a Caption"}
                    value={caption}
                    onChange={(event) => setCaption(event.target.value)}
                    className={'form-control'}
                />
                <input
                    type={'file'}
                    onChange={handleChange}
                    className={'form-control'}
                />
                <div className={'ImageUpload__button01'}>
                    <Button
                        variant="contained"
                        color="default"
                        startIcon={<CloudUploadIcon/>}
                        onClick={handleUpload}
                    >
                    Upload
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default ImageUpload

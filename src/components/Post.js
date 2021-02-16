import React, { useState, useEffect } from 'react'

import '../App.css'

import Avatar from '@material-ui/core/Avatar'
import { Button } from '@material-ui/core';

import { DB } from '../config/firebase';
import firebase from 'firebase';



function Post({ username, caption, imageUrl, postId, user }) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = DB.collection('posts').doc(postId).collection('comments').orderBy('timestamp').onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()))
            })
        }

        return () => {
            unsubscribe();
        }
    }, [postId])

    const postComment = (event) => {
        event.preventDefault();

        DB.collection('posts').doc(postId).collection('comments').add({
            text : comment,
            username : user.displayName,
            timestamp : firebase.firestore.FieldValue.serverTimestamp()
        })

        setComment('');
    }

    return (
        <div className={'post'}>
            <div className={'post_header'}>
                <Avatar
                    className={'post__avatar'}
                    alt={username}
                    src={'/static/images/avatar/j.jpg'}
                />
                <h3>{username}</h3>
            </div>
            <img 
                src={imageUrl}
                className={'post__image'}
            />
            <h4 className={'post__text'}><strong>{username}</strong>&nbsp;{caption}</h4>

            <div className={'post_comments'}>
                {comments.map((comment) => (
                    <p>
                        <b>{comment.username}</b>&nbsp;{comment.text}
                    </p>
                ))}
            </div>
            
            { user && (
                <form className={'post__comment'}>
                    <input 
                        type={'text'}
                        className={'post__input form-control'}
                        placeholder={'Add a comment..'}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button
                        disabled={!comment}
                        className={'post__button'}
                        type={'submit'}
                        onClick={postComment}
                    >Post</Button>
                </form>
            ) }
        </div>
    )
}

export default Post

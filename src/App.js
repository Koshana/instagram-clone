import React , { useState, useEffect } from 'react'
import './App.css';

import Post from './components/Post'
import ImageUpload from './components/ImageUpload'

import { DB, AUTH } from './config/firebase'

import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

function getModalStyle() {
  const top = 50;
  const left = 50;

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
    border: '2px solid lightgray',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {

  const [posts, setPosts] = useState([]);

  const [open, setOpen] = useState(false);
  const [openSignin, setOpenSignin] = useState(false);

  const [username , setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [user,setUser] = useState(null);

  const classes = useStyles();

  const [modalStyle] = useState(getModalStyle);

  useEffect(() => {
    const unsubscribe = AUTH.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser)
        setUser(authUser)
      } else {
        setUser(null)
      }
    })

    return () => {
      unsubscribe();
    }
  }, [user,username])

  useEffect(() => {
    DB.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id : doc.id,
        post : doc.data()
      })
      ))
    })
  }, [])

  const signup = (event) => {
    event.preventDefault();

    AUTH.createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName : username
      })
    })
    .catch((error) => alert(error.message))

    setOpen(false);
  }

  const signin = (event) => {
    event.preventDefault();

    AUTH.signInWithEmailAndPassword(email,password)
    .catch((error) => alert(error.message))

    setOpenSignin(false)
  }

  return (
    <div className="App">

      <Modal
        open={openSignin}
        onClose={() => setOpenSignin(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className={'app__signin'}>
            <center>
              <img
                src={'https://www.searchpng.com/wp-content/uploads/2018/12/Splash-Instagraam-Icon-Png-1024x1024.png'}
                className={'app__headerLogo'}
                alt=''
              />
            </center>
              <Input
                placeholder={'Email'}
                type={'email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder={'Password'}
                type={'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type={'submit'} onClick={signin}>Sign In</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className={'app__signup'}>
            <center>
              <img
                src={'https://www.searchpng.com/wp-content/uploads/2018/12/Splash-Instagraam-Icon-Png-1024x1024.png'}
                className={'app__headerLogo'}
                alt=''
              />
            </center>
              <Input
                placeholder={'Username'}
                type={'text'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder={'Email'}
                type={'email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder={'Password'}
                type={'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type={'submit'} onClick={signup}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <div className={'app__header'}>
        <img
          src={'https://www.logo.wine/a/logo/Instagram/Instagram-Wordmark-Logo.wine.svg'}
          className={'app_headerImage'}
          alt={'logo'}
        />
        { user ? (
          <div className={'app__loginContainer'}>
            <Button onClick={() => AUTH.signOut()}>Log Out</Button>
          </div>
        ) : (
          <div className={'app__loginContainer'}>
            <Button onClick={() => setOpenSignin(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className={'app__post'}>
        {
          posts.map(({id,post}) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))
        }
      </div>

      { user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ) : (
        <Card className={'app__card'} variant={'outlined'}>
          <CardContent>
            <h3 className={'text-center head'}>Login to Upload</h3>
          </CardContent>
        </Card>
      ) }

      <div className={'app__footer'}>
        <center><h6>Instagram Clone - Koshana Pravinath All Rights Reserved @ { new Date().getFullYear() }</h6></center>
      </div>
      
    </div>
  );
}

export default App;

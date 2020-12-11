import React, {useState} from 'react';
import {Container} from 'react-bootstrap';
import firebase from '../../firebaseConnection';

const Home = () => {
  const [selector, setSelector] = useState('');

  //Observador
  firebase.auth().onAuthStateChanged((user) => {
    if(user) 
      setSelector(true)
    else 
      setSelector(false)
  });

  return (    
    <>
      {selector ?
        (<Container>
          <div>NO CONTENT (inside of the system)</div>
        </Container>) : 
        (<Container>
           <div>NO CONTENT (out the system)</div>
        </Container>)
        }
    </>
  );
}

export default Home;
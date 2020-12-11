import React, {useState} from 'react';
import {Container, Navbar, Nav, NavDropdown} from 'react-bootstrap';
import firebase from '../../firebaseConnection';
import img from '../../assets/logosistema.png'

const Header = () => {
  const [selector, setSelector] = useState(false);
  const getUser = firebase.auth().currentUser;
  const [dropdownTitle ,setDropdownTitle] = useState('');
  
  //Observador
  firebase.auth().onAuthStateChanged((user) => {
    if(user) 
      setSelector(true)
    else 
      setSelector(false)
  });

  const handleDropdownTitle = () => {
    firebase.database().ref('User').child(`${getUser.uid}`).once('value', (snapshot) => {
      setDropdownTitle(snapshot.val().name);
    });
    console.log(dropdownTitle)
  } 

  return (    
    <>
      {selector ?
        (<Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="/">
              <img
                alt=""
                src={img}
                width="140"
                height="70"
              />{' '}
              urClass Posts
            </Navbar.Brand>

            <Nav variant="pills" className=" justify-content-end">
              <Navbar.Text>
                Logado:  
              </Navbar.Text>
              <NavDropdown 
                  className="bg-warning text-dark"
                  onClick={handleDropdownTitle()}
                  title={dropdownTitle}
                  id="collasible-nav-dropdown"
              >
                <NavDropdown.Item className="bg-warning text-dark" onClick={() => firebase.auth().signOut()} href="/login">Sair do sistema</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Container>
        </Navbar>) : 
        (<Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="/">
              <img
                alt=""
                src={img}
                width="140"
                height="70"
              />{' '}
              urClass Posts
            </Navbar.Brand>

            <Nav fill className=" justify-content-end">
              <Nav.Link href="/">Início</Nav.Link>
              <Nav.Link href="/login">Entrar</Nav.Link>
              <Nav.Link href="/user/create">Cadastrar</Nav.Link>
            </Nav>
            </Container>
        </Navbar>)}
    </>
  );
}

export default Header;

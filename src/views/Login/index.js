import React, {useState, useEffect} from 'react';
import { Link , Redirect} from "react-router-dom";
import { Container, Row, Card, Form, Button,  Spinner, Alert} from 'react-bootstrap';
import validate from 'validate.js';
import firebase from '../../firebaseConnection';


//Variáveis do formulário
const initialFormState = {
  isValid: false,
  loading: false,
  values: {
    email: '',
    password: ''
  },
  errors: {
    email: [],
    password: [],
  },
  touched: {
    email: false,
    password: false,
  }
};

//Estado inicial do feedback do usuário
const initialFeedback = {
  open: false,
  message: '',
  type: '' 
};

//Esquema para validações no validate.js
const schema = {
  email: {
    presence: { allowEmpty: false, message: () => 'Este campo é obrigatório' },
    email: { message: () => 'Insira um email válido' }
  },
  password: {
    presence: { allowEmpty: false, message: () => 'Este campo é obrigatório' },
  }
};


const Login = () => {
  //Garantindo que a página apenas seja por alguém deslogado do sistema
  firebase.auth().signOut();


  const [feedback, setFeedback] = useState(initialFeedback);
  const [formState, setFormState] = useState(initialFormState);
  const [redirect, setRedirect] = useState(false);


  //Observador
  firebase.auth().onAuthStateChanged((user) => {
    if(user) 
      setRedirect(true)
    else 
      setRedirect(false)
  }); 

  useEffect(() => {
    //Verificando campos do formulário a cada atualização do formulário
    const errors = validate(formState.values, schema, { fullMessages: false });

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false: true,
      errors: errors ? errors : {}
    })) 
    
  }, [formState.values]);
  
  const handleFieldChange = (e, field, value) => {
    e.persist && e.persist();
    setFormState({
      ...formState,
      values: {
        ...formState.values,
        [field]: value
      },
      touched: {
        ...formState.touched,
        [field]: true
      }
    });    
  };  

  const hasError = (field) => Boolean(formState.errors[field] && formState.touched[field]);

  const handleSubmit = (e) => {
    if(formState.isValid){
      firebase.auth().signInWithEmailAndPassword(formState.values.email, formState.values.password)
      .catch((error) =>{
        if(error.code === 'auth/wrong-password'){
          setFeedback({
            open: true,
            type: 'warning',
            message: "Senha incorreta!"
          })
        }else if(error.code === 'auth/invalid-email'){
          setFeedback({
            open: true,
            type: 'warning',
            message: "Email inválido!"
          })
        }else if(error.code === 'auth/user-not-found'){
          setFeedback({
            open: true,
            type: 'warning',
            message: "Usuário não encontrado!"
          })
        }else{
          setFeedback({
            open: true,
            type: 'warning',
            message: 'Erro: ' + error.code
          })
        }
      })
      
      setFeedback({
        open: true,
        type: 'success',
        message: "Logado com sucesso!"
      })
    }else{
      setFeedback({
        open: true,
        type: 'warning',
        message: "Não foi possível entrar no sistema."
      })
    }    
    
    e.preventDefault();
  };

  console.log()
  //if (redirect) return <Redirect to="/" />


  return (    
    <Container style={{padding:10}}>
      {
        formState.loading ? 
        (<Row style={{marginTop:250}} className="justify-content-center" float="center">
              <Spinner  animation="border" variant="warning" size="xs" role="status"/>
          </Row>) : 
        (<Card bg="dark" text="white" body>
          <Card.Header className="text-warning"  border="warning" as="h4">Login</Card.Header>
          
          <Card.Body>
            <br/>
            <Form noValidate>
  
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  isInvalid={hasError('email') ? true : false}
                  type="email" 
                  placeholder="texto@exemplo.com" 
                  value={formState.values.email}
                  onChange={e => handleFieldChange(e, 'email', e.target.value)}
                />
                {/* Mensagem de erro, caso exista */}
                <Form.Text className="text-warning">
                  {hasError('email') ? formState.errors.email[0] : null}
                </Form.Text>
              </Form.Group>


              <Form.Group controlId="formBasicPassword">
                <Form.Label>Senha</Form.Label>
                <Form.Control 
                  isInvalid={hasError('password') ? true : false}
                  type="password" 
                  placeholder="Senha" 
                  value={formState.values.password}
                  onChange={e => handleFieldChange(e, 'password', e.target.value)}
                />
                <Form.Text className="text-warning">
                  {hasError('password') ? formState.errors.password[0] : null}
                </Form.Text>                
              </Form.Group>

              {/* Botao Submit e feedback para o usuário utilizando o controleador "feedback.open"*/}
              {feedback.open ? (
                <Alert variant={feedback.type} onClose={() => setFeedback({...feedback, open: false})              } dismissible>
                  <Alert.Heading>{(feedback.type === 'success') ? ('Sucesso!') : ('Erro!')}</Alert.Heading>
                  <p>{feedback.message}</p>
                  {(feedback.type === 'warning') ? <Link to={'/user/create'}>Deseja criar uma conta?</Link> : null}
                </Alert>
              ) :
              <Button type="submit" variant = "warning" onClick={(e) => handleSubmit(e)}>Entrar</Button>
              }
            </Form> 
          </Card.Body>
        </Card>)
      }      
    </Container>
  );
}

export default Login;

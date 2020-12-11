
import React, {useState, useEffect} from 'react';
import { Redirect} from "react-router-dom";
import { Container, Row, Card, Form, Button,  Spinner, Alert} from 'react-bootstrap';
import validate from 'validate.js';
import firebase from '../../firebaseConnection';


//Variáveis do formulário
const initialFormState = {
  isValid: false,
  loading: false,
  values: {
    name: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  },
  errors: {
    name: [],
    email: [],
    password: [],
    passwordConfirmation: []
  },
  touched: {
    name: false,
    email: false,
    password: false,
    passwordConfirmation: false
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
  name: {
    presence: { allowEmpty: false, message: () => 'Este campo é obrigatório' },
    length: { maximum: 150, message: () => 'Este campo deve ter no máximo 150 caracteres' }
  },
  email: {
    presence: { allowEmpty: false, message: () => 'Este campo é obrigatório' },
    email: { message: () => 'Insira um email válido' }
  },
  password: {
    presence: { allowEmpty: false, message: () => 'Este campo é obrigatório' },
    length: { minimum: 8, message: () => 'Este campo deve ter no mínimo 8 caracteres' }
  },
  passwordConfirmation: {
    presence: { allowEmpty: false, message: () => 'Este campo é obrigatório' },
    length: { minimum: 8, message: () => 'Este campo deve ter no mínimo 8 caracteres' },
    equality: { attribute: 'password', message: 'As senhas não são iguais!', comparator: (v1, v2) => (v1 === v2) }
  } 
};



const CreateUserForm = () => {
  //Garantindo que a página apenas seja por alguém deslogado do sistema
  firebase.auth().signOut();

  //Observador
  firebase.auth().onAuthStateChanged((user) => {
    if(user){
      firebase.database().ref('User').child(user.uid).set({
        name: formState.values.name,
      })
    }
  });

  const [feedback, setFeedback] = useState(initialFeedback);
  const [formState, setFormState] = useState(initialFormState);

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

  const handleRedirect = () => {
    if(formState.isValid){
      return <Redirect to="/"/>
    }
    setFeedback({...feedback, open: false});
  }

  const hasError = (field) => Boolean(formState.errors[field] && formState.touched[field]);

  const handleSubmit = (e) => {
    if(formState.isValid){
      //Submetendo dados ao banco
      firebase.auth().createUserWithEmailAndPassword(formState.values.email, formState.values.password)
      .catch((error) =>{
        if(error.code === 'auth/email-already-in-use'){
          setFeedback({
            open: true,
            type: 'danger',
            message: "Email em uso!"
          })
        }else if(error.code === 'auth/invalid-email'){
          setFeedback({
            open: true,
            type: 'danger',
            message: "Email inválido!"
          })          
        }else{
          setFeedback({
            open: true,
            type: 'danger',
            message: 'Erro: ' + error.code
          })
        }
        e.preventDefault();
      })
      
      /*let users = firebase.database().ref('Users');
      let key = users.push().key;
      users.child(key).set({
        name: formState.values.name,
        email: formState.values.email,
        senha: formState.values.password
      });*/
      
      setFeedback({
        open: true,
        type: 'success',
        message: "Cadastrado com sucesso!"
      })
    }else{
      setFeedback({
        open: true,
        type: 'danger',
        message: "Não foi possível concluir o cadastro."
      })
    }    
    e.preventDefault();
  };

  return (    
    <Container style={{padding:10}}>
      {
        formState.loading ? 
        (<Row style={{marginTop:250}} className="justify-content-center" float="center">
              <Spinner  animation="border" variant="warning" size="xs" role="status"/>
          </Row>) : 
        (<Card>
          <Card.Header  className="bg-dark text-white" border="warning" as="h4">Criar usuário</Card.Header>
          
          <Card.Body>
            <Card.Title as="h4">Criar conta no sistema</Card.Title>
            <br/>
            <Form noValidate>

              <Form.Group controlId="formBasicName">
                <Form.Label>Nome</Form.Label>
                <Form.Control 
                  isInvalid={hasError('name') ? true : false}
                  type="text" 
                  placeholder="Nome Sobrenome"             
                  value={formState.values.name}
                  onChange={e => handleFieldChange(e, 'name', e.target.value)}
              />
                {/* Mensagem de erro, caso exista */}
                <Form.Text className="text-danger">
                  {hasError('name') ? formState.errors.name[0] : null}
                </Form.Text>
                
              </Form.Group>
  
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  isInvalid={hasError('email') ? true : false}
                  type="email" 
                  placeholder="texto@exemplo.com" 
                  value={formState.values.email}
                  onChange={e => handleFieldChange(e, 'email', e.target.value)}
                />
                {/* Mensagem de erro, caso exista */}
                <Form.Text className="text-danger">
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
                {/* Mensagem de erro, caso exista */}
                <Form.Text className="text-danger">
                  {hasError('password') ? formState.errors.password[0] : null}
                </Form.Text>
                
              </Form.Group>
  
  
              <Form.Group controlId="formBasicPasswordConfirmation">
                <Form.Label>Confirme a Senha</Form.Label>
                <Form.Control 
                  isInvalid={hasError('passwordConfirmation') ? true : false}
                  type="password" 
                  placeholder="Confirme sua senha" 
                  value={formState.values.passwordConfirmation}
                  onChange={e => handleFieldChange(e, 'passwordConfirmation', e.target.value)}
                />
                {/* Mensagem de erro, caso exista */}       
                <Form.Text className="text-danger">
                  {hasError('passwordConfirmation') ? formState.errors.passwordConfirmation[0] : null}
                </Form.Text>

              </Form.Group>

              {/* Botao Submit e feedback para o usuário utilizando o controleador "feedback.open"*/}
              {feedback.open ? (
                <Alert variant={feedback.type} onClose={() => handleRedirect()} dismissible>
                  <Alert.Heading>{(feedback.type === 'success') ? ('Sucesso!') : ('Erro!')}</Alert.Heading>
                  <p>{feedback.message}</p>

                </Alert>
              ) :
                <Button type="submit" onClick={(e) => handleSubmit(e)} variant="primary">Cadastrar</Button>
              }
            </Form>
          </Card.Body>
        </Card>)
      }      
    </Container>
  );
}

export default CreateUserForm;

import React, {useState, useEffect} from 'react';
import { useRouteMatch , Link } from "react-router-dom";
import { Container, Row, Card, Form, Button, Image, Spinner, Alert} from 'react-bootstrap';
import validate from 'validate.js';
import firebase from '../../firebaseConnection';


//Variáveis do formulário
const initialFormState = {
  isValid: false,
  loading: true,
  values: {
    name: '',
    email: '',
    password: '',
    bio: '',
    avatar: ''
  },
  errors: {
    name: [],
    email: [],
    password: [],
    bio: [],
    avatar: []
  },
  touched: {
    name: false,
    email: false,
    password: false,
    bio: false,
    avatar: false
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
  bio: {
    length: { maximum: 700, message: () => 'Este campo deve ter no máximo 700 caracteres' }
  }      
};



const EditUserForm = () => {
  const routerMatch = useRouteMatch("/user/edit/:id");
  const id = routerMatch.params.id;
  const [fileName, setFileName] = useState("Insira um arquivo válido");
  const [feedback, setFeedback] = useState(initialFeedback);
  const [formState, setFormState] = useState(initialFormState);



  //console.log(formState.values);

  const queryUserByID = () => {
    //Consultando usuário com ID passado na URL
    if(formState.loading) {
      firebase.database().ref('User').child(`${id}`).once('value', (snapshot) => {
        setFormState(formState => ({
          ...formState,
          loading: false,
          values: {
            ...formState.values,
            name: snapshot.val().name,
            email: firebase.auth().currentUser.email,
            bio: snapshot.val().bio ? snapshot.val().bio : '',
            password: firebase.auth().currentUser.password,
            avatar: snapshot.val().avatar ? snapshot.val().avatar : '' 
          },
          touched: {          
            ...formState.touched,
            name: true,
            email: true,
            password: true,
            bio: snapshot.val().bio ? true : false,
            avatar: snapshot.val().avatar ? true : false          
          }
        }));
      })
    } 
  }

  useEffect(() => {
    //Buscando usuário
    queryUserByID();
    console.log(formState.values);
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

  const handleAvatarChange = (e) => {
    setFileName(e.target.files[0].name);
    handleFieldChange(e, 'avatar', e.target.value);
  }

  const hasError = (field) => Boolean(formState.errors[field] && formState.touched[field]);

  const handleSubmit = (e) => {
    if(formState.isValid){
      // Atualizando campos no banco
      firebase.database().ref('User').child(`${id}`).set({
        name: formState.values.name,
        bio: formState.touched.bio  ?  formState.values.bio : null,
        avatar: formState.touched.avatar  ?  formState.values.avatar : null,
      });
      setFeedback({
        open: true,
        type: 'success',
        message: "Edição realizada com sucesso."
      })
    }else{
      setFeedback({
        open: true,
        type: 'danger',
        message: "Edição não concluída."
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
          <Card.Header  className="bg-dark text-white" border="warning" as="h4">Editar</Card.Header>
          
          <Card.Body>
            <Card.Title as="h4">Editar perfil</Card.Title>
            <br/>
            <Form noValidate>
              <Form.Group controlId="formBasicAvatar">
                <Image
                  width={100}
                  height={100}
                  alt="171x180"
                  src="https://elaele.com.br/img/anonimo.png"
                  roundedCircle
                />   
                <br/><br/>
                <Form.Label>Avatar Personalizado</Form.Label>
                  <Form.File 
                    id="inputGroupFile01"
                    label={fileName}
                    value={formState.values.avatar}
                    data-browse="Insira uma imagem"
                    onChange={(e) => handleAvatarChange(e)}
                    custom                
                  />
                  
                  <Form.Text className="text-muted">
                    Formatos válidos: PNG, JPEG, JPG.
                  </Form.Text>

                  {/* Mensagem de erro, caso exista */}
                  {/*<p className="text-danger">{hasError('bio') ? formState.errors.bio[0] : null}</p>*/}
              </Form.Group>   
  
              <Form.Group controlId="formBasicBio">
                <Form.Label>Descrição do seu perfil</Form.Label>
                <Form.Control 
                  as="textarea"
                  type="text"
                  isInvalid={hasError('bio') ? true : false}
                  placeholder="Descrição" 
                  value={formState.values.bio}
                  onChange={e => handleFieldChange(e, 'bio', e.target.value)}
                />                
                {/* Mensagem de erro, caso exista */}
                <Form.Text className="text-danger">
                  {hasError('bio') ? formState.errors.bio[0] : null}
                </Form.Text>                  
                
              </Form.Group>
              
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

              {/* Botao Submit e feedback para o usuário utilizando o controlador "feedback.open"*/}
              {feedback.open ? (
                <Alert variant={feedback.type} onClose={() => setFeedback({...feedback, open: false})} dismissible>
                  <Alert.Heading>{(feedback.type === 'success') ? ('Sucesso!') : ('Erro!')}</Alert.Heading>
                  <p>{feedback.message}</p>
                  <Link to={'/'}>Retornar a página inicial</Link>
                </Alert>
              ) :
                <Button type="submit" onClick={(e) => handleSubmit(e)} variant="primary">Atualizar</Button>
              }
            </Form>
          </Card.Body>
        </Card>)
      }      
    </Container>
  );
}

export default EditUserForm;

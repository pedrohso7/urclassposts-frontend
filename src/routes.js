import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Header from "./views/Header/index";
import Home from "./views/Home/index";
import Login from "./views/Login/index";
import Error from "./views/Error/index";
import EditUserForm from "./views/EditUserForm/index";
import CreateUserForm from "./views/CreateUserForm/index";


const Routes = () => {
    return(
        <BrowserRouter>
            <Header/>
            <Switch>
                <Route exact path = "/login" component = {Login}/>
                <Route exact path = "/" component = {Home}/>
                <Route exact path = "/user/create" component = {CreateUserForm}/>
                <Route exact path = "/user/edit/:id" component = {EditUserForm}/>
                <Route path = "*" component = {Error}/>
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;
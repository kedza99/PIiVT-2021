import React from 'react';
import './Application.sass';
import {Container} from 'react-bootstrap'
import TopMenu from '../TopMenu/TopMenu';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AboutUs from '../AboutUs/AboutUs';
import SpecialOfferPage from '../SpecialOfferPage/SpecialOfferPage';
import AdministratorLogin from '../Administrator/AdministratorLogin';

export default function Application() {
  return (
    <BrowserRouter>
      <Container fluid className="Application">
          <div className="Application-header">
              Animator app
          </div>
          <TopMenu/>
          <div className="Application-body">
            <Switch>
              <Route path="/aboutUs" component={ AboutUs }/>

              <Route exact path="/">
                <SpecialOfferPage/>
              </Route>
              <Route path="/animator">
                Animators
              </Route>
              <Route path="/reservation">
                Animators
              </Route>
              <Route path="/administrator/login" component={AdministratorLogin} />
            </Switch>
          </div>
          <div>
            &copy; 2021...
          </div>
      </Container>
    </BrowserRouter>
    
  );
}



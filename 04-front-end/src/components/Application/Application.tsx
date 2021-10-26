import React from 'react';
import './Application.sass';
import {Container} from 'react-bootstrap'
import TopMenu from '../TopMenu/TopMenu';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AboutUs from '../AboutUs/AboutUs';
import SpecialOfferPage from '../SpecialOfferPage/SpecialOfferPage';
import AdministratorLogin from '../Administrator/AdministratorLogin';
import EventRegister from '../../api/EventRegister';
import api from '../../api/api';
class ApplicationState {
  authorizedRole: "administrator" | "visitor" = "visitor";
}
export default class Application extends React.Component{
  state: ApplicationState;

  constructor(props: any) {
    super(props);

    this.state = {
      authorizedRole: "visitor",
    };
  }

  componentDidMount() {
    EventRegister.on("AUTH_EVENT", this.authEventHandler.bind(this));

    this.checkRole();
  }

  componentWillUnmount() {
    EventRegister.off("AUTH_EVENT", this.authEventHandler.bind(this));
  }

  private authEventHandler(message: string) {
    console.log('Application: authEventHandler: ', message);

    if (message === "force_login" || message === "administrator_logout") {
      return this.setState({ authorizedRole: "visitor" });
    }

    if (message === "administrator_login") {
      return this.setState({ authorizedRole: "administrator" });
    }
  }

  private checkRole() {
    api("get", "/auth/" + "administrator" + "/ok")
      .then(res => {
        if (res?.data === "OK") {
          this.setState({
            authorizedRole: "administrator",
          });
          EventRegister.emit("AUTH_EVENT", "administrator" + "_login");
        }
      })
      .catch(() => {});
  }

  render(){
    return (
      <BrowserRouter>
        <Container fluid className="Application">
            <div className="Application-header">
                Animator app
            </div>
            <TopMenu currentMenuType={ this.state.authorizedRole } />
            <div className="Application-body">
              <Switch>
                <Route path="/aboutUs">
                  <AboutUs/>
                </Route>

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
}



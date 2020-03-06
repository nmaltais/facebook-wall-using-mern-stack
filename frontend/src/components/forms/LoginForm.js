import React from 'react';
import { Button, Form, Transition} from 'semantic-ui-react';

class LoginForm extends React.Component {
  state = {
    email: '',
    password: '',
    visible: true
  };

  static getDerivedStateFromProps(props, state) {
      if(props.errors && props.errors !== state.errors){
          return { visible: !state.visible, errors : props.errors };
      }else{
          return null;
      }
  }

  handle_change = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  render() {
    return (
        <React.Fragment>
        <Transition animation='shake' duration='500' visible={this.state.visible}>
              <div>
              <Form onSubmit={e => this.props.handle_login(e, this.state)} directional ='true' style={{textAlign:'center'}}>
                  <h1>Login</h1>
                  <Form.Input icon='mail' name='email' placeholder='Email'
                      value={this.state.email}
                      onChange={this.handle_change}
                  />
                  <Form.Input icon='lock' name='password' type='password' placeholder='Password'
                      value={this.state.password}
                      onChange={this.handle_change}
                  />
                  <Button content='Login' primary />
                  <p style={{color:'red'}}>{this.props.errors}</p>
              </Form>
              </div>
        </Transition>
        </React.Fragment>
    );
  }
}

export default LoginForm;

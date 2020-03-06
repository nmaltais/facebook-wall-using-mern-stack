import React from 'react';
import { Button, Form } from 'semantic-ui-react';

class SignupForm extends React.Component {
  state = {
    username: '',
    email: '',
    password1: '',
    password2: '',
    displayed: ''
  };

  handle_change = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  displayForm = e => {
      this.setState({displayed: true});
  }

  render() {
    return (
        <React.Fragment>

            {this.state.displayed ?
                <React.Fragment>
                <Form onSubmit={e => this.props.handle_signup(e, this.state)} style={{textAlign:'center'}}>
                    <h1>Sign Up</h1>
                    <Form.Input required
                        type='text' name='username'
                        icon='user' placeholder='Username'
                        value={this.state.username}
                        onChange={this.handle_change}
                    /><span></span>

                    <Form.Input required
                        type='text' name='email'
                        icon='mail' placeholder='Email'
                        value={this.state.email}
                        onChange={this.handle_change}
                    /><span></span>

                    <Form.Input required
                        type='password' name='password1'
                        icon='lock' placeholder='Password'
                        value={this.state.password1}
                        onChange={this.handle_change}
                    /><span></span>

                    <Form.Input required
                        type='password' name='password2'
                        icon='lock' placeholder='Password (confirm)'
                        value={this.state.password2}
                        onChange={this.handle_change}
                    /><span></span>

                    <Button content='Submit' primary />
                    <p style={{color:'red'}}>{this.props.errors?this.props.errors:''}</p>
                </Form>
                </React.Fragment>
            :
            <Button onClick={this.displayForm} content='Sign up' icon='signup' size='big' />
            }
            </React.Fragment>

    );
  }
}

export default SignupForm;

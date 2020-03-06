import React from 'react';
import LoginForm from './forms/LoginForm';
import SignupForm from './forms/SignupForm';
import { Divider, Grid, Segment } from 'semantic-ui-react';

function LoginPage(props) {

  return <div>
    <Segment placeholder>
      <Grid columns={2} stackable>
          <Grid.Column verticalAlign='middle'>
              <LoginForm handle_login={props.handle_login} errors={props.login_errors} />
          </Grid.Column>

          <Grid.Column verticalAlign='middle'>
              <SignupForm  handle_signup={props.handle_signup} errors={props.signup_errors} />
          </Grid.Column>
      </Grid>
      <Divider vertical clearing>OR</Divider>
    </Segment>
    </div>;
}

export default LoginPage;

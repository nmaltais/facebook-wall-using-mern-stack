import React from 'react';
import { Menu , Segment, Icon, Dropdown} from 'semantic-ui-react';
import '../scss/Nav.scss';

function Nav(props) {

  return <div>
  {!props.user ?
      <Segment className='nav' >
        The Wall
      </Segment>

      :

      <Segment className='nav'>
        <Menu className='Menu' compact floated>
          <Dropdown item icon='settings' simple>
            <Dropdown.Menu><Dropdown.Divider />
              <Dropdown.Item ><Icon name='user' size='big' bordered circular/>{props.user.username}</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="Item" onClick={props.handle_logout}>Logout <Icon color='grey' name='power off' /></Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu>
        The Wall
      </Segment>
  }</div>;
}

export default Nav;

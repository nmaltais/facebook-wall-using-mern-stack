import React from 'react';
import { Menu , Segment, Icon, Dropdown, Label} from 'semantic-ui-react';
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
              <Dropdown.Item>
              <Label circular color={props.user.avatarColor} style={{width: '30px', height:'30px', verticalAlign: 'center', fontSize:'15px'}}>{ props.user.username[0].toUpperCase() }</Label>
              <span style={{color:'white'}}>{props.user.username}</span>
              </Dropdown.Item>
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

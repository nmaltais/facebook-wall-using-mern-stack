import React, {Component} from 'react';
import { Icon, Popup, Button} from 'semantic-ui-react';

class PostReactionButton extends Component{

    constructor(props){
        super(props);

        this.state = {
            isOpen:false
        };
    }

    handleReactionPick = (reactionType) => {
        this.props.react_to_post(this.props.post, reactionType);
        this.setState({isOpen: false});
    }
    handleOpen = () => {
        this.setState({ isOpen: true });
    }
    handleClose = () => {
        this.setState({ isOpen: false });
    }

    render() {
        let post = this.props.post;
        let reaction = post.Reactions.filter(reaction => reaction.User._id == this.props.userID)[0];
        let reactionIcon = null;
        if(reaction){
            switch(reaction.Type){
                case 'Like':
                    reactionIcon = <span><Icon name='thumbs up' color='blue' /> Like</span>
                break;
                case 'Love':
                    reactionIcon = <span><Icon name='heart' color='red' /> Love</span>
                break;
                case 'Dislike':
                    reactionIcon = <span><Icon name='thumbs down' color='black' /> Dislike</span>
                break;
                case 'WTF':
                    reactionIcon = <span><Icon name='meh' color='pink' /> ???</span>
                break;
                case 'Sad':
                    reactionIcon = <span><Icon name='tint' color='teal' /> Sad</span>
                break;
                case 'Happy':
                    reactionIcon = <span><Icon name='smile' color='yellow' /> Happy</span>
                break;
                case 'Hot':
                    reactionIcon = <span><Icon name='fire' color='orange' /> Hot</span>
                break;
            }
        } else {
            reactionIcon = <span><Icon name='thumbs up outline' color='grey' /> Like</span>
        }

        return <Popup
                  mouseEnterDelay={500}
                  mouseLeaveDelay={500}
                  on='hover'
                  hideOnScroll
                  position='top center'
                  hoverable
                  open = {this.state.isOpen}
                  onOpen={this.handleOpen}
                  onClose={this.handleClose}
                  trigger={<Button fluid style={{backgroundColor:'white'}}
                          onClick={() => {this.props.react_to_post(post, reaction?reaction.Type:'Like')}}
                          >{reactionIcon}</Button>}
                >
                    <Popup
                      trigger={<Icon name='thumbs up' color='blue' onClick={() => {this.handleReactionPick('Like')}}/>}
                      content='Like'
                      position='top center'
                      size='mini'
                      inverted
                    />
                    <Popup
                      trigger={<Icon name='heart' color='red' onClick={() => {this.handleReactionPick('Love')}}/>}
                      content='Love'
                      position='top center'
                      size='mini'
                      inverted
                    />
                    <Popup
                      trigger={<Icon name='fire' color='orange' onClick={() => {this.handleReactionPick('Hot')}}/>}
                      content='Hot'
                      position='top center'
                      size='mini'
                      inverted
                    />
                    <Popup
                      trigger={<Icon name='smile' color='yellow' onClick={() => {this.handleReactionPick('Happy')}}/>}
                      content='Happy'
                      position='top center'
                      size='mini'
                      inverted
                    />
                    <Popup
                      trigger={<Icon name='meh' color='pink' onClick={() => {this.handleReactionPick('WTF')}}/>}
                      content='???'
                      position='top center'
                      size='mini'
                      inverted
                    />
                    <Popup
                      trigger={<Icon name='tint' color='teal' onClick={() => {this.handleReactionPick('Sad')}}/>}
                      content='Sad'
                      position='top center'
                      size='mini'
                      inverted
                    />
                    <Popup
                      trigger={<Icon name='thumbs down' color='black' onClick={() => {this.handleReactionPick('Dislike')}}/>}
                      content='Dislike'
                      position='top center'
                      size='mini'
                      inverted
                    />
                </Popup>
    }


}

export default PostReactionButton;

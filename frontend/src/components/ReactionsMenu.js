import React, {Component} from 'react';
import {Popup} from 'semantic-ui-react';
import ReactionIcon from './ReactionIcon';

class ReactionsMenu extends Component{

    constructor(props){
        super(props);

        this.state = {
            isOpen:false
        };
    }

    handleReactionPick = (reactionType) => {
        console.log('item');
        console.log(this.props.item);
        
        
        this.props.react_to_item(this.props.item, reactionType);
        this.setState({isOpen: false});
    }
    handleOpen = () => {
        this.setState({ isOpen: true });
    }
    handleClose = () => {
        this.setState({ isOpen: false });
    }

    render() {

        let reactionTypes = ['Like','Love','Hot','Sad','Dislike']

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
                  trigger={this.props.trigger}
                >
                  
                  {reactionTypes.map(reactionType => {
                           return <Popup
                           trigger={<span onClick={() => {this.handleReactionPick(reactionType)}}><ReactionIcon reactionType={reactionType} /></span>}
                           content={reactionType}
                           position='top center'
                           size='mini'
                           inverted
                         />
                      })}
              </Popup>
    }


}

export default ReactionsMenu;

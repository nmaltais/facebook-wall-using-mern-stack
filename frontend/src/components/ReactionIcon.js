import React from 'react';
import { Icon } from 'semantic-ui-react';

function ReactionIcon(props){

    let icon = null;
    switch(props.reactionType){
        case 'Like':
            icon = <Icon name='thumbs up' color='blue' circular inverted size='small'/>
        break;
        case 'Love':
            icon = <Icon name='heart' color='red' circular inverted size='small'/>
        break;
        case 'Dislike':
            icon = <Icon name='thumbs down' color='black' circular inverted size='small'/>
        break;
        case 'Sad':
            icon = <Icon name='tint' color='teal' circular inverted size='small'/>
        break;
        case 'Hot':
            icon = <Icon name='fire' color='orange' circular inverted size='small'/>
        break;

    }
    return icon;
}

export default ReactionIcon;

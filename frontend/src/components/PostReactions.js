import React from 'react';
import { Icon, Popup} from 'semantic-ui-react';

function PostReactions(props){

    let reactions = props.post.Reactions;

    let reactionsDisplay = {};

    reactions.forEach(reaction => {
        if(reactionsDisplay[reaction.Type] == undefined){
            reactionsDisplay[reaction.Type] = [reaction.User];
        }else{
            reactionsDisplay[reaction.Type].push(reaction.User);
        }
    });

    let reactionComponents =
    <div>
        {Object.keys(reactionsDisplay).map((reactionType,index) => {
            let users = reactionsDisplay[reactionType];
            let count = users.length;
            let item = null;
            switch(reactionType){
                case 'Like':
                    item = <span key={index}><Icon name='thumbs up' color='blue' />{count} </span>
                break;
                case 'Love':
                    item = <span key={index}><Icon name='heart' color='red' />{count} </span>
                break;
                case 'Dislike':
                    item = <span key={index}><Icon name='thumbs down' color='black' />{count} </span>
                break;
                case 'WTF':
                    item = <span key={index}><Icon name='meh' color='pink' />{count} </span>
                break;
                case 'Sad':
                    item = <span key={index}><Icon name='tint' color='teal' />{count} </span>
                break;
                case 'Happy':
                    item = <span key={index}><Icon name='smile' color='yellow' />{count} </span>
                break;
                case 'Hot':
                    item = <span><Icon name='fire' color='orange' />{count} </span>;
                break;

            }
            return <Popup key={index}
                      trigger={item}
                      content={users.map(user => {
                           return <span key={user.username}>{user.username}<br/></span>
                      })}
                      on='hover'
                      hideOnScroll
                      position='top center'
                      hoverable
                      size='mini'
                      inverted
                   />
        })
        }
    </div>

    return (
        reactionComponents
    );
}

export default PostReactions;

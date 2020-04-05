import React from 'react';
import { Popup} from 'semantic-ui-react';
import ReactionIcon from './ReactionIcon';

function PostReactions(props){

    let reactions = props.post.Reactions;

    let reactionsDisplay = {};

    reactions.forEach(reaction => {
        if(reactionsDisplay[reaction.Type] === undefined){
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
            
            let item = <span key={index}><ReactionIcon reactionType={reactionType} />{count} </span>
            
            return <Popup key={index}
                      trigger={item}
                      content= {<><div style={{fontWeight:'900', fontSize:'13px'}}>{reactionType}</div> {users.map(user => {
                           return <span key={user.username}>{user.username}<br/></span>
                      })}</>}
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

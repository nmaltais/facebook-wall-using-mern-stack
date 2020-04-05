import React from 'react';
import { Label, Popup} from 'semantic-ui-react';
import ReactionIcon from './ReactionIcon';

function CommentReactions(props){

    const reactionsLabelStyle = {
        fontSize: '11px',
        lineHeight: '16px',
        fontWeight: 400,
        color: 'rgb(141,148,158)',

        padding: '2px 5px 2px 3px',
        whiteSpace: 'nowrap',
        position: 'absolute',
        top: '65%',
        display: 'block',

        cursor: 'pointer',
        borderRadius:'12px',
        boxShadow: 'rgba(0,0,0,0.2) 0px 1px 3px 0px'
    }


    let reactionsDisplay = {};
    props.comment.Reactions.forEach(reaction => {
        if(reactionsDisplay[reaction.Type] === undefined){
            reactionsDisplay[reaction.Type] = [reaction.User];
        }else{
            reactionsDisplay[reaction.Type].push(reaction.User);
        }
    });
    let content = Object.keys(reactionsDisplay).map((reactionType,index) => {
        let users = reactionsDisplay[reactionType];
        let count = users.length;
        let item = <span key={index}><ReactionIcon reactionType={reactionType} /></span>
        let usersList = count > 1 ? count : <>{count} {users.map(user => { return <><br/><span style={{color:'#ccc'}} key={user.username}>{user.username}</span></> }) }</>
                
        return index===0 ? <>{item}{usersList}</>: <><br/><br/>{item}{usersList}</>;
    });
    let trigger = <Label basic floating style={reactionsLabelStyle}>
                    {
                        Object.keys(reactionsDisplay).map((reactionType,index) => {
                            return <span key={index} style={{marginRight:'-5px'}}><ReactionIcon reactionType={reactionType} /></span>
                        })
                    }
                    <span style={{marginLeft:'5px'}} >{props.comment.Reactions.length}</span>
                  </Label>

    return <Popup
                trigger={trigger}
                content={content}
                position='top center'
                size='mini'
                inverted
            />
}

export default CommentReactions;

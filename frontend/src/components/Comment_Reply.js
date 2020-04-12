import React from 'react';
import { Label, Grid} from 'semantic-ui-react';
import ReactionsMenu from './ReactionsMenu';
import CommentReactions from './CommentReactions';
import '../scss/Comment_Reply.scss';

class Comment_Reply extends React.Component{

    constructor(props){
        super(props);
        this.state = {seeMore : false, reactions:null, replies:null};
    }

    formatDateTime = (string) => {
        let inputDate = new Date(string);
        let inputMinutes = inputDate.getMinutes();
        let inputHours = inputDate.getHours();
        let inputDay = inputDate.getDate();
        let inputMonth = inputDate.getMonth();
        let inputYear = inputDate.getFullYear();

        let currentDate = new Date();
        let currentMinutes = currentDate.getMinutes();
        let currentHours = currentDate.getHours();
        let currentDay = currentDate.getDate();
        let currentYear = currentDate.getFullYear();

        let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        if(inputYear===currentYear){
            //This year
            if(inputDay===currentDay){
                //Sometime today
                if(inputHours===currentHours || currentMinutes-inputMinutes < 60){
                    //Within the last hour
                    let  minsAgo = null
                    if (inputHours===currentHours) minsAgo = currentMinutes-inputMinutes;
                    else {minsAgo = (60-inputMinutes)+currentMinutes; }
                    if(currentMinutes-inputMinutes === 0){
                        return 'now';
                    }else{
                        return `${minsAgo}m`;
                    }
                }
                else{
                    if(currentMinutes-inputMinutes > 30){ //Rounding hours
                        return `${currentHours-inputHours+1}h`;
                    }else{
                        return `${currentHours-inputHours}h`;
                    }
                }
            } else if (currentDay-1===inputDay) {
                //Yesterday
                return `Yesterday at ${inputHours}:${inputMinutes}`
            } else {
                return `${months[inputMonth]} ${inputDay}`;
            }
        } else {
            return `${months[inputMonth]} ${inputDay}, ${inputYear}`;
        }
    }

    react_to_item = (item, reactionType) => {
        let reaction = item.Reactions.filter(reaction => reaction.User._id === this.props.user._id)[0];
        
        let action = null;
        
        if(reaction === undefined){
            action = 'POST';
        } else if(reaction.Type === reactionType){
            action = 'DELETE';
        } else if (reaction.Type !== reactionType){
            action = 'PUT';
        }

        if(action){
            let url = `http://127.0.0.1:3000/comments/${item._id}/reactions`;
            fetch(url, {
                method: action,
                headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + localStorage.getItem("token")
                }
                , body : JSON.stringify({Type: reactionType})
            })
            .then(response => response.json())
            .then(json => {
                this.setState({reactions: json});
            });

        }else{
            console.log('Error: Could not react to post.');
        }
    }

    render(){
        
        let reply = this.props.reply;
        reply.Reactions = this.state.reactions ?? reply.Reactions;
        reply.Replies = this.state.replies ?? reply.Replies;

        let replyText = reply.Text;
        if(reply.Text.length > 420 && !this.state.seeMore){
            replyText = (<>{reply.Text.slice(0,350)}... <button className='SeeMoreBtn' onClick={()=>this.setState({seeMore : true})}>See More</button></>)
        }
        else if(reply.Text.split(/\r\n|\r|\n/).length > 3 && !this.state.seeMore){
            let arr = reply.Text.split(/\r\n|\r|\n/);
            replyText = (<>{arr[0]+'\n'+arr[1]+'\n'+arr[2]}... <button className='SeeMoreBtn' onClick={()=>this.setState({seeMore : true})}>See More</button></>)
        }

        let createReactButton = () => {
            let reaction = reply.Reactions.filter(reaction => reaction.User._id === this.props.user._id)[0];
            
            let reactionIcon = null;
            if(reaction){
                reactionIcon = <button onClick={()=>{this.react_to_item(reply, reaction.Type)}} className={`LinkBold ${reaction.Type}`}>{reaction.Type}</button>
            } else {
                reactionIcon = <button onClick={()=>{this.react_to_item(reply, 'Like')}} className='Link Like'>Like</button>
            }
            return reactionIcon;
        }

        return(
            <Grid style={{margin:'-10px 0px -20px -20px'}}>
                    <Grid.Column width={2} style={{margin:'0px -20px 0px 0px'}}>
                    <Label circular color={reply.Author.avatarColor} className='ReplyAvatar'>{ reply.Author.username[0].toUpperCase() }</Label>

                    </Grid.Column>
                    <Grid.Column width={14}>
                        <Grid.Row style={{margin:'0px !important', padding:'0px !important'}}>
                            <span className='reply'>
                                <a href={`/wall/${reply.Author.username}`} className='Author'>{reply.Author.username}</a> {replyText} 
                                <CommentReactions reactions={reply.Reactions}/>
                            </span>
                        </Grid.Row>
                        <Grid.Row style={{margin:'0px !important', padding:'0px !important'}}>
                            <div style={{marginLeft:'8px', marginBottom:'8px'}}>
                            <ReactionsMenu  trigger={createReactButton()} 
                                                react_to_item={this.react_to_item} 
                                                item={reply}
                                                userID={this.props.user._id}/>
                                 · <button className='Link' onClick={()=>{ this.props.replyFormRef.current.setState({Text: reply.Author.username+' '});
                                   this.props.replyFormRef.current.focus(); }}>Reply</button> · <span className='FormatedDate'>{this.formatDateTime(reply.createdAt)}</span></div>
                        </Grid.Row>
                    </Grid.Column>
            </Grid>
        )
    }

}
export default Comment_Reply;

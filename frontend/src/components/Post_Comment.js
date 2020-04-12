import React from 'react';
import { Label, Grid} from 'semantic-ui-react';
import ReactionsMenu from './ReactionsMenu';
import CommentReactions from './CommentReactions';
import CreateCommentForm from './forms/CreateCommentForm';
import Comment_Reply from './Comment_Reply';
import '../scss/Post_Comment.scss';

class Post_Comment extends React.Component{

    constructor(props){
        super(props);
        this.state = {seeMore : false, showReplyForm:false, replies:null, reactions:null, replyFormRef:React.createRef()};
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

    submitReply = (event, data) => {

        fetch('http://127.0.0.1:3000/comments/'+this.props.comment._id+'/replies', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + localStorage.getItem("token")
            }
            , body : JSON.stringify(data)
        })
        .then(response => response.json())
        .then(replies => {
            this.setState({replies: replies, showReplyForm:false});
        });

        event.preventDefault();
    }

    

    render(){
        let comment = this.props.comment;
        comment.Reactions = this.state.reactions ?? comment.Reactions;
        comment.Replies = this.state.replies ?? comment.Replies;

        let commentText = comment.Text;
        if(comment.Text.length > 420 && !this.state.seeMore){
            commentText = (<>{comment.Text.slice(0,350)}... <button className='SeeMoreBtn' onClick={()=>this.setState({seeMore : true})}>See More</button></>)
        }
        else if(comment.Text.split(/\r\n|\r|\n/).length > 3 && !this.state.seeMore){
            let arr = comment.Text.split(/\r\n|\r|\n/);
            commentText = (<>{arr[0]+'\n'+arr[1]+'\n'+arr[2]}... <button className='SeeMoreBtn' onClick={()=>this.setState({seeMore : true})}>See More</button></>)

        }

        let showReplyForm = () => {
            if(comment.Replies.length > 0){
                this.state.replyFormRef.current.focus();
                return;
            } 
            if(!this.state.showReplyForm){
                this.setState({showReplyForm: true});
            }else{
                this.state.replyFormRef.current.focus();
            }
        }

        let createReactButton = () => {
            let reaction = comment.Reactions.filter(reaction => reaction.User._id === this.props.user._id)[0];
            
            let reactionIcon = null;
            if(reaction){
                reactionIcon = <button onClick={()=>{this.react_to_item(comment, reaction.Type)}} className={`LinkBold ${reaction.Type}`}>{reaction.Type}</button>
            } else {
                reactionIcon = <button onClick={()=>{this.react_to_item(comment, 'Like')}} className={`Link Like`}>Like</button>
            }
            return reactionIcon;
        }


        let Replies = comment.Replies.map(reply => {
            return <Comment_Reply key={reply._id} reply={reply} user={this.props.user} replyFormRef={this.state.replyFormRef} react_to_item={this.react_to_item}/>;
            // return <Post_Comment key={reply._id} comment={reply} user={this.props.user} react_to_item={this.react_to_item}/>;
        });
        
        const ref = React.createRef();
        return(
            <Grid style={{margin:'-15px 0px -20px -20px'}}>
                    <Grid.Column width={2} style={{margin:'0px -20px 0px 0px'}}>
                    <Label circular color={comment.Author.avatarColor} className='CommentAvatar'>{ comment.Author.username[0].toUpperCase() }</Label>

                    </Grid.Column>
                    <Grid.Column width={14}>
                        <Grid.Row style={{margin:'0px !important', padding:'0px !important'}}>
                            <span className='comment'>
                                <a href={`/wall/${comment.Author.username}`} className='Author'>{comment.Author.username}</a> {commentText} 
                                <CommentReactions reactions={comment.Reactions}/>
                            </span>
                        </Grid.Row>
                        <Grid.Row style={{margin:'0px !important', padding:'0px !important'}}>
                            <div style={{marginLeft:'8px', marginBottom:'8px'}}>
                            <ReactionsMenu  trigger={createReactButton()} 
                                                react_to_item={this.react_to_item} 
                                                item={comment}
                                                userID={this.props.user._id}/>
                                 · <button className='Link' onClick={()=>{ showReplyForm(); }}>Reply</button> · <span className='FormatedDate'>{this.formatDateTime(comment.createdAt)}</span></div>
                        </Grid.Row>
                        <Grid.Row style={{margin:'0px !important', padding:'0px !important'}}>
                            {Replies}
                            {
                                comment.Replies.length > 0 || this.state.showReplyForm ?
                                <CreateCommentForm 
                                    focusOnRender={this.state.showReplyForm}
                                    placeHolder='Write a reply...'
                                    ref={this.state.replyFormRef}
                                    user={this.props.user} 
                                    submitComment={this.submitReply} 
                                />
                                :''
                            }
                        </Grid.Row>
                    </Grid.Column>
            </Grid>
        )
    }

    // value={comment.Author.username + ' '}
}

export default Post_Comment;

import React from 'react';
import { Label, Grid} from 'semantic-ui-react';
import ReactionsMenu from './ReactionsMenu';
import CommentReactions from './CommentReactions';
import '../scss/Post_Comment.scss';

class Post_Comment extends React.Component{

    constructor(props){
        super(props);
        this.state = {seeMore : false};
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
                    if(currentMinutes-inputMinutes == 0){
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

    render(){
        let comment = this.props.comment;

        let commentText = comment.Text;
        if(comment.Text.length > 420 && !this.state.seeMore){
            commentText = (<>{comment.Text.slice(0,350)}... <a className='SeeMoreBtn' onClick={()=>this.setState({seeMore : true})}>See More</a></>)
        }
        else if(comment.Text.split(/\r\n|\r|\n/).length > 3 && !this.state.seeMore){
            let arr = comment.Text.split(/\r\n|\r|\n/);
            commentText = (<>{arr[0]+'\n'+arr[1]+'\n'+arr[2]}... <a className='SeeMoreBtn' onClick={()=>this.setState({seeMore : true})}>See More</a></>)

        }

        let createReactButton = () => {
            let reaction = comment.Reactions.filter(reaction => reaction.User._id == this.props.user._id)[0];
            
            let reactionIcon = null;
            if(reaction){
                reactionIcon = <a onClick={()=>{this.props.react_to_item(comment, reaction.Type)}} className='LinkBold'>{reaction.Type}</a>
            } else {
                reactionIcon = <a onClick={()=>{this.props.react_to_item(comment, 'Like')}} className='Link'>Like</a>
            }
            return reactionIcon;
        }

        return(
            <Grid style={{margin:'-15px 0px -20px -20px'}}>
                    <Grid.Column width={2} style={{margin:'0px -20px 0px 0px'}}>
                    <Label circular color={comment.Author.avatarColor} className='CommentAvatar'>{ comment.Author.username[0].toUpperCase() }</Label>

                    </Grid.Column>
                    <Grid.Column width={14}>
                        <Grid.Row style={{margin:'0px !important', padding:'0px !important'}}>
                            <span className='comment'>
                                <a className='Author'>{comment.Author.username}</a> {commentText} 
                                <CommentReactions comment={comment}/>
                            </span>
                        </Grid.Row>
                        <Grid.Row style={{margin:'0px !important', padding:'0px !important'}}>
                            <div style={{marginLeft:'8px', marginBottom:'8px'}}>
                            <ReactionsMenu  trigger={createReactButton()} 
                                                react_to_item={this.props.react_to_item} 
                                                item={comment}
                                                userID={this.props.user._id}/>
                                 · <a className='Link'>Reply</a> · <span className='FormatedDate'>{this.formatDateTime(comment.createdAt)}</span></div>
                        </Grid.Row>
                    </Grid.Column>
            </Grid>
        )
    }

}

export default Post_Comment;

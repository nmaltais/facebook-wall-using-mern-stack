import React from 'react';
import { Card, Icon, Label, Button, Grid} from 'semantic-ui-react';
import PostReactions from './PostReactions';
import ReactionsMenu from './ReactionsMenu';
import CreateCommentForm from './forms/CreateCommentForm';
import Post_Comment from './Post_Comment';
import ReactionIcon from './ReactionIcon';
import '../scss/Post.scss';

class Post extends React.Component {

    constructor(props){
        super(props);
        this.state = { comments: null, reactions: null, showCommentForm:false}
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
                    let  minsAgo = null
                    if (inputHours===currentHours) minsAgo = currentMinutes-inputMinutes;
                    else {minsAgo = (60-inputMinutes)+currentMinutes; }
                    //Within the last hour
                    if(currentMinutes-inputMinutes === 0){
                        return 'now';
                    }else{
                        return `${minsAgo} minutes ago`;
                    }
                }else{
                    if(currentMinutes-inputMinutes > 30){ //Rounding hours
                        return `${currentHours-inputHours+1} hours ago`;
                    }else{
                        return `${currentHours-inputHours} hours ago`;
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

    submitComment = (event, data) => {

        fetch('http://127.0.0.1:3000/posts/'+this.props.post._id+'/comments', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + localStorage.getItem("token")
            }
            , body : JSON.stringify(data)
        })
        .then(response => response.json())
        .then(json => {
            json[json.length - 1].Author = this.props.user;
            this.setState({comments: json});
        });

        event.preventDefault();
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
            let url = `http://127.0.0.1:3000/posts/${item._id}/reactions`;
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

    

    render() {
        
        let post = this.props.post;
        post.Reactions = this.state.reactions ?? post.Reactions;
        post.Comments = this.state.comments ?? post.Comments;

        let showCommentForm = (ref) => {
            if(post.Comments.length > 0){
                ref.current.focus();
                return;
            } 
            if(!this.state.showCommentForm){
                this.setState({showCommentForm: true});
            }else{
                ref.current.focus();
            }
        }

        let createReactButton = () => {
            
            let reaction = (this.state.reactions ?? post.Reactions).filter(reaction => reaction.User._id === this.props.user._id)[0];
            let reactionIcon = null;
            
            if(reaction){
                reactionIcon = <span><ReactionIcon reactionType={reaction.Type} /> {reaction.Type}</span>
            } else {
                reactionIcon = <span><Icon name='thumbs up outline' color='grey' /> Like</span>
            }

            return <Button className='PostReactBtn' fluid 
                    onClick={() => {this.react_to_item(post, reaction?reaction.Type:'Like')}}
                    >{reactionIcon}</Button>
        }


        const ref = React.createRef();
        
        let Comments = (this.state.comments ?? post.Comments).map(comment => {
            return <Post_Comment key={comment._id} comment={comment} user={this.props.user} react_to_item={this.react_to_item}/>;
        });

        return (
            <React.Fragment>
                <Card fluid style={{textAlign:'left'}}>
                    <Card.Content style={{paddingBottom:'0px'}}>
                        {this.props.user.username === this.props.wallOwner ?
                            <div style={{float:'right', cursor:'pointer'}} onClick={this.props.delete_post}>
                              <i className="delete icon normal"></i>
                            </div>
                            : ''}

                        <Label circular color={post.Author.avatarColor} className='Avatar'>{ post.Author.username[0].toUpperCase() }</Label>

                        <Card.Header>
                            <a href={'/wall/'+post.Author.username} className='AuthorName'>{post.Author.username}</a>
                        </Card.Header>
                        <Card.Meta>
                            <span className='FormattedDate'>{this.formatDateTime(post.createdAt)}</span>
                        </Card.Meta>
                        <br></br>
                        <Card.Description className='PostText'>
                            {post.Text}
                        </Card.Description>
                        <br></br>
                        <PostReactions reactions={this.state.reactions ?? post.Reactions}/>
                        <hr></hr>
                        <Grid columns={2} stackable style={{marginTop:'-20px'}}>
                            <Grid.Row>
                            <Grid.Column>
                                <ReactionsMenu  trigger={createReactButton()} 
                                                react_to_item={this.react_to_item} 
                                                item={post} 
                                                userID={this.props.user._id}/>
                            </Grid.Column>
                            <Grid.Column>
                            <Button className='PostCommentBtn' fluid onClick={() => {showCommentForm(ref);}}>
                                <Icon name='comment outline' color='grey' style={{marginTop:'-10px'}} /> Comment </Button>
                            </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Card.Content>
                    {
                        post.Comments.length > 0 || this.state.showCommentForm ?
                        <Card.Content extra>
                            {Comments}
                            <CreateCommentForm focusOnRender={this.state.showCommentForm} user={this.props.user} ref={ref} submitComment={this.submitComment} />
                        </Card.Content>
                        :''
                    }
                </Card>
            </React.Fragment>
        );
    }
}

export default Post;

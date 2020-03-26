import React from 'react';
import { Card, Icon, Button, Grid} from 'semantic-ui-react';
import PostReactions from './PostReactions';
import PostReactionButton from './PostReactionButton';
import CreateCommentForm from './forms/CreateCommentForm';
import Post_Comment from './Post_Comment';

class Post extends React.Component {

    constructor(props){
        super(props);
        this.state = { comments: []}
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
                if(inputHours===currentHours){
                    //Within the last hour
                    if(currentMinutes-inputMinutes > 5){
                        //Less than 5 minutes ago
                        return 'Less than 5 minutes ago';
                    }else {
                        return `${currentMinutes-inputMinutes} minutes ago`;
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

    componentDidMount(){
        this.loadComments();
    }

    loadComments = () => {
        fetch('http://127.0.0.1:3000/posts/'+this.props.post._id+'/comments', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + localStorage.getItem("token")
            }
        })
        .then(response => {
            if(response.ok) return response.json();
            else throw response;
        })
        .then(comments => {
            console.log('Loaded comments for post '+this.props.post._id);
            console.log(comments);
            this.setState({comments: comments});
        })
        .catch((err) => {
            if(err.status === 404){
                window.location = '/wall';
            }
        });
    }

    submitComment = (event, data) => {
        console.log(event);
        console.log('Comment submitted by '+ this.props.user.username +' on post: '+this.props.post._id);

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
            this.loadComments();
            console.log('done posting comment');
        });

        event.preventDefault();
    }



    render() {
        let post = this.props.post;
        post.createdAt = this.formatDateTime(post.createdAt);


        const ref = React.createRef();

        let Comments = this.state.comments.map(comment => {
            return <Post_Comment key={comment._id} comment={comment} />;
        });


        const colors = ['red','orange','yellow','olive','green','teal','blue','violet','purple','pink','brown','grey','black'];
        return (
            <React.Fragment>
                <Card fluid style={{textAlign:'left'}}>
                    <Card.Content style={{paddingBottom:'0px'}}>
                        <div style={{float:'right', cursor:'pointer'}} onClick={this.props.delete_post}>
                          <i className="delete icon normal"></i>
                        </div>
                        <Icon style={{float:'left',marginRight:'10px'}} color={colors[post.author]} name='user secret' size='big'  bordered circular/>
                        <Card.Header style={{marginTop:'7px'}}>
                            <a href={'/wall/'+post.Author.username} style={{color:'#385898', fontFamily:'system-ui', fontSize:'14px'}}>{post.Author.username}</a>
                        </Card.Header>
                        <Card.Meta style={{color:'#616770', fontFamily:'system-ui'}}>
                            <span className='date'>{post.createdAt}</span>
                        </Card.Meta>
                        <br></br>
                        <br></br>
                        <Card.Description style={{color:'#000'}}>
                            {post.Text}
                        </Card.Description>
                        <br></br>
                        <PostReactions post={post}/>
                        <hr></hr>
                        <Grid columns={2} stackable style={{marginTop:'-20px'}}>
                            <Grid.Row>
                            <Grid.Column>
                                <PostReactionButton react_to_post={this.props.react_to_post} post={post} userID={this.props.user._id}/>
                            </Grid.Column>
                            <Grid.Column>
                            <Button fluid style={{backgroundColor:'white'}} onClick={()=>{ ref.current.focus();}}><Icon name='comment outline' color='grey'/> Comment </Button>
                            </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Card.Content>
                    <Card.Content extra>
                        {Comments}
                        <CreateCommentForm user={this.props.user} post={post} ref={ref} submitComment={this.submitComment} />
                    </Card.Content>
                </Card>
            </React.Fragment>
        );
    }
}

export default Post;

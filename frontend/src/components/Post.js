import React from 'react';
import { Card, Icon, Button, Grid, Form, Popup} from 'semantic-ui-react';
import TextareaAutosize from 'react-textarea-autosize';
import PostReactions from './PostReactions';
import PostReactionButton from './PostReactionButton';

class Post extends React.Component {
    state = {

    };

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

    render() {
        let post = this.props.data;

        let ReactionIcon = () => {
            let reaction = post.Reactions.filter(reaction => reaction.User._id == this.props.user._id)[0];
            if(reaction){
                switch(reaction.Type){
                    case 'Like':
                        return  <span><Icon name='thumbs up' color='blue' /> Like</span>
                    break;
                    case 'Love':
                        return  <span><Icon name='heart' color='red' /> Love</span>
                    break;
                    case 'Dislike':
                        return  <span><Icon name='thumbs down' color='black' /> Dislike</span>
                    break;
                    case 'WTF':
                        return  <span><Icon name='meh' color='pink' /> ???</span>
                    break;
                    case 'Sad':
                        return  <span><Icon name='tint' color='teal' /> Sad</span>
                    break;
                    case 'Happy':
                        return  <span><Icon name='smile' color='yellow' /> Happy</span>
                    break;
                    case 'Hot':
                        return  <span><Icon name='fire' color='orange' /> Hot</span>
                    break;

                }
            }else {
                return  <span><Icon name='thumbs up outline' color='grey' /> Like</span>
            }
        }

        console.log(post);
        post.createdAt = this.formatDateTime(post.createdAt);

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
                            <a href='' style={{color:'#385898', fontFamily:'system-ui', fontSize:'14px'}}>{post.Author.username}</a>
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
                            <Button fluid style={{backgroundColor:'white'}}><Icon name='comment outline' color='grey'/> Comment </Button>
                            </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Card.Content>
                    <Card.Content extra>
                            <Form>
                            <Form.Group>
                                    <Icon width='1'  name='user' size='large'  bordered circular/>
                            <Form.TextArea width='15'
                                style={{backgroundColor:'#f2f3f5', resize:'none', border:'1px solid #ccd0d5', borderRadius:'30px'}}
                                control={TextareaAutosize}
                                rows='1'
                                placeholder='Write something...'>
                            </Form.TextArea>
                            </Form.Group>
                            </Form>
                    </Card.Content>
                </Card>
            </React.Fragment>

        );
    }
}

export default Post;

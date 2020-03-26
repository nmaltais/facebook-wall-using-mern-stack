import React from 'react';
import Post from './Post';
import CreatePostForm from './forms/CreatePostForm';
import { Segment, Placeholder } from 'semantic-ui-react'
import {Grid} from 'semantic-ui-react';

class Wall extends React.Component {

    state = {
      posts : null,
      submittedPost: false
    };

    componentDidMount() {
        console.log(this.props);
        this.loadPosts();
    }

    loadPosts = () => {
        console.log(this.props.match.params.username);
        fetch('http://127.0.0.1:3000/posts/'+this.props.match.params.username, {
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
        .then(posts => {
            console.log('Loaded posts');
            console.log(posts);
            this.setState({posts: posts});
        })
        .catch((err) => {
            if(err.status === 404){
                window.location = '/wall';
            }
        });
    }

    delete_post = (postID) => {
        fetch('http://127.0.0.1:3000/posts/'+postID, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + localStorage.getItem("token")
            }
        })
        .then(response => response.json())
        .then(json => {
            console.log(json);
            this.loadPosts();
        });
    }

    react_to_post = (post, reactionType) => {

        let reaction = post.Reactions.filter(reaction => reaction.User._id == this.props.user._id)[0];


        let action = null;
        if(reaction == null){
            action = 'POST';
        } else if(reaction.Type == reactionType){
            action = 'DELETE';
        } else if (reaction.Type != reactionType){
            action = 'PUT';
        }
        console.log(post.Reactions);
        console.log(reaction);
        console.log('action');
        console.log(action);

        if(action){
            fetch('http://127.0.0.1:3000/posts/react/'+post._id, {
                method: action,
                headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + localStorage.getItem("token")
                }
                , body : JSON.stringify({Type: reactionType})
            })
            .then(response => response.json())
            .then(json => {
                this.loadPosts();
            });

        }else{
            console.log('Error: Could not react to post.');
        }

    }

    handle_newPost = (e, data) => {
        fetch('http://127.0.0.1:3000/posts/'+this.props.match.params.username, {
            method: 'POST'
            , headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + localStorage.getItem("token")
            }
            , body : JSON.stringify(data)
        })
        .then(response => {
            if(response.ok) {
                this.loadPosts();
            }else{
                console.log('failed');
            }
        });
        e.preventDefault();
    };

    render() {
        let Posts = null;
        if(this.state.posts){
            Posts = this.state.posts.map((post) =>
                <Post key={post._id} post={post} delete_post={() => this.delete_post(post._id)} react_to_post={this.react_to_post} user={this.props.user}/>
            );
        }

        return (

            <Grid centered columns={3}>
                <Grid.Row>
                    <Grid.Column>
                        <CreatePostForm handle_newPost={this.handle_newPost}/>
                        <br></br>
                        <h2>Posts</h2>
                        {Posts ? Posts
                            :
                            <Segment raised>
                                <Placeholder>
                                    <Placeholder.Header image>
                                        <Placeholder.Line />
                                        <Placeholder.Line />
                                    </Placeholder.Header>
                                    <Placeholder.Paragraph>
                                        <Placeholder.Line length='medium' />
                                        <Placeholder.Line length='short' />
                                    </Placeholder.Paragraph>
                                </Placeholder>
                            </Segment>
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        );
    }
}

export default Wall;

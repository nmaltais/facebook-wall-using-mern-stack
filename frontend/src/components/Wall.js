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
            this.loadPosts();
        });
    }

    reloadPostReactions = (post) => {
        //Find Post in posts
        
        fetch(`http://127.0.0.1:3000/posts/${post._id}/reactions`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + localStorage.getItem("token")
            }
        })
        .then(response => response.json())
        .then(post => {
            let posts = this.state.posts;
            posts.forEach(function(cPost){
                if(cPost._id === post._id){
                    cPost.Reactions = post.Reactions;
                }
            });
            this.setState({posts: posts});
        });
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
                <Post key={post._id}
                    post={post}
                    delete_post={() => this.delete_post(post._id)}
                    react_to_post={this.react_to_post}
                    reloadPostReactions={this.reloadPostReactions}
                    user={this.props.user}
                    wallOwner={this.props.match.params.username}
                />
            );
        }

        return (

            <Grid centered columns={3}>
                <Grid.Row>
                    <Grid.Column>
                        <CreatePostForm handle_newPost={this.handle_newPost} user={this.props.user}/>
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

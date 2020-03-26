import React from 'react';
import { Card, Form, Icon } from 'semantic-ui-react';
import TextareaAutosize from 'react-textarea-autosize';

class CreateCommentForm extends React.Component{

    state = {
        'Text' : ''
    }

    handleChange = (e) => {
        this.setState({Text: e.target.value});
    }

    submit = (e) => {
        // console.log('Comment submitted by '+ this.props.user.username +' on post: '+this.props.post._id);
        // console.log({'text' : this.state.Text});
        let data = {
            Author : this.props.user,
            Text: this.state.Text
        }
        this.props.submitComment(e, data);
        this.setState({Text: ''});
    }
    onEnterPress = (e) => {
      if(e.keyCode == 13 && e.shiftKey == false && this.state.Text.trim() != '') {
        e.preventDefault();
        this.submit(e);
      }
    }
    focus = () => {
        this.textarea.focus();
    }

    render(){

        const ref = React.createRef();

        return (
            <Form ref={ref} onSubmit={this.submit}>
            <Form.Group >
                <Icon width='1'  name='user' size='large'  bordered circular style={{width:'42px !important'}}/>

                <Form.Field style={{width:'90%'}}>
                    <TextareaAutosize
                        style={{backgroundColor:'#f2f3f5', resize:'none', border:'1px solid #ccd0d5', borderRadius:'30px'}}
                        rows='1'
                        placeholder='Write a comment...'
                        inputRef={ref => (this.textarea = ref)}
                        onKeyDown={this.onEnterPress}
                        onChange={this.handleChange}
                        value = {this.state.Text}
                        />
                </Form.Field>
            </Form.Group>
            </Form>
        );
    }
}
export default CreateCommentForm;

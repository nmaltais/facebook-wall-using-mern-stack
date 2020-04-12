import React from 'react';
import { Form, Label } from 'semantic-ui-react';
import TextareaAutosize from 'react-textarea-autosize';

class CreateCommentForm extends React.Component{

    state = {
        Text : ''
    }

    static getDerivedStateFromProps(props, state){
        if(state.Text === '' && props.value != null){
            return {Text: props.value};
        } else {
            return null;
        }
    }

    handleChange = (e) => {
        this.setState({Text: e.target.value});
    }

    submit = (e) => {
        let data = {
            Author : this.props.user,
            Text: this.state.Text
        }
        this.setState({Text: ''});
        this.props.submitComment(e, data);
    }
    onEnterPress = (e) => {
      if(e.keyCode === 13 && e.shiftKey === false && this.state.Text.trim() !== '') {
        e.preventDefault();
        this.submit(e);
      }
    }
    focus = () => {
        this.textarea.focus();
    }

    componentDidMount(){
        if(this.props.focusOnRender){
            this.focus();
        }
        // if(this.props.placeHolder){
        //     this.focus();
        // }
    }
    moveCaretAtEnd(e) { //Move cursor at end of text after auto focus
        var temp_value = e.target.value;
        e.target.value = '';
        e.target.value = temp_value;
    }

    render(){

        const ref = React.createRef();

        return (
            <Form ref={ref} onSubmit={this.submit} style={{marginTop:'10px'}}>
            <Form.Group >
                <Label circular color={this.props.user.avatarColor} style={{width: '32px', height:'32px', verticalAlign: 'center',fontSize:'16px'}}>{ this.props.user.username[0].toUpperCase() }</Label>

                <Form.Field style={{width:'90%'}}>
                    <TextareaAutosize
                        style={{backgroundColor:'#f2f3f5', resize:'none', border:'1px solid #ccd0d5', borderRadius:'30px'}}
                        rows='1'
                        placeholder={this.props.placeHolder ?? 'Write a comment...'}
                        inputRef={ref => (this.textarea = ref)}
                        onKeyDown={this.onEnterPress}
                        onChange={this.handleChange}
                        value = {this.state.Text}
                        onFocus={this.moveCaretAtEnd}
                        />
                </Form.Field>
            </Form.Group>
            </Form>
        );
    }
}
export default CreateCommentForm;

import React from 'react';
import { Card, Form, Label } from 'semantic-ui-react';
import TextareaAutosize from 'react-textarea-autosize';

const CardHeaderStyle={padding:'10px', backgroundColor:'#f5f6f7', color:'#1d2129', fontWeight:'700', fontFamily:'system-ui'};
const FormStyle = {padding:'10px 0px 0px 10px', margin:'0px'};
const FormTextAreaStyle = {border:"none", height:"100%", resize:'none'};
const hr = {height:'1px', backgroundColor:'#eee', width:'100% + 10px', marginLeft:'-10px'}


class CreatePostForm extends React.Component{

    state = {
        'Text' : ''
    }

    handleChange = (e) => {
        this.setState({Text: e.target.value});
    }
    submit = (e) => {
        this.props.handle_newPost(e, this.state);
        this.setState({Text: ''});
    }

    render(){
        return (
            <Card fluid style={{marginTop:'20px', marginBottom:'0px'}}>
                <Card.Header style={CardHeaderStyle}>Create a Post</Card.Header>
                <Card.Content textAlign='center' style={{padding:'0px'}}>
                    <Form size='large' style={FormStyle} onSubmit={e => this.submit(e)}>
                        <Form.Group style={{ margin:'0px'}}>
                            <Label circular color={this.props.user.avatarColor} style={{width: '32px', height:'32px', verticalAlign: 'center',fontSize:'16px'}}>{ this.props.user.username[0].toUpperCase() }</Label>

                            <Form.TextArea
                            value={this.state.Text}
                            onChange={this.handleChange}
                            control={TextareaAutosize}
                            placeholder={`What's on your mind, ${this.props.user.username}?`}
                            width='14'
                            style={FormTextAreaStyle}></Form.TextArea>
                        </Form.Group>
                        <div style={hr}></div>
                        <Form.Button style={{margin:'0px', float:'right'}} type='submit'>Post</Form.Button>
                    </Form>
                </Card.Content>
            </Card>
        );
    }
}
export default CreatePostForm;

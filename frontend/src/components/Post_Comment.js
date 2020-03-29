import React from 'react';
import { TextArea, Label, Grid} from 'semantic-ui-react';


const CommentStyle={backgroundColor:'#f2f3f5',
                    borderRadius:'18px',
                    color:'#1c1e21',
                    lineHeight: '16px',
                    wordWrap: 'break-word',
                    padding:'8px',
                    fontSize:'13px',
                    whiteSpace: 'pre-wrap'

                   };
const AuthorStyle={
    color:'#385898',
    fontFamily:'system-ui',
    fontSize:'13px',
    fontWeight:600
}
const LinkStyle={
    color:'#385898',
    fontFamily:'system-ui',
    fontSize:'12px',
    lineHeight:'12px'
}
const formatedDateStyle = {
    color: '#90949c',
    fontFamily:'system-ui',
    fontSize:'12px',
    lineHeight:'12px'
}
const seeMoreBtnStyle = {
    color:'#385898',
    fontFamily:'system-ui',
    fontSize:'13px',
    lineHeight:'16px'
}

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


    componentDidMount(){
        //Rendered

    }


    render(){
        let comment = this.props.comment;

        let commentText = comment.Text;
        if(comment.Text.length > 420 && !this.state.seeMore){
            commentText = (<>{comment.Text.slice(0,350)}... <a style={seeMoreBtnStyle} onClick={()=>this.setState({seeMore : true})}>See More</a></>)
        }
        else if(comment.Text.split(/\r\n|\r|\n/).length > 3 && !this.state.seeMore){
            let arr = comment.Text.split(/\r\n|\r|\n/);
            commentText = (<>{arr[0]+'\n'+arr[1]+'\n'+arr[2]}... <a style={seeMoreBtnStyle} onClick={()=>this.setState({seeMore : true})}>See More</a></>)

        }

        return(
            <Grid style={{margin:'-15px 0px -20px -20px'}}>
                    <Grid.Column width={2} style={{margin:'0px -20px 0px 0px'}}>
                    <Label circular color={comment.Author.avatarColor} style={{width: '32px', height:'32px', verticalAlign: 'center', fontSize:'16px'}}>{ comment.Author.username[0].toUpperCase() }</Label>

                    </Grid.Column>
                    <Grid.Column width={14}>
                        <Grid.Row style={{margin:'0px !important', padding:'0px !important'}}>
                            <div className='comment' style={CommentStyle}>
                                <a style={AuthorStyle}>{comment.Author.username}</a> {commentText}
                            </div>
                        </Grid.Row>
                        <Grid.Row style={{margin:'0px !important', padding:'0px !important'}}>
                            <div style={{marginLeft:'8px', marginBottom:'8px'}}><a style={LinkStyle}>Like</a> · <a style={LinkStyle}>Reply</a> · <span style={formatedDateStyle}>{this.formatDateTime(comment.createdAt)}</span></div>
                        </Grid.Row>
                    </Grid.Column>
            </Grid>
        )

        // <TextArea
        //     style={{backgroundColor:'#f2f3f5', resize:'none', border:'1px solid #ccd0d5', borderRadius:'30px', lineHeight:'30px'}}
        //     rows='1'
        //     value={`<a>${comment.Author.username}</a>${comment.Text}`}
        //     disabled
        //     />

        // <>
        //     <Icon width='1'  name='user' size='large'  bordered circular style={{margin:'5px 5px 10px -8px'}}/>
        //     <span className='comment' style={CommentStyle}>
        //         <a style={AuthorStyle}>{comment.Author.username}</a> {comment.Text}
        //     </span>
        //     <div><a style={LinkStyle}>Like</a> · <a style={LinkStyle}>Reply</a> · <span style={formatedDate}>{this.formatDateTime(comment.createdAt)}</span></div>
        // //
        // </>




        // <Grid style={{margin:'0px !important', padding:'0px !important'}}>
        //         <Grid.Column width={2} style={{margin:'0px !important', padding:'0px !important'}}>
        //             <Icon width='1'  name='user' size='large'  bordered circular/>
        //         </Grid.Column>
        //
        //         <Grid.Column width={14} style={{margin:'0px !important', padding:'0px !important'}}>
        //             <Grid.Row style={{margin:'0px !important', padding:'0px !important'}}>
        //
        //                 <span className='comment' style={CommentStyle}>
        //                     <a>{comment.Author.username}</a> {comment.Text}
        //                 </span>
        //             </Grid.Row>
        //             <Grid.Row style={{margin:'0px !important', padding:'0px !important'}}>
        //                 <div><a>Like</a> · <a>Reply</a> · {this.formatDateTime(comment.createdAt)}</div>
        //             </Grid.Row>
        //         </Grid.Column>
        // </Grid>
    }

}

export default Post_Comment;

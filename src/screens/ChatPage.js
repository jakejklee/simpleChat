import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from '../firebase/firebase';
import { Container, Row, Col, Button } from 'react-bootstrap';

class ChatPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomInfo: this.props.location.roomInfo,
            msgList: [],
            txtMsg: '',
            userEmail: '',
        }
    }
    componentDidMount() {
        if (!this.props.location.roomInfo) {
            this.props.history.push('/ChatList');
        } else {
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    console.log(user.email);
                    this.setState({ userEmail: user.email });
                } else {
                    console.log('please login')
                }
            }.bind(this));

            // const rooms = 
            firebase.firestore().collection('chats').doc(this.state.roomInfo.roomID)
                .collection('messages').orderBy('createdAt', 'desc')
                .onSnapshot((querySnapshot) => {
                    const msgArr = [];
                    querySnapshot.forEach((doc) => {
                        const msgObj = {
                            text: doc.data().txt,
                            sender: doc.data().sender,
                        }
                        msgArr.push(msgObj);
                    });
                    console.log(msgArr);

                    this.setState({ msgList: msgArr });
                });

        }
    }

    sendMsg = () => {
        console.log(this.state.roomInfo);
        const currentTime = new Date();
        firebase.firestore().collection('chats').doc(this.state.roomInfo.roomID).collection('messages').add(
            {
                createdAt: currentTime,
                txt: this.state.txtMsg,
                sender: this.state.userEmail,
            }
        );
        this.setState({ txtMsg: '' });
    }
    renderMsgs() {
        const msgArr = [];
        for (let i = 0; i < this.state.msgList.length; i++) {
            msgArr.push(
                <Row style={{ borderBottom: '1px solid grey', width: '100%', margin: 'auto', marginTop: '10px' }}>
                    {/* <Col></Col> */}
                    {this.state.msgList[i].sender === 'guest@gmail.com' ?
                        <Col md='auto' style={{ marginLeft: '10px' }}>Guest User: </Col>
                        :
                        <Col md='auto' style={{ marginLeft: '10px' }}>{this.state.msgList[i].sender + ': '}</Col>
                    }
                    <Col md='auto'><div style={{ width: '100%', marginBottom: '10px' }}>{this.state.msgList[i].text}</div></Col>
                    {/* <Col></Col> */}
                </Row>
            );
        }
        return (
            <Row>
                <Col ></Col>
                <Col xs={5} style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', marginTop: '20px' }}>
                    {msgArr}
                </Col>
                <Col></Col>
            </Row>
        );
    }

    logOut = () => {
        firebase.auth().signOut().then((user) => {
            console.log(user);
            console.log('Logged out');
            this.props.history.push('/');
        }).catch((error) => {
            console.log(error);
        })
    }

    handleChange(e) {
        this.setState({ txtMsg: e.target.value });
        console.log(this.state.txtMsg);
    }

    render() {
        return (
            <div id="mainDiv">
                <Row>
                    <Col></Col>
                    <Col md='auto'>
                        {this.state.userEmail === 'guest@gmail.com' ?
                            <h1>Guest user</h1>
                            :
                            <h1>{this.state.userEmail} </h1>
                        }
                    </Col>
                    <Col md='auto'>
                        <h6 style={{ marginTop: '10px' }}><Button variant='secondary' onClick={() => this.logOut()}>Log out</Button></h6>
                    </Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col style={{ marginTop: '20px' }}>
                        <Link to="/ChatList">
                            <Button variant='outline-primary'>
                                ChatList
                        </Button>
                        </Link>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h4>Room Name: {!this.props.location.roomInfo ?
                            null
                            : this.props.location.roomInfo.roomName
                        }</h4>
                    </Col>
                </Row>

                <div>
                    <Row>
                        <Col></Col>
                        <Col>
                            <form>
                                <input id="inputMsg"
                                    autoComplete="off"
                                    type="text"
                                    value={this.state.txtMsg}
                                    name="chatMsg"
                                    placeholder="Enter..."
                                    required
                                    onChange={(e) => { this.handleChange(e) }}
                                />
                                <Button type='submit' onClick={() => this.sendMsg()}>Send</Button>
                            </form>
                        </Col>
                        <Col></Col>
                    </Row>
                    {this.renderMsgs()}
                </div>

            </div >
        );
    }
}

export default ChatPage;


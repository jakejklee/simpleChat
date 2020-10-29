import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from '../firebase/firebase';
import { Container, Row, Col, Button } from 'react-bootstrap';
const db = firebase.firestore();
class ChatList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userEmail: '',
            chatRoomName: '',
            roomNameList: [],
            roomNameTest: '',
        }
    }
    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log(user.email);
                this.setState({ userEmail: user.email });
                console.log(this.props);
            } else {
                this.props.history.push('/');
                console.log('please login')
            }
        }.bind(this));

        const rooms = db.collection('chats').orderBy('createdAt', 'desc');
        rooms.onSnapshot(function (querySnapshot) {
            const roomArr = [];
            querySnapshot.forEach((element) => {
                let curdate = new Date(null);
                curdate.setTime(element.data().createdAt.seconds * 1000);
                console.log(curdate);
                const roomObj = {
                    roomID: element.id,
                    roomName: element.data().chatName,
                    roomDate: curdate,
                }
                roomArr.push(roomObj);
            });

            this.setState({ roomNameList: roomArr });
        }.bind(this));
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

    createChatroom = () => {
        const currentTime = new Date();
        if (this.state.chatRoomName !== '') {
            db.collection('chats').add(
                {
                    createdAt: currentTime,
                    chatName: this.state.chatRoomName,
                }
            );
            this.setState({ chatRoomName: '' });
        }
    }

    handleChange(e) {
        this.setState({ chatRoomName: e.target.value });
    }
    formatDate = (date) => {
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let year = date.getFullYear();
        console.log(month, day, year);
        return month + '-' + day + '-' + year
    }

    renderRoomList = () => {
        const roomArrList = [];
        for (let i = 0; i < this.state.roomNameList.length; i++) {
            console.log(this.state.roomNameList[i])
            if (this.state.roomNameList[i].roomName !== '') {
                roomArrList.push(
                    <Row key={'room' + i} style={{ width: '99%', borderBottom: '1px solid grey', padding: '5px' }}>
                        <Col xs={8}>
                            <Link style={{ marginLeft: '2%' }}
                                to={{
                                    pathname: "/ChatPage",
                                    roomInfo: this.state.roomNameList[i]
                                }}>{this.state.roomNameList[i].roomName}</Link>
                        </Col>
                        <Col md='auto' style={{ fontSize: '12px', color: 'grey', marginTop: '5px' }}>
                            {this.formatDate(this.state.roomNameList[i].roomDate)}
                        </Col>

                    </Row >
                );
            }
        }
        return (
            <ol>{roomArrList}</ol>
        );
    }

    render() {

        console.info(this.props);
        console.info(this.state.roomNameList);
        return (
            <div id="mainDiv">
                <Container>
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
                        <Col></Col>
                        <Col>
                            <input id="inputChat"
                                autoComplete="off"
                                type="text"
                                value={this.state.chatRoomName}
                                name="chatRoom"
                                required
                                onChange={(e) => { this.handleChange(e) }}
                            />
                            <Button variant='primary' onClick={() => this.createChatroom()}
                            style={{marginLeft:5}}>Create Chatroom</Button>
                        </Col>
                        <Col></Col>
                    </Row>
                    <Row style={{ width: '90%', margin: 'auto', marginTop: '20px' }}>
                        <Col><h5>Chatting List</h5></Col>
                    </Row>
                    <Row>
                        <Col></Col>
                        <Col xs={6} style={{ border: '1px solid black', borderRadius: '10px', marginTop: '20px', padding: '20px' }}>
                            <Row style={{ width: '90%', margin: 'auto', fontWeight: 'bold', fontSize: '20px' }}>
                                <Col xs={8}>Room Name</Col>
                                <Col md='auto'>Date</Col>
                            </Row>
                            <div id="roomList">
                                {this.renderRoomList()}
                            </div>
                        </Col>
                        <Col></Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default ChatList;


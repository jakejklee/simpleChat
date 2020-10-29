import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import firebase from '../firebase/firebase';
import './css/LoginPage.css';
import { Date } from 'core-js';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailAddress: '',
            password: '',
            userInfo: {},
            errorMsg: '',
        }

    }
    componentWillMount() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log(user);
                this.setState({ userInfo: user });
                console.log(this.props);
                this.props.history.push('/ChatList');
            } else {
                console.log('please login')
            }
        }.bind(this));
    }
    userLogin = (email, password) => {
        console.log(email);
        console.log(password);
        firebase.auth().signInWithEmailAndPassword(email, password).then((result) => {
            console.log('Login success');
            this.props.history.push('/ChatList');
        }).catch(function (error) {
            // this.setState({ emailAddress: '' });
            // this.setState({ password: '' });
            this.setState({ errorMsg: 'Check Email and Password' });
            console.log(error);
        }.bind(this));
        // this.AuthStore.userCheck(email, password);
    }
    guestSignin = () => {
        console.log(Math.random() * 100000000);
        // this.setState({ emailAddress: 'guest@gmail.com' });
        // this.setState({ password: 'guestguest' });
        this.userLogin('guest@gmail.com', 'guestguest');

    }
    userSignup = (email, password) => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                console.log(authUser);
                console.log(this.props.history);
                // this.props.history.push('/ChatList');
            })
            .catch(function (error) {
                // this.setState({ emailAddress: '' });
                // this.setState({ password: '' });
                this.setState({ errorMsg: 'Check Email and Password' });
                console.log(error);
            }.bind(this));
    }
    // checkUser = () => {
    //     firebase.auth().onAuthStateChanged(function (user) {
    //         if (user) {
    //             console.log(user);
    //             // console.log(this.props);
    //             // this.props.history.push('/ChatPage');
    //         } else {
    //             console.log('please login')
    //         }
    //     });
    // }

    handleChange(e, type) {
        this.setState({ [type]: e.target.value });
    }
    renderErrorMsg() {
        this.setState({ errorMsg: '' });
    }

    render() {
        return (
            <div id="mainDiv">
                <br></br><br></br>
                <h1>Login</h1><br></br><br></br>

                <div id='formDiv'>
                    <form>
                        <h3 style={{ textAlign: 'left', marginLeft: '5%' }}>Email</h3>
                        <input style={{ width: '90%' }}
                            id="inputEmail"
                            autoComplete="off"
                            onFocus={() => { this.renderErrorMsg() }}
                            type="email"
                            value={this.state.emailAddress}
                            name="email"
                            placeholder=" example@example.com"
                            required
                            onChange={(e) => { this.handleChange(e, 'emailAddress') }}
                        /><br></br><br></br>
                        <h3 style={{ textAlign: 'left', marginLeft: '5%' }}>Password</h3>
                        <input style={{ width: '90%' }}
                            id="inputPassword"
                            autoComplete="off"
                            placeholder=" At least 6 characters"
                            type="password"
                            value={this.state.password}
                            name="password"
                            required
                            onChange={(e) => { this.handleChange(e, 'password') }}
                        />


                        <br></br><br></br>
                        <h6>If you do not have an account,</h6>
                        <h6> click Signup button with email and password you want.</h6>
                        <h6> Guest users do not need email and password.</h6>
                        <br></br>
                        <Button style={{ marginLeft: '10px', marginBottom: 10 }} id="guestBtn" variant='secondary'
                            onClick={() => this.guestSignin()}>Guest User</Button>
                        <br></br>
                        <Button id="loginBtn" variant='primary'
                            onClick={() => this.userLogin(this.state.emailAddress, this.state.password)}>Login</Button>
                        <Button style={{ marginLeft: '10px' }} id="signupBtn" variant='success'
                            onClick={() => this.userSignup(this.state.emailAddress, this.state.password)}>Signup</Button>
                        <br></br><br></br>
                        <h5 style={{ color: 'red' }}>{this.state.errorMsg}</h5>
                    </form>
                </div>
                {/* <div id="recaptcha-container"></div> */}

            </div >

        );
    }
}

export default LoginPage;


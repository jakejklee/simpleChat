import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoginPage from './screens/LoginPage'
import ChatList from './screens/ChatList'
import ChatPage from './screens/ChatPage'

class PageRouter extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={LoginPage} />
                    <Route path="/ChatList" component={ChatList} />
                    <Route path="/ChatPage" component={ChatPage} />
                </div>
            </Router>
        );
    }
}

export default PageRouter;

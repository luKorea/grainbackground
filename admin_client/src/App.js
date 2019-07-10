import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Login from './pages/login/Login';
import Admin from './pages/admin/Admin';
import Error from './pages/error/Error';

class App extends React.Component {
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route path='/login' component={Login} />
                    <Route path='/' component={Admin} />
                    <Route path='/error' component={Error} />
                </Switch>
            </HashRouter>
        );
    }
}
export default App;

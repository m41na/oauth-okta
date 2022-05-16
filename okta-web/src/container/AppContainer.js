import App from "../component/App";
import { BrowserRouter as Router, withRouter } from 'react-router-dom';
import AppContextProvider from "../state/AppContext";

const AppWithRouter = withRouter(App);

const AppContainer = () => {
    return (
        <AppContextProvider>
            <Router><AppWithRouter /></Router>
        </AppContextProvider>
    );
}

export default AppContainer;
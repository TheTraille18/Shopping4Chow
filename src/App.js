import './App.css';
import TopBar from './components/TopBar'
import { Router, Route, Switch } from 'react-router-dom';
import history from './history'

//Components
import Home from './components/Home'
import Ingredient from './components/Ingredient'

function App() {

  return (
    <div>
      <Router history={history}>
        <TopBar />
        <div>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/ingredient" component={Ingredient} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;

import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './App.css';
import Landing from './components/Landing';
import Library from './components/Library';
import Album from './components/Album';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
        <nav className="navbar">
          <Link to="index" className="logo">
              <img src="./data/bloc_jams_logo.png" alt="bloc jams logo"></img>
          </Link>
          <div className="links-container">
            <Link to='/library' className="navbar-link">Library</Link>
          </div>
        </nav>
        </header>
        <main>
          <Route exact path="/" component={Landing} />
          <Route path="/library" component={Library} />
          <Route path="/album/:slug" component={Album} />
        </main>
      </div>
    );
  }
}

export default App;

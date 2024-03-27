import logo from './assets/Images/logo.svg';
import './App.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home/Home.js';
import { Products } from './pages/Products/Products.js';
import { Accessories } from './pages/Accessories/Accessories.js';
import { Blog } from './pages/Blog/Blog.js';
import { Support } from './pages/Support/Support.js';

import Header from './components/Header/header.js';

import Footer from './components/Footer/Footer.js';

class App extends Component {
  render(){
  return (
    <React.Fragment>
      <Header/>
      <Router>
        <Routes>
          <Route exact path ="/" Component={Home}/>
          <Route exact path ="/Home" Component={Home}/>
          <Route exact path ="/Products" Component={Products}/>
          <Route exact path ="/Accessories" Component={Accessories}/>
          <Route exact path ="/Blog" Component={Blog}/>
          <Route exact path ="/Support" Component={Support}/>

        </Routes>
      </Router>
      <Footer/>
    </React.Fragment>
  );
  }
}

export default App;

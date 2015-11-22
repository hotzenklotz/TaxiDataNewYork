import React from "react";
import Component from "../components/base_component.jsx";
import Header from "../components/header.jsx";
import Router from "../lib/router.jsx";

class App extends Component {

  render() {

    return (
      <div>
        <Header />
        <div className="main-container">
          <Router/>
        </div>
      </div>
    );
  }

};

export default App;

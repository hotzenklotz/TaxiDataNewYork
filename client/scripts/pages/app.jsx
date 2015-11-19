import React from "react";
import Component from "../components/baseComponent.jsx";
import Header from "../components/header.jsx";
import Router from "../lib/router.jsx";

class App extends Component {

  render() {

    console.log("dgfgjknfdgnkj")

    return (
      <div>
        <Header />
        <div className="container">
          <Router/>
        </div>
      </div>
    );
  }

};

export default App;

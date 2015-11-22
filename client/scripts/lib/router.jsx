import React from "react";
import { createHistory, useBasename } from "history"
import { Router, Route, IndexRoute, DefaultRoute, NotFoundRoute } from "react-router";

import Component from "../components/base_component.jsx";
import Home from "../pages/home.jsx";
import NotFound from "../pages/notFound.jsx";

class AppRouter extends Component {

  render() {

    const history = useBasename(createHistory)({
      basename : "/huge-apps"
    })

    return (
      <Router history={history}>
        <Route name="app" path="/" component={ Home }>
          <IndexRoute component={Home} />
          <Route path="*" component={ NotFound } />
        </Route>
      </Router>
    );
  }
}

export default AppRouter;
import React from "react";
import ReactDOM from "react-dom";

import FavIcon from "../images/favicon-96x96.png";
import FavIcon2 from "../images/favicon.ico";
import FavIcon3 from "../images/apple-touch-icon-114x114.png";

import Styles from "../styles/main.less";

import App from "./pages/app.jsx";
import injectTapEventPlugin from "react-tap-event-plugin";

injectTapEventPlugin();
ReactDOM.render(<App/>, document.body);

import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import "./app.css";
import "typeface-roboto-mono";
import "./vendor/hljs-theme.css";
import { Socket, Event } from "react-socket-io";
import { MainContextProvider } from "./context/main";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Title from "./components/title";
import Navigation from "./components/navigation";

import Home from "./pages/home";
import Export from "./pages/export";
import Publish from "./pages/publish";

const history = createBrowserHistory();

const uri = `${window.location.hostname}:${process.env.PORT || 8000}`;
const options = { transports: ["websocket"] };

function AppContainer() {
  return (
    <MainContextProvider>
      <Socket uri={uri} options={options}>
        <App />
      </Socket>
    </MainContextProvider>
  );
}

function App() {
  const [socketStatus, setSocketStatus] = useState(false);

  const handleConnect = () => {
    setSocketStatus(true);
  };

  const handleDisconnect = () => {
    setSocketStatus(false);
  };

  return (
    <Router history={history}>
      {socketStatus ? (
        <React.Fragment>
          <Title title={"Content Tools"} />
          <Navigation />
          <Route exact path="/" component={Home} />
          <Route exact path="/export" component={Export} />
          <Route exact path="/publish" component={Publish} />
        </React.Fragment>
      ) : (
        <FontAwesomeIcon icon={faSpinner} size="3x" pulse />
      )}
      <Event event="connect" handler={handleConnect} />
      <Event event="disconnect" handler={handleDisconnect} />
    </Router>
  );
}

export default AppContainer;

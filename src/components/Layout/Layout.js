import React from "react";
import {
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";

// pages
import Dashboard from "../../pages/dashboard";
import Salas from '../../pages/salas';
import ListaFilmes from '../../pages/filmes/listaFilmes';
import Filme from '../../pages/filmes/filme';
import Sessao from '../../pages/sessao/sessao';
import ListaSessoes from '../../pages/sessao/listaSessoes';

// context
import { useLayoutState } from "../../context/LayoutContext";

function Layout(props) {
  var classes = useStyles();

  // global
  var layoutState = useLayoutState();

  return (
    <div className={classes.root}>
        <>
          <Header history={props.history} />
          <Sidebar />
          <div
            className={classnames(classes.content, {
              [classes.contentShift]: layoutState.isSidebarOpened,
            })}
          >
            <div className={classes.fakeToolbar} />
            <Switch>
              <Route path="/app/dashboard" component={Dashboard} />
              <Route path="/app/salas" component={Salas} />
              <Route path="/app/filmes" component={ListaFilmes} />
              <Route path="/app/filme" component={Filme} />
              <Route path="/app/sessao" component={Sessao} />
              <Route path="/app/sessoes" component={ListaSessoes} />
            </Switch>
          </div>
        </>
    </div>
  );
}

export default withRouter(Layout);

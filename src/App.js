import React, { useEffect } from "react";
import "./App.css";
import Header from "./Header";
import Home from "./Home.js";
import Checkout from "./Checkout";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./Login";
import { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import Payment from "./Payment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Orders from "./Orders";
import OTP from './OTP';

const promise = loadStripe(
  "pk_test_51HTBz6HTr26yyJHdqofFjGm418chaft7bhW8cLFB4WXLIazm2w8WNkCFgg4ucNbo4VdI9AWGf0NZZDKKdPuGjtbb009BnAgSF8"
);

function App() {
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    //Wll only run once when the component loads
    auth.onAuthStateChanged((authUser) => {
      console.log("THE USER IS >>>> ", authUser);

      if (authUser) {
        //if the user is alrady logged in
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        // the user is logged out
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, []);

  return (
    //BEM Naming convention
    <Router>
      <div className="app">
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/otp">
            <OTP/>
          </Route>
          <Route path="/checkout">
            <Header />
            <Checkout />
          </Route>
          <Route path="/orders">
            <Header />
            <Orders />
          </Route>
          <Route path="/payment">
            <Header />
            <Elements stripe={promise}>
              <Payment />
            </Elements>
          </Route>
          <Route path="/">
            <Header />
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

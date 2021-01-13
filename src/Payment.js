import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { Link, useHistory } from "react-router-dom";
import CheckoutProduct from "./CheckoutProduct";
import "./Payment.css";
import { getBasketTotal } from "./reducer";
import { useStateValue } from "./StateProvider";
import axios from "./axios";
import {db} from './firebase'

function Payment() {
  const [{ basket, user }, dispatch] = useStateValue();
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState();

  const history = useHistory();

  useEffect(() => {
    const getClientSecret = async () => {
        const response = await axios({
            method: 'post',
            url : `/payments/create?total=${getBasketTotal(basket) * 100}`
        })
        setClientSecret(response?.data?.clientSecret)
    }
    getClientSecret()
  },[basket])

  console.log("THE SECRET IS >>>>",clientSecret)

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
      e.preventDefault();
      setProcessing(true);

      const payload = await stripe.confirmCardPayment(clientSecret,{
          payment_method : {
              card : elements.getElement(CardElement)
          }
      }).then(({paymentIntent}) => {

          db.collection('users')
          .doc(user?.uid)
          .collection('orders')
          .doc(paymentIntent.id)
          .set({
            basket : basket,
            amount : paymentIntent.amount,
            created : paymentIntent.created
          })

          setSucceeded(true);
          setError(null);
          setProcessing(false);

          dispatch({
            type: 'EMPTY_BASKET'
          })

          history.replace('/orders')
      })
  };

  const handleChange = (e) => {
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };

  return (
    <div className="payment">
      <div className="payment_container">
        <h1>Checkout {<Link to="/checkout">{basket?.length} items</Link>}</h1>
        {/* Paymnet section - delivery address */}
        <div className="payment_section">
          <div className="payment_title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment_address">
            <p>{user?.email}</p>
            <p>Address Line 1</p>
            <p>Address Line 2</p>
          </div>
        </div>
        {/* Paymnet section - Review Items */}

        <div className="payment_section">
          <div className="payment_title">
            <h3>Review Items and delivery</h3>
          </div>
          <div className="payment_items">
            {/* Products */}
            {basket.map((item) => (
              <CheckoutProduct
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>
        {/* Paymnet section - payment method */}

        <div className="payment_section">
          <div className="payment_title">
            <h3>Payment Method</h3>
          </div>
          <div className="payment_details">
            {/* Stripe magic */}
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />

              <div className="payment_priceContainer">
                <CurrencyFormat
                  renderText={(value) => (
                    <>
                      <h1>Order Total: {value}</h1>
                    </>
                  )}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
                <button disabled={processing || disabled || succeeded}>
                  <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                </button>
              </div>

              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;

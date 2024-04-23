const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const uuid = require("uuid");

const app = express();
const port = 8080;
RAZORPAY_KEY_ID = "rzp_test_aMNqw4zJIdz6wK";
RAZORPAY_SECRET = "mZISDzhLsKtiPzklKSo0ofYi";

// middlewares
app.use(express.json({ extended: false }));
app.use(cors());

app.listen(port, () => console.log(`server started on port ${port}`));

app.post("/orders", async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_SECRET,
    });

    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      accept_partial: false,
      reference_id: uuid.v4(),
      customer: {
        name: req.body.customer.name,
        contact: req.body.customer.phone,
        email: req.body.customer.email,
      },
      notify: {
        sms: false,
        email: true,
      },
      reminder_enable: false,
      callback_url: `http://localhost:5173/checkout/${req.body.productId}`,
      callback_method: "get",
    };

    const order = await instance.paymentLink.create(options);

    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

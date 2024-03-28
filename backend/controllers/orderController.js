const Order = require("../models/order");
const nodemailer = require("nodemailer");

exports.checkout = async (req, res) => {
  try {
    // Process the order (save to database, etc.)
    // Assuming req.body contains order details
    const order = new Order(req.body);
    await order.save();

    // Send confirmation email with button
    const transporter = nodemailer.createTransport({
      //configure the email service
      host: "sandbox.smtp.mailtrap.io",
      port: 2525, // or 465 or 587 or another Mailtrap port
      auth: {
        user: "fa59208cd93371",
        pass: "82bc14cd74667e",
      },
    });

    const mailOptions = {
      from: "munchiesandbevvies.com",
      to: "bevviesmunchies@gmail.com",
      subject: "New Order Confirmation",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
        </head>
        <body>
            <h1>New Order Confirmation</h1>
            <p>A new order has been placed. Please click the button below to confirm:</p>
            <a href="http://192.168.0.130:8000/confirm-order/${order._id}" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Confirm Order</a>
        </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    // Respond with success message
    res.status(200).json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ error: "Failed to process order" });
  }
};

exports.confirmOrder = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    // Find the order in the database
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update the order's verified field to true
    order.confirmed = true;
    await order.save();

    // Respond with success message
    res.status(200).json({ message: "Order confirmed successfully" });
  } catch (error) {
    console.error("Error confirming order:", error);
    res.status(500).json({ error: "Failed to confirm order" });
  }
};

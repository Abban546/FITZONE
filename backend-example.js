// Example Backend Integration for PayPal Orders
// This is a Node.js/Express example for handling PayPal orders

// Install required packages:
// npm install express axios dotenv cors

const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// PayPal Configuration
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://api.paypal.com' 
  : 'https://api.sandbox.paypal.com';

// Get PayPal Access Token
async function getPayPalAccessToken() {
  try {
    const response = await axios.post(
      `${PAYPAL_API_BASE}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        auth: {
          username: PAYPAL_CLIENT_ID,
          password: PAYPAL_CLIENT_SECRET
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting PayPal access token:', error.response?.data || error.message);
    throw error;
  }
}

// Verify PayPal Order
async function verifyPayPalOrder(orderId) {
  try {
    const accessToken = await getPayPalAccessToken();
    const response = await axios.get(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error verifying PayPal order:', error.response?.data || error.message);
    throw error;
  }
}

// Endpoint to handle order confirmation
app.post('/api/orders', async (req, res) => {
  try {
    const {
      paypalOrderId,
      firstName,
      lastName,
      email,
      phone,
      address,
      items,
      total,
      paymentStatus
    } = req.body;

    // Verify the order with PayPal
    const paypalOrder = await verifyPayPalOrder(paypalOrderId);

    // Check if payment status is COMPLETED
    if (paypalOrder.status !== 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }

    // Verify the amount matches
    const paypalAmount = parseFloat(paypalOrder.purchase_units[0].amount.value);
    if (Math.abs(paypalAmount - total) > 0.01) {
      return res.status(400).json({
        success: false,
        message: 'Amount mismatch'
      });
    }

    // Store order in database
    const order = {
      orderId: paypalOrderId,
      customer: {
        firstName,
        lastName,
        email,
        phone
      },
      delivery: {
        address
      },
      items,
      total,
      paymentStatus: 'COMPLETED',
      createdAt: new Date(),
      status: 'pending_fulfillment'
    };

    // TODO: Save to your database
    // await db.orders.insert(order);

    console.log('Order created:', order);

    // Send confirmation email (example)
    // await sendConfirmationEmail(email, order);

    // Return success response
    res.json({
      success: true,
      orderId: paypalOrderId,
      message: 'Order confirmed successfully',
      orderDetails: order
    });

  } catch (error) {
    console.error('Error processing order:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error processing order',
      error: error.message
    });
  }
});

// Endpoint to get order details
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Verify with PayPal
    const paypalOrder = await verifyPayPalOrder(orderId);
    
    // TODO: Get from your database
    // const order = await db.orders.findOne({ orderId });

    res.json({
      success: true,
      order: paypalOrder
    });

  } catch (error) {
    console.error('Error fetching order:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'FitZone PayPal Integration' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

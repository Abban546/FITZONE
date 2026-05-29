// Example Backend Integration for Paystack Transactions
// This is a Node.js/Express example for verifying and handling Paystack payments

// Install required packages:
// npm install express axios dotenv cors

const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Paystack Secret Key configuration
// Ensure PAYSTACK_SECRET_KEY is defined in your .env file
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

/**
 * Verify Transaction with Paystack API
 * Send a GET request to Paystack's transaction verification endpoint
 * @param {string} reference - The unique transaction reference returned by the frontend popup
 */
async function verifyPaystackTransaction(reference) {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('PAYSTACK_SECRET_KEY is not defined in environment variables.');
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error verifying Paystack transaction:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Endpoint to handle order confirmation after checkout
 */
app.post('/api/orders', async (req, res) => {
  try {
    const {
      reference,
      firstName,
      lastName,
      email,
      phone,
      address,
      items,
      total // Expected total in GHS (e.g. 890.00)
    } = req.body;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Transaction reference is required'
      });
    }

    // 1. Verify transaction with Paystack API
    const paystackResult = await verifyPaystackTransaction(reference);

    // 2. Check if Paystack request succeeded
    if (!paystackResult.status || !paystackResult.data) {
      return res.status(400).json({
        success: false,
        message: 'Paystack verification failed'
      });
    }

    const txData = paystackResult.data;

    // 3. Verify transaction status is 'success'
    if (txData.status !== 'success') {
      return res.status(400).json({
        success: false,
        message: `Payment not completed. Status: ${txData.status}`
      });
    }

    // 4. Verify transaction currency is GHS
    if (txData.currency !== 'GHS') {
      return res.status(400).json({
        success: false,
        message: `Invalid transaction currency: ${txData.currency}. Expected GHS.`
      });
    }

    // 5. Verify the amount matches (Paystack reports amount in smallest unit, i.e., pesewas for GHS)
    const paidAmountGHS = txData.amount / 100;
    if (Math.abs(paidAmountGHS - total) > 0.01) {
      return res.status(400).json({
        success: false,
        message: `Amount mismatch. Expected GH₵ ${total}, but paid GH₵ ${paidAmountGHS}`
      });
    }

    // 6. Build the completed order record
    const order = {
      orderId: reference,
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
      total: paidAmountGHS,
      paymentStatus: 'SUCCESS',
      paystackGatewayMetadata: {
        channel: txData.channel,
        ipAddress: txData.ip_address,
        cardDetails: txData.authorization || {}
      },
      createdAt: new Date(),
      status: 'pending_fulfillment'
    };

    // TODO: Save to your actual database (MongoDB, MySQL, PostgreSQL, etc.)
    // await db.orders.insert(order);

    console.log('Order verified and stored successfully:', order);

    // TODO: Send confirmation emails or SMS alerts to customer and administrator
    // await sendOrderNotification(email, order);

    // Return success response
    res.json({
      success: true,
      orderId: reference,
      message: 'Payment verified and order confirmed successfully',
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

/**
 * Endpoint to retrieve order details directly via Paystack reference
 */
app.get('/api/orders/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    
    // Query directly from Paystack API
    const paystackResult = await verifyPaystackTransaction(reference);
    
    // TODO: Query from your database to match this record
    // const dbOrder = await db.orders.findOne({ orderId: reference });

    res.json({
      success: true,
      paystackTransactionDetails: paystackResult.data
    });

  } catch (error) {
    console.error('Error fetching transaction:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching transaction details',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'FitZone Paystack Integration Server',
    environment: process.env.NODE_ENV || 'development' 
  });
});

// Start express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`FitZone Paystack Server running on port ${PORT}`);
});

module.exports = app;

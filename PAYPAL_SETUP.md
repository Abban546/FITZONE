# PayPal Integration Setup Guide for FitZone GH

## Overview
Your FITZONE website now supports PayPal as the primary payment method! PayPal provides secure, trusted payments and integrates seamlessly with your checkout process.

## Step 1: Create a PayPal Business Account

1. Go to [PayPal Developer Portal](https://developer.paypal.com/)
2. Sign in with your PayPal account (create one if you don't have it)
3. Navigate to **Dashboard** → **Apps & Credentials**
4. Select the **Sandbox** environment (for testing)
5. You'll see your **Client ID** in the REST API section

## Step 2: Update Your Client ID

### In cart.html
Find this line (around line 308):
```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=GHS" data-sdk-integration-source="integrationbuilder_sc"></script>
```

Replace `YOUR_PAYPAL_CLIENT_ID` with your actual Client ID from PayPal Developer Portal.

**Example:**
```html
<script src="https://www.paypal.com/sdk/js?client-id=AbcDefGhIjKlMnOpQrStUvWxYz&currency=GHS" data-sdk-integration-source="integrationbuilder_sc"></script>
```

## Step 3: Test Your Integration

1. **In Sandbox Mode (Testing):**
   - Use sandbox accounts to test payments
   - PayPal provides test buyer accounts in your Developer Dashboard
   - No real money is charged

2. **Live Mode (Production):**
   - Switch to **Live** environment in PayPal Developer Portal
   - Use your live Client ID
   - Real transactions will be processed

## Step 4: Configure Your Backend (Optional)

For production, you should:

### Set Up Order Validation
```javascript
// Backend validation (Node.js example)
const orderId = orderData.id; // From PayPal response
// Verify with PayPal API that the order is valid
```

### Store Order Data
- Save customer details from `orderConfirmation` object
- Store payment confirmation from PayPal
- Track inventory and process shipments

### Example Backend Endpoint:
```javascript
// POST /api/orders
{
  paypalOrderId: "7H50...",
  firstName: "Kofi",
  lastName: "Mensah",
  email: "kofi@example.com",
  phone: "+233244000000",
  address: "123 Main St, Accra",
  items: [...],
  total: 1500,
  paymentStatus: "COMPLETED"
}
```

## Features Included

✅ **PayPal Checkout Integration**
- Customers click the PayPal button
- They sign in to PayPal
- Payment is processed securely
- Order confirmation is returned

✅ **Secure Payment Handling**
- 256-bit SSL encryption
- PCI DSS compliance
- No credit card data stored on your server

✅ **Order Details in PayPal**
- Itemized order breakdown
- Shipping address
- Discount information
- Delivery costs

✅ **Currency Support**
- All prices in GHS (Ghana Cedis)
- Customers can pay in their local currency if desired

✅ **Fallback Payment Methods**
- Mobile Money (MTN, Vodafone, AirtelTigo)
- Credit/Debit Card
- Cash on Delivery
- Users can switch payment methods

## Testing Checklist

- [ ] Replace `YOUR_PAYPAL_CLIENT_ID` with your actual Client ID
- [ ] Test in Sandbox mode first
- [ ] Fill in all delivery details
- [ ] Click PayPal button
- [ ] Complete payment with test account
- [ ] Verify order confirmation appears
- [ ] Switch to Live mode when ready

## Troubleshooting

**Problem:** PayPal button doesn't appear
- **Solution:** Check that Client ID is correctly set and not `YOUR_PAYPAL_CLIENT_ID`

**Problem:** Payment fails with "Invalid currency"
- **Solution:** Ensure your PayPal account supports GHS. Ghana is supported, but verify in your account settings.

**Problem:** Can't see test credentials
- **Solution:** Make sure you're in Sandbox environment in PayPal Developer Dashboard

**Problem:** Orders not being captured
- **Solution:** Verify your endpoint URL is accessible and handling the order capture correctly

## PayPal Account Features to Enable

1. Log in to your PayPal account
2. Go to **Profile Settings**
3. Enable:
   - Instant Payment Notification (IPN) for order updates
   - Webhook notifications (recommended)
   - Email receipts for customers

## Security Best Practices

1. **Never** commit your Client ID to public repos if using private keys
2. Always use HTTPS in production
3. Validate all orders on your backend before fulfilling
4. Store sensitive data securely (never in localStorage for production)
5. Implement fraud detection

## Additional Resources

- [PayPal Developer Documentation](https://developer.paypal.com/docs/checkout/)
- [PayPal Sandbox Testing](https://developer.paypal.com/docs/platforms/set-up/quick-start/)
- [PayPal SDK Reference](https://developer.paypal.com/docs/checkout/reference/server-integration/)
- [Ghana Payment Methods](https://www.paypal.com/gh/en/)

## Next Steps

1. ✅ Get your Client ID from PayPal
2. ✅ Update cart.html with your Client ID
3. ✅ Test in Sandbox mode
4. ✅ Build backend to store orders
5. ✅ Set up order confirmation emails
6. ✅ Go live!

---

**Questions?** Visit the [PayPal Community Forum](https://www.paypalcommunity.com/) or contact PayPal Support.

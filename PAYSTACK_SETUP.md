# Paystack Integration Setup Guide

Your FITZONE website now supports **Paystack** as its exclusive, unified payment gateway! Paystack provides secure, rapid transactions in Ghana, allowing customers to check out using **Mobile Money** (MTN, Telecel, AirtelTigo) or **Credit/Debit Cards** (Visa, Mastercard) within a single elegant payment pop-up.

---

## 🚀 Quick Start Setup

### Step 1: Get Your Paystack API Keys
1. Go to [Paystack](https://paystack.com/) and sign up or log into your account.
2. Ensure your account is in **Test Mode** (toggle on the top right).
3. Navigate to **Settings** → **API Keys & Webhooks** (or go directly to [dashboard.paystack.com/#/settings/developer](https://dashboard.paystack.com/#/settings/developer)).
4. Copy your **Test Public Key** (starts with `pk_test_`) and **Test Secret Key** (starts with `sk_test_`).

### Step 2: Configure the Frontend
1. Open `cart.html` in your text editor.
2. Locate the `PAYSTACK_PUBLIC_KEY` variable configuration around line 348:
   ```javascript
   const PAYSTACK_PUBLIC_KEY = 'pk_test_a1b2c3d4e5f6g7h8i9j0_placeholder'; // Replace with your actual Paystack Public Key
   ```
3. Replace the placeholder value with your actual **Test Public Key** (e.g. `pk_test_12345...`).
4. Save the file.

### Step 3: Configure the Backend Server
If you want to verify payments on your server and store order fulfillments in a database:
1. Make a copy of `.env.example` and name it `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your **Paystack Secret Key**:
   ```env
   PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
   NODE_ENV=development
   PORT=3000
   ```
3. Install the backend dependencies:
   ```bash
   npm install express axios dotenv cors
   ```
4. Run your development server:
   ```bash
   node backend-example.js
   ```

---

## 🧪 Testing Your Payment Flow

When in **Test Mode**, you can simulate real successful or failed transactions without using real money.

### Triggering a Test Payment:
1. Open `cart.html` in your browser.
2. Add items to your cart, fill in the shipping form, and click **Pay Securely with Paystack**.
3. The Paystack Secure Gateway popup will open automatically.

### Test Cards & Mobile Money Numbers:
Paystack provides multiple mock payment instruments inside the test popup:

#### 1. Mobile Money (MTN / Telecel / AirtelTigo)
- Select the **Mobile Money** option inside the popup.
- Enter a mock Ghana phone number (e.g. `0244000000`).
- Select **MTN**, **Telecel**, or **AirtelTigo**.
- Select the **Success** button in the pop-up simulation to mock a successful wallet deduction.

#### 2. Credit/Debit Cards
- Select the **Card** option inside the popup.
- Use one of Paystack's official test card numbers:
  - **Success:** `4008 1111 1111 1111` (Expires any future date; CVV: any 3 digits).
  - **Decline:** `4008 1111 1111 1109` (Simulates a card with insufficient funds).
- Complete the card flow.

---

## 🔐 Going Live

To start accepting real payments from real customers in Ghana:

1. Log into your **Paystack Dashboard** and complete your business registration details to activate live payments.
2. Toggle your dashboard to **Live Mode**.
3. Go to **Settings** → **API Keys & Webhooks** and retrieve your **Live Public Key** (`pk_live_...`) and **Live Secret Key** (`sk_live_...`).
4. Update `cart.html` with your **Live Public Key**.
5. Update your backend `.env` file with your **Live Secret Key**.
6. Switch your backend `.env` configuration to production:
   ```env
   NODE_ENV=production
   ```

---

## 🛠️ Troubleshooting FAQ

### The popup won't open and displays "Initializing secure checkout..."
- Open your browser's Developer Tools Console (F12) to inspect the error log.
- Check if you have an active internet connection. Paystack Inline requires loading the official Javascript SDK dynamically from `https://js.paystack.co/v1/inline.js`.
- Double-check that your `PAYSTACK_PUBLIC_KEY` in `cart.html` is exactly correct and matches the environment (you cannot use a live secret key on the frontend, nor can you use a secret key instead of a public key).

### Successful payment did not clear my cart
- Check if your cart list is modified correctly.
- Paystack callback handles the cart clearance. Make sure no browser JavaScript errors crashed the runtime before execution. Check console outputs for any reported issues.

---

**Your FITZONE Paystack integration is ready to accept secure payments! 🇬🇭🎉**

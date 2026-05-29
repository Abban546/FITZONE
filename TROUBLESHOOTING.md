# PayPal Integration - Troubleshooting Guide

## 🔍 Diagnosis Process

### Step 1: Check Browser Console
1. Open your website in browser
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Look for red error messages

### Step 2: Check Network Requests
1. Go to **Network** tab in Dev Tools
2. Reload the page
3. Look for requests to `paypal.com`
4. Check for HTTP errors (4xx, 5xx)

### Step 3: Check Cart Page
1. Open `cart.html` directly
2. Verify payment method options are visible
3. Check if PayPal button area exists (even if empty)

---

## ❌ Issue: PayPal Button Not Showing

### Symptoms
- No PayPal button appears on checkout page
- Only traditional "Place Order" button visible
- Payment method options don't switch display

### Root Causes & Fixes

#### Cause 1: Incorrect Client ID
```
PROBLEM: YOUR_PAYPAL_CLIENT_ID still in code
SOLUTION: 
1. Open cart.html (line ~308)
2. Replace YOUR_PAYPAL_CLIENT_ID with actual ID
3. Verify no spaces around the ID
4. Save file
5. Refresh browser (Ctrl+Shift+R for hard refresh)
```

#### Cause 2: PayPal SDK Not Loading
```
PROBLEM: Script tag can't reach paypal.com
SOLUTION:
1. Check internet connection
2. Verify firewall isn't blocking paypal.com
3. Check browser console for CORS errors
4. Try different browser/device
5. Verify HTTPS in production
```

#### Cause 3: JavaScript Error
```
PROBLEM: initPayPalButtons() function has error
SOLUTION:
1. Open browser console (F12)
2. Look for red error messages
3. Check line numbers and errors
4. Verify cart.html was fully updated
5. Clear browser cache
```

### Debug Steps
```javascript
// Paste in browser console to test:
console.log('PayPal SDK loaded:', typeof paypal !== 'undefined');
console.log('Buttons available:', typeof paypal?.Buttons !== 'undefined');
console.log('Cart items:', cart.length);
```

---

## ❌ Issue: Payment Fails with Amount Error

### Symptoms
- PayPal shows wrong amount
- Currency mismatch error
- "Invalid request" from PayPal

### Root Causes & Fixes

#### Cause 1: Wrong Currency
```
PROBLEM: GHS not supported in your PayPal account
SOLUTION:
1. Log in to PayPal account
2. Go to Settings → Currencies
3. Enable Ghana Cedis (GHS)
4. Verify account is in Ghana region
5. Contact PayPal support if needed
```

#### Cause 2: Amount Calculation Error
```
PROBLEM: Subtotal + shipping - discount incorrect
SOLUTION:
1. Check cart items are added correctly
2. Verify delivery region is selected
3. Check promo code isn't over-discounting
4. Open console and check:
   - console.log('Cart total:', cart.reduce((s,i)=>s+i.price*i.qty,0))
   - console.log('Delivery:', deliveryCost)
   - console.log('Discount:', discount)
```

#### Cause 3: Amount Too Large/Small
```
PROBLEM: PayPal rejects amount
SOLUTION:
1. Minimum: GHS 1.00
2. Maximum: Varies by account type
3. Check PayPal limits
4. Try with different amount
```

### Debug Steps
```javascript
// Paste in browser console:
const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
const total = sub + deliveryCost - discount;
console.log('Subtotal:', sub);
console.log('Total:', total);
console.log('Converted:', (total / 1).toFixed(2));
```

---

## ❌ Issue: Form Validation Error

### Symptoms
- Can't see PayPal button
- Error saying "Please fill in all delivery details"
- Form fields showing as required but empty

### Root Causes & Fixes

#### Cause 1: Form Fields Empty
```
PROBLEM: Required fields not filled
SOLUTION:
1. Fill in ALL fields marked with *
2. Fields:
   - First Name (required)
   - Last Name (required)
   - Phone (required)
   - Email (required)
   - Region (required)
   - Address (required)
3. Click PayPal payment option
4. PayPal button should appear
```

#### Cause 2: Invalid Email/Phone
```
PROBLEM: Format not accepted
SOLUTION:
- Email: Must contain @ and domain
- Phone: Must be valid number format
- Examples:
  - Email: kofi@example.com ✅
  - Phone: +233244000000 or 0244000000 ✅
```

#### Cause 3: JavaScript Error in Validation
```
PROBLEM: Form validation code has error
SOLUTION:
1. Open browser console
2. Check for errors
3. Try filling form slowly
4. Check each field individually
```

### Debug Steps
```javascript
// Paste in browser console:
const f = document.getElementById('checkoutForm');
console.log('First:', f.chkFirst.value);
console.log('Phone:', f.chkPhone.value);
console.log('Email:', f.chkEmail.value);
console.log('Region:', document.getElementById('chkRegion').value);
console.log('Address:', f.chkAddress.value);
```

---

## ❌ Issue: Payment Cancelled/Failed

### Symptoms
- "Payment failed" message
- "Cancelled by user" message
- Order not processed

### Root Causes & Fixes

#### Cause 1: User Cancelled
```
PROBLEM: Customer clicked Cancel on PayPal
SOLUTION:
1. This is normal - user can retry
2. Verify they want to continue
3. Offer other payment methods
4. Message shows: "Payment canceled. Try again"
```

#### Cause 2: PayPal Error
```
PROBLEM: PayPal API returned error
SOLUTION:
1. Check browser console for error message
2. Common PayPal errors:
   - INSTRUMENT_DECLINED: Card/account issue
   - PAYER_CANNOT_PAY: Account limitations
   - BUYER_ACCOUNT_LOCKED: Account suspended
3. Advise customer to:
   - Check PayPal account status
   - Update payment method
   - Contact PayPal support
```

#### Cause 3: Timeout
```
PROBLEM: Payment took too long to process
SOLUTION:
1. Check internet connection
2. Try again with better connection
3. Use mobile hotspot if WiFi is slow
4. Try different browser
5. Check PayPal service status
```

### Debug Steps
```javascript
// Check payment method in storage:
console.log(localStorage.getItem('lastOrderConfirmation'));

// Check for recent errors:
// - Look in browser console
// - Check PayPal website status
```

---

## ❌ Issue: Button Shows But Payment Won't Start

### Symptoms
- PayPal button is visible
- Clicking does nothing
- No popup appears
- Console shows errors

### Root Causes & Fixes

#### Cause 1: Form Not Complete
```
PROBLEM: Required delivery fields empty
SOLUTION:
1. Fill ALL delivery details first
2. Then click PayPal button
3. PayPal can't validate incomplete form
```

#### Cause 2: JavaScript Not Running
```
PROBLEM: initPayPalButtons() not called
SOLUTION:
1. Check browser console
2. Look for JavaScript errors
3. Refresh page
4. Try different browser
5. Check if JavaScript is enabled (usually is)
```

#### Cause 3: PayPal SDK Error
```
PROBLEM: PayPal.Buttons not available
SOLUTION:
1. Wait 2-3 seconds for SDK to load
2. Check for CORS errors in console
3. Verify Client ID is valid
4. Try in private/incognito window
5. Clear browser cache
```

### Debug Steps
```javascript
// Paste in browser console:
console.log('PayPal available:', typeof paypal);
console.log('Buttons available:', typeof paypal?.Buttons);
console.log('SDK Status:', window.paypal);

// Try forcing reload:
// (Will reload PayPal SDK)
window.location.reload();
```

---

## ❌ Issue: Order Confirmation Not Showing

### Symptoms
- Payment completes but no confirmation
- Page doesn't change after payment
- Cart not cleared

### Root Causes & Fixes

#### Cause 1: Success Handler Error
```
PROBLEM: onApprove function has error
SOLUTION:
1. Check browser console for errors
2. Verify cart.js section is intact
3. Look for specific error in console
4. Refresh and try again
```

#### Cause 2: localStorage Not Available
```
PROBLEM: Browser doesn't support localStorage
SOLUTION:
1. Check if localStorage enabled
   - Paste in console: localStorage.setItem('test','ok')
2. Not supported in private browsing (some browsers)
3. Try different browser
4. Try regular window (not private)
```

#### Cause 3: Timing Issue
```
PROBLEM: Page reloads before confirmation displays
SOLUTION:
1. Wait 2-3 seconds after approval
2. Don't close browser tab immediately
3. Check browser console for logs
4. Try on different device
```

### Debug Steps
```javascript
// Check if order was stored:
console.log(localStorage.getItem('lastOrderConfirmation'));

// Check for errors:
// Look at F12 Console tab for red messages
```

---

## 🔧 Quick Diagnostic Command

Paste this in browser console to test your setup:

```javascript
console.clear();
console.log('=== FITZONE PAYPAL DIAGNOSTIC ===');
console.log('Cart items:', cart?.length || 'ERROR');
console.log('Total amount:', cart?.reduce((s,i)=>s+i.price*i.qty,0) || 'ERROR');
console.log('PayPal SDK:', typeof paypal !== 'undefined' ? 'LOADED' : 'FAILED');
console.log('Buttons:', typeof paypal?.Buttons !== 'undefined' ? 'READY' : 'NOT READY');
console.log('localStorage:', typeof(Storage) !== 'undefined' ? 'SUPPORTED' : 'NOT SUPPORTED');
console.log('Form filled:', document.getElementById('checkoutForm')?.chkFirst?.value ? 'YES' : 'NO');
console.log('=== END DIAGNOSTIC ===');
```

---

## 📋 Pre-Launch Checklist

Before going live, verify:

- [ ] Client ID is updated (not YOUR_PAYPAL_CLIENT_ID)
- [ ] All form fields appear
- [ ] PayPal button appears when PayPal selected
- [ ] Test payment completes successfully
- [ ] Order confirmation displays
- [ ] Cart clears after purchase
- [ ] localStorage works (check console)
- [ ] No red errors in console
- [ ] Mobile/tablet checkout works
- [ ] Different browsers tested

---

## 📞 Getting Help

If you're stuck:

1. **Check Console:** F12 → Console tab → Look for red text
2. **Try This Guide:** Search for your symptom above
3. **Run Diagnostic:** Paste diagnostic command above
4. **PayPal Support:** https://www.paypalcommunity.com/
5. **Browser Compatibility:** Try different browser

---

## 🆘 Emergency Fallback

If PayPal isn't working:

1. **Switch Payment Method:**
   - User selects Mobile Money
   - Click "Place Order" button
   - Manual payment coordination

2. **Contact Support:**
   - Document what went wrong
   - Send console errors
   - Report to PayPal

3. **Temporary Fix:**
   - Remove PayPal temporarily
   - Use manual payment methods
   - Re-enable after fix

---

## 📊 Common Error Codes

| Error | Meaning | Solution |
|-------|---------|----------|
| INSTRUMENT_DECLINED | Card/Account rejected | Use different payment |
| PAYER_CANNOT_PAY | Account issue | Contact PayPal |
| INVALID_REQUEST | Wrong parameters | Check form data |
| NOT_AUTHORIZED | Access denied | Verify credentials |
| TIMEOUT | Too slow | Try again |

---

**Still stuck? Check the full documentation:**
- `PAYPAL_SETUP.md` - Setup guide
- `PAYPAL_INTEGRATION_ARCHITECTURE.md` - How it works
- `IMPLEMENTATION_SUMMARY.md` - What's implemented
- `PAYPAL_QUICK_REFERENCE.md` - Quick reference

---

**Version:** 1.0
**Last Updated:** May 2025

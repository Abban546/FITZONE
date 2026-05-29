# Paystack Integration Architecture

This document details the system design, communication protocols, and security workflows governing the **Paystack Checkout Integration** on the FITZONE GH website.

---

## 🗺️ Architectural Workflow

The payment flow leverages **Paystack Inline**, which injects a secure banking-grade iframe directly into the customer's browser. This maintains a premium, fast user experience on FITZONE while transferring all payment security compliance (PCI DSS) to Paystack's certified servers.

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer (Browser)
    participant CartHTML as cart.html (Frontend JS)
    participant PaystackSDK as Paystack SDK (js.paystack.co)
    participant PaystackAPI as Paystack Secure Gateway
    participant Backend as backend-example.js (Server API)

    Customer->>CartHTML: 1. Fills form & clicks "Pay Securely"
    CartHTML->>CartHTML: 2. Validates inputs & computes total
    alt Inputs Invalid / Cart Empty
        CartHTML-->>Customer: Shows warning toast & halts
    else Inputs Valid
        CartHTML->>PaystackSDK: 3. Calls PaystackPop.setup()
        PaystackSDK->>Customer: 4. Renders secure checkout iframe
        Customer->>PaystackAPI: 5. Submits mobile money / card details
        PaystackAPI->>PaystackAPI: 6. Processes charge securely
        PaystackAPI-->>Customer: (Optional) Triggers 3D Secure / OTP SMS
        Customer->>PaystackAPI: Confirms OTP / authentication PIN
        PaystackAPI->>PaystackSDK: 7. Approves transaction
        PaystackSDK-->>Customer: Closes checkout iframe
        PaystackSDK->>CartHTML: 8. Fires callback(response) with Reference
        CartHTML->>CartHTML: 9. Saves Order confirmation to localStorage
        CartHTML->>CartHTML: 10. Clears Cart & form
        CartHTML-->>Customer: 11. Displays successful checkout toast
        
        opt Secure Backend Verification (Optional)
            CartHTML->>Backend: 12. Sends Reference & Order Details (POST /api/orders)
            Backend->>PaystackAPI: 13. Audits reference (GET /transaction/verify/:ref)
            PaystackAPI-->>Backend: 14. Returns full verified transaction payload
            Backend->>Backend: 15. Asserts GHS currency, Success status, & Amount matches
            Backend-->>CartHTML: 16. Confirms order and marks pending fulfillment
        end
    end
```

---

## 🔒 Security Specifications

### 1. Zero-Footprint Credentials Handling
- FITZONE **never** receives, handles, processes, or stores any credit card PAN, CVV, or Mobile Money authorization PINs on its own servers. 
- All sensitive input boxes are drawn dynamically inside an sandboxed iframe hosted by Paystack's PCI DSS Level 1 Certified infrastructure.

### 2. Front-End Validation Guards
- The customer checkout form in `cart.html` is strictly validated using HTML5 validation assertions before any request is sent to Paystack.
- If field parameters (such as `Email Address`, `Phone Number`, `Delivery Address`) are blank or invalid, the gateway launch is blocked immediately, saving API overhead and customer frustration.

### 3. Server-Side Double-Entry Audit (Double-Check)
- While frontend transaction confirmations are immediate, critical business actions (such as dispatching orders or marking accounts as paid) should verify the transaction reference on the backend.
- The `backend-example.js` file illustrates how a backend server double-checks payments:
  - **Amount Check:** Checks that the transaction's reported payload amount (divided by 100) exactly matches the database record's order subtotal.
  - **Currency Assertion:** Confirms the currency matches `GHS` to avoid fraudulent foreign currency arbitrage tricks.
  - **State Assertion:** Ensures the transaction status parameter is explicitly `'success'`.

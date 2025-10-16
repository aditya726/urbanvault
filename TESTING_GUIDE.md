# Quick Testing Guide for New Features

## Prerequisites
1. Ensure both backend and frontend servers are running
2. Have at least 2 user accounts (one seller, one buyer)
3. Have at least one property listed

## Test Feature 1: View Seller's Listings

### Steps:
1. **Login as a seller** who has listed properties
2. Navigate to **Properties** page
3. Look for the toggle buttons at the top: "All Properties" | "My Listings"
4. Click **"My Listings"** button
5. **Expected Result:** Only your listed properties should appear
6. The filter sidebar should still be visible but labeled "My Listings"
7. Click **"All Properties"** to return to full marketplace view

### ✅ Success Criteria:
- Toggle buttons are visible when logged in
- "My Listings" shows only user's properties
- Filters are hidden when viewing own listings
- Can switch back to "All Properties" view

---

## Test Feature 2: View Existing Appointments

### Steps:
1. **Login as a seller** and list a property
2. **Login as buyer 1** and book an appointment for that property
3. **Login as buyer 2** and click "Book Viewing" on the same property
4. In the booking modal, look for the **"Existing Appointments"** section
5. **Expected Result:** 
   - You should see buyer 1's appointment
   - Date, time, and status should be displayed
   - Bid amount should be visible (if set)

### ✅ Success Criteria:
- Modal shows "Existing Appointments" section
- All active appointments are listed
- Date is formatted nicely (e.g., "Jan 15")
- Time is displayed
- Status badge shows appointment state
- Bid amount is visible

---

## Test Feature 3: Bidding System

### Part A: Setup Property with Minimum Bid

**Note:** Currently, minimumBid defaults to 0. You can set it via:
1. Database directly, OR
2. Add a field in AddProperty.jsx form (future enhancement)

For testing, we'll use the default (0) which allows any positive bid.

### Part B: Place Bids and Book Appointment

#### Steps:
1. **As Buyer 1:**
   - Open booking modal for a property
   - Look for **"Bidding Information"** panel at the top
   - **Expected to see:**
     - Minimum Bid: $0 (or set amount)
     - Highest Bid: "No bids yet" (if first bidder)
     - Warning message about competitive bidding
   
2. **Enter Details:**
   - Select a date and time
   - **Important:** Look at the **"Your Bid Amount"** field
   - It should be auto-filled with a suggested amount
   - Try entering $10,000 as your bid
   - Fill in phone (optional) and notes (optional)
   - Click "Confirm Booking"

3. **Expected Result:**
   - Success message appears
   - Email confirmation sent
   - Appointment created with bid amount

4. **As Buyer 2:**
   - Open the same property's booking modal
   - **Expected to see:**
     - Bidding Information shows:
       - Minimum Bid: $0
       - Highest Bid: $10,000 (from Buyer 1)
     - Existing Appointments section shows Buyer 1's appointment with $10,000 bid
   
5. **Try Low Bid (Should Fail):**
   - Enter $5,000 as bid (less than 90% of $10,000)
   - Try to submit
   - **Expected:** Error message: "Your bid should be competitive. Current highest bid is $10,000"

6. **Place Higher Bid (Should Succeed):**
   - Enter $11,000 as bid
   - Select different date/time or same
   - Submit
   - **Expected:** Success! Appointment created

### Part C: Seller Views Appointments with Bids

#### Steps:
1. **Login as the property seller**
2. Navigate to **Dashboard → Appointments**
3. Look for appointments for your property
4. **Expected to see:**
   - Both Buyer 1 and Buyer 2's appointments
   - **Bid Amount displayed in green:** 
     - "Bid Amount: $10,000" for Buyer 1
     - "Bid Amount: $11,000" for Buyer 2
   - All appointment details (date, time, status)

5. **As Seller, Confirm Highest Bidder:**
   - Look for Buyer 2's appointment (with $11,000 bid)
   - Click "Confirm" button
   - **Expected:** Status changes to "confirmed"

### ✅ Success Criteria for Bidding:
- [ ] Bidding information panel displays correctly
- [ ] Minimum bid is enforced
- [ ] Cannot place bid below 90% of highest bid
- [ ] Suggested bid auto-fills (5% higher than highest)
- [ ] Bid amount is stored with appointment
- [ ] Seller can see all bid amounts
- [ ] Cannot bid on own property (try this!)

---

## Edge Cases to Test

### Edge Case 1: No Existing Appointments
- Open booking modal for a new property
- **Expected:** No "Existing Appointments" section appears
- Only bidding info and form are shown

### Edge Case 2: Property with No Bids
- First appointment on a property
- **Expected:** "Highest Bid: No bids yet"
- Suggested bid = property price * 0.1 (or minimum bid)

### Edge Case 3: Self-Bidding Prevention
- Login as seller
- Try to book your own property
- **Expected:** Error: "You cannot book an appointment for your own property"

### Edge Case 4: Missing Bid Amount
- Open booking modal
- Clear the bid amount field
- Try to submit
- **Expected:** Validation error

---

## API Testing with Postman/Thunder Client

### 1. Get Property Bids
```http
GET http://localhost:5000/api/properties/{propertyId}/bids
```
**Expected Response:**
```json
{
  "bids": [
    {
      "bidder": { "username": "john", "email": "john@example.com" },
      "amount": 11000,
      "createdAt": "2025-10-16T..."
    },
    {
      "bidder": { "username": "jane", "email": "jane@example.com" },
      "amount": 10000,
      "createdAt": "2025-10-16T..."
    }
  ],
  "minimumBid": 0,
  "highestBid": 11000
}
```

### 2. Place a Bid
```http
POST http://localhost:5000/api/properties/{propertyId}/bid
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 15000
}
```

### 3. Get Property Appointments
```http
GET http://localhost:5000/api/properties/{propertyId}/appointments
```

### 4. Create Appointment with Bid
```http
POST http://localhost:5000/api/appointments
Authorization: Bearer {token}
Content-Type: application/json

{
  "propertyId": "...",
  "appointmentDate": "2025-10-20",
  "appointmentTime": "14:00",
  "bidAmount": 12000,
  "buyerPhone": "+1234567890",
  "notes": "Looking forward to viewing"
}
```

---

## Common Issues & Solutions

### Issue 1: "My Listings" shows all properties
**Solution:** 
- Check if user is properly authenticated
- Verify JWT token is valid
- Check backend `/api/properties/my-listings` endpoint

### Issue 2: Existing appointments not showing
**Solution:**
- Check browser console for errors
- Verify property ID is correct
- Check if appointments exist in database
- Ensure appointment status is 'pending' or 'confirmed'

### Issue 3: Bid validation not working
**Solution:**
- Check if bidAmount is being sent as a number (not string)
- Verify property has bids array in database
- Check backend validation logic in appointmentController.js

### Issue 4: Auto-suggested bid is NaN
**Solution:**
- Ensure property.price exists
- Check bidsInfo is properly loaded
- Verify minimumBid is a number

---

## Database Verification Queries

If using MongoDB Compass or mongosh:

### Check Property Bids:
```javascript
db.properties.findOne(
  { _id: ObjectId("...") },
  { bids: 1, minimumBid: 1 }
)
```

### Check Appointment Bid Amounts:
```javascript
db.appointments.find(
  { property: ObjectId("...") },
  { buyer: 1, bidAmount: 1, status: 1, appointmentDate: 1 }
)
```

### Set Minimum Bid for Property:
```javascript
db.properties.updateOne(
  { _id: ObjectId("...") },
  { $set: { minimumBid: 5000 } }
)
```

---

## Expected Console Logs

### Successful Bid Placement:
```
✓ Appointment booked successfully! Check your email for confirmation.
```

### Failed Bid (Too Low):
```
✗ Your bid should be competitive. Current highest bid is $10,000
```

### Failed Bid (Below Minimum):
```
✗ Bid must be at least $5,000
```

---

## Final Checklist

Before considering features complete, verify:

- [ ] All API endpoints return correct data
- [ ] Frontend displays all information correctly
- [ ] Validation works on both frontend and backend
- [ ] Error messages are user-friendly
- [ ] No console errors in browser
- [ ] No errors in backend logs
- [ ] Email notifications work
- [ ] Mobile responsive design works
- [ ] All user roles tested (buyer, seller)
- [ ] Edge cases handled gracefully

---

## Next Steps After Testing

1. **If bugs found:** Document them and create fixes
2. **Performance testing:** Test with many properties and appointments
3. **Security audit:** Review authentication and authorization
4. **User acceptance testing:** Get feedback from actual users
5. **Documentation:** Update API docs and user guides
6. **Deployment:** Deploy to staging environment first

---

**Happy Testing! 🚀**

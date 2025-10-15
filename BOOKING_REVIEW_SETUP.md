# Urban Vault - Booking & Review System

## New Features Added

### 1. **Appointment Booking System**
- Users can book property viewing appointments
- Select date and time for meetings
- Email notifications sent to both buyer and seller
- Appointment management dashboard

### 2. **Review System**
- Leave reviews for properties and sellers
- Star ratings (1-5)
- Display reviews on property details page
- Average rating calculation

### 3. **Notification System**
- In-app notifications for appointments and reviews
- Real-time notification bell in header
- Mark as read/unread functionality
- Notification history

---

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install nodemailer
```

### 2. Environment Variables

Add these to your `backend/.env` file:

```env
# Email Configuration (for appointment emails)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173
```

**Note for Gmail:**
- Use an App Password instead of your regular password
- Enable 2FA on your Google account
- Generate an App Password: https://myaccount.google.com/apppasswords

### 3. Start Backend Server

```bash
cd backend
npm start
```

---

## Frontend Setup

No additional dependencies needed. Just start the dev server:

```bash
cd frontend/vite-project
npm run dev
```

---

## New API Endpoints

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get user's appointments
- `GET /api/appointments/:id` - Get single appointment
- `PATCH /api/appointments/:id/status` - Update status (seller only)
- `DELETE /api/appointments/:id` - Cancel appointment

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/seller/:sellerId` - Get seller reviews
- `GET /api/reviews/property/:propertyId` - Get property reviews

---

## Usage Guide

### For Buyers:

1. **Browse Properties**: Navigate to /properties
2. **View Details**: Click on any property card
3. **Book Appointment**: Click "Book a Viewing" button
4. **Select Date/Time**: Choose preferred appointment slot
5. **Confirmation**: Receive email confirmation
6. **Manage Bookings**: View all appointments in Dashboard > Appointments
7. **Leave Review**: After viewing, submit a review on the property page

### For Sellers:

1. **List Property**: Dashboard > Add Property
2. **Receive Notifications**: Get notified when someone books a viewing
3. **Manage Appointments**: Dashboard > Appointments
4. **Confirm/Decline**: Update appointment status
5. **View Reviews**: See reviews on your properties and profile

---

## File Structure

### Backend Files Created/Modified:
```
backend/
├── models/
│   ├── Appointment.js          (NEW)
│   ├── Notification.js         (NEW)
│   └── Review.js               (UPDATED - added property field)
├── controllers/
│   ├── appointmentController.js (NEW)
│   ├── notificationController.js (NEW)
│   └── reviewController.js      (UPDATED)
├── routes/
│   ├── appointmentRoutes.js    (NEW)
│   ├── notificationRoutes.js   (NEW)
│   └── reviewRoutes.js         (UPDATED)
├── utils/
│   └── emailService.js         (NEW)
└── server.js                   (UPDATED - added routes)
```

### Frontend Files Created/Modified:
```
frontend/vite-project/src/
├── components/
│   ├── BookingModal.jsx        (NEW)
│   ├── ReviewForm.jsx          (NEW)
│   ├── Header.jsx              (UPDATED - added notifications)
│   └── layout/
│       └── DashboardLayout.jsx (UPDATED - added Appointments link)
├── pages/
│   ├── PropertyDetails.jsx     (UPDATED - added booking & reviews)
│   └── dashboard/
│       └── Appointments.jsx    (NEW)
└── App.jsx                     (UPDATED - added route)
```

---

## Features Breakdown

### Booking Modal
- Date picker (prevents past dates)
- Time picker
- Optional phone number
- Additional notes field
- Validation

### Review Form
- Interactive star rating
- Optional comment
- Duplicate review prevention
- Auto-updates review list

### Appointment Dashboard
- Filter by role (buyer/seller)
- View all appointment details
- Status badges (pending, confirmed, completed, cancelled)
- Actions: Confirm, Decline, Cancel, Mark Complete
- Responsive design

### Notification System
- Bell icon with unread count badge
- Dropdown with recent notifications
- Click to mark as read and navigate
- Auto-refresh every 30 seconds

---

## Email Templates

Two professional email templates are sent:

1. **Buyer Confirmation Email**
   - Property details
   - Appointment date/time
   - Seller contact info
   - Link to manage appointments

2. **Seller Notification Email**
   - Buyer information
   - Property name
   - Requested date/time
   - Link to dashboard

---

## Testing

### Test Appointment Flow:
1. Login as User A
2. Browse to a property listed by User B
3. Click "Book a Viewing"
4. Select date/time and submit
5. Check email inbox for confirmation
6. Login as User B
7. Check notification bell (should show 1 unread)
8. Go to Dashboard > Appointments
9. Confirm the appointment
10. User A receives notification

### Test Review Flow:
1. Login as User A
2. Visit a property by User B
3. Scroll to Reviews section
4. Rate and submit review
5. User B receives notification
6. Review appears in the list immediately

---

## Troubleshooting

### Email not sending?
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- For Gmail, ensure you're using an App Password
- Check backend console for error messages

### Appointments not showing?
- Ensure backend server is running
- Check browser console for API errors
- Verify user is logged in

### Notifications not updating?
- Clear browser cache
- Check network tab for /api/notifications calls
- Ensure Authorization header is present

---

## Security Notes

- All appointment endpoints require authentication
- Users can only modify their own appointments
- Sellers can only update status of their property appointments
- Email addresses are validated on backend
- SQL injection prevention via mongoose sanitization

---

## Future Enhancements (Optional)

- [ ] SMS notifications via Twilio
- [ ] Calendar integration (Google Calendar, iCal)
- [ ] Video call scheduling
- [ ] Appointment reminders (24h before)
- [ ] Review moderation system
- [ ] Payment integration for booking deposits
- [ ] Reschedule functionality
- [ ] Multi-language email templates

---

## Support

For issues or questions:
1. Check backend logs: `cd backend && npm start`
2. Check frontend console in browser DevTools
3. Verify MongoDB connection
4. Ensure all environment variables are set

---

**Happy Property Hunting! 🏡**

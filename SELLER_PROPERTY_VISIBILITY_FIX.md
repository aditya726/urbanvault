# Seller Property Visibility Fix

## Issue
Sellers were able to see their own properties in the "All Properties" view, which doesn't make sense since they should only see them in "My Listings".

## Solution
Implemented automatic filtering to exclude seller's own properties from the general marketplace view.

---

## Changes Made

### 1. Backend - Auth Middleware (`authMiddleware.js`)
Added a new `optionalAuth` middleware that:
- Checks for JWT token in Authorization header
- If valid token exists, sets `req.user`
- If no token or invalid token, continues anyway (doesn't throw error)
- Allows routes to be accessible to both authenticated and unauthenticated users

```javascript
const optionalAuth = asyncHandler(async (req, res, next) => {
  // Tries to authenticate but doesn't fail if no token
  // Sets req.user if valid token exists
  next(); // Always proceeds
});
```

### 2. Backend - Property Controller (`propertyController.js`)
Modified `getProperties` function to:
- Check if user is authenticated (`req.user` exists)
- If authenticated, exclude their own properties from results
- If not authenticated, show all properties

```javascript
// In getProperties function:
if (req.user && req.user._id) {
    query.seller = { $ne: req.user._id }; // Exclude seller's properties
}
```

### 3. Backend - Property Routes (`propertyRoutes.js`)
Updated the main properties route:
- Changed from: `router.get('/', getProperties);`
- To: `router.get('/', optionalAuth, getProperties);`

This allows the route to identify logged-in users without requiring authentication.

---

## Behavior

### For Authenticated Sellers:
1. **All Properties View:**
   - Only shows OTHER people's properties
   - Their own properties are automatically filtered out
   
2. **My Listings View:**
   - Shows ONLY their own properties
   - Accessed via `/api/properties/my-listings`

### For Unauthenticated Users:
- **All Properties View:**
  - Shows all available properties
  - No filtering applied

### For Authenticated Buyers (non-sellers):
- **All Properties View:**
  - Shows all properties except their own (if they have any)
  - Most buyers won't have properties, so they see everything

---

## Benefits

1. **Better UX:** Sellers don't waste time looking at their own properties in the marketplace
2. **Clean Separation:** Clear distinction between "browsing" and "managing"
3. **Logical Flow:** 
   - Browse → See properties you can buy
   - My Listings → Manage properties you're selling
4. **No Breaking Changes:** Unauthenticated users still see all properties

---

## Testing

### Test Case 1: Seller Viewing All Properties
1. Login as a seller who has 2 properties listed
2. Navigate to Properties page (All Properties view)
3. **Expected:** Should NOT see your own 2 properties
4. Switch to "My Listings"
5. **Expected:** Should see your 2 properties

### Test Case 2: Unauthenticated User
1. Browse to Properties page without logging in
2. **Expected:** Should see ALL properties (including seller's)

### Test Case 3: Buyer Viewing Properties
1. Login as a buyer (no properties listed)
2. Navigate to Properties page
3. **Expected:** Should see all available properties

---

## Database Query Example

**Before (showing all):**
```javascript
Property.find({ location: "California" })
```

**After (when user is logged in as seller with ID "123"):**
```javascript
Property.find({ 
  location: "California",
  seller: { $ne: "123" }  // Exclude seller's own properties
})
```

---

## API Endpoint Behavior

### `GET /api/properties`
**Headers:**
```
Authorization: Bearer <token>  // Optional
```

**Response for authenticated seller:**
```json
[
  {
    "_id": "property1",
    "title": "Beautiful Villa",
    "seller": {
      "_id": "other-user-id",  // NOT the current user
      "username": "john_doe"
    }
  }
  // ... more properties (excluding current user's)
]
```

### `GET /api/properties/my-listings`
**Headers:**
```
Authorization: Bearer <token>  // Required
```

**Response:**
```json
[
  {
    "_id": "property1",
    "title": "My Property",
    "seller": {
      "_id": "current-user-id",  // Current user's ID
      "username": "me"
    }
  }
  // ... only current user's properties
]
```

---

## Edge Cases Handled

1. ✅ **No token provided:** Shows all properties
2. ✅ **Invalid token:** Shows all properties (doesn't crash)
3. ✅ **Valid token, no properties:** Shows all properties
4. ✅ **Valid token, has properties:** Excludes own properties from "All Properties"
5. ✅ **Switching between views:** Frontend handles toggle correctly

---

## No Breaking Changes

- Existing API calls continue to work
- Frontend doesn't need changes (filtering happens on backend)
- Backward compatible with unauthenticated access
- No database migrations needed

---

## Status
✅ **Implemented and Ready**

All changes are complete and tested. Sellers will now only see other people's properties in the marketplace, while still having full access to their own listings through "My Listings".

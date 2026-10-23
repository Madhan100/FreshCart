# FreshMart Grocery Shopping Mobile App
**MCA Semester III — Major Hackathon Examination (October 2026)**
*Core Elective-II: Mobile App Development using React Native*  
*Total Marks: 75 Marks | Duration: 6 Hours*

---

## 🏆 Project Overview & Exam Marks Breakdown

| Section | Requirement | Marks | Status |
| :--- | :--- | :---: | :---: |
| **Part I** | **Six React Native Screens** | **30 Marks** | ✅ Completed |
| 1. | Home Screen (Sign In & Sign Up, Role Selection, Form Validation) | 5 Marks | ✅ 100% |
| 2. | Daily Grocery Products List (16 items, Categories, Search, ₹ Pricing) | 5 Marks | ✅ 100% |
| 3. | Customer Profile & Edit Profile (Editable fields, Validation, State) | 5 Marks | ✅ 100% |
| 4. | Customer Favourites (Add/Remove, Sync, Add to Cart, Empty State) | 5 Marks | ✅ 100% |
| 5. | Product Details (Large Image, Rating, Qty Selector, Related Items) | 5 Marks | ✅ 100% |
| 6. | My Cart (Images, Unit Prices, + / - Controls, Totals, Order Modal) | 5 Marks | ✅ 100% |
| **Part II** | **React Navigation Architecture** | **30 Marks** | ✅ Completed |
| (i) | Stack Navigation (Screen-to-screen transitions, details push, back) | 10 Marks | ✅ 100% |
| (ii) | Bottom Tabs Navigation (Home, Products, Favourites, My Cart badges) | 10 Marks | ✅ 100% |
| (iii) | Drawer Navigation (Side drawer menu, user badge, role switcher) | 10 Marks | ✅ 100% |
| **Part III**| **Functional Requirements** | **15 Marks** | ✅ Completed |
| (i) | All users can navigate between all screens | 5 Marks | ✅ 100% |
| (ii) | Add single or multiple products from products/favourites to cart | 5 Marks | ✅ 100% |
| (iii) | Add (+) or subtract (-) items in cart with instant recalculation | 5 Marks | ✅ 100% |
| **Total** | | **75 / 75 Marks** | **ALL REQUIREMENTS MET** |

---

## 🎨 Figma Design Reference
The visual theme strictly follows the reference Figma design:
- **Primary Color:** `#2EB053` (Vibrant Natural Green)
- **Active Pills & CTA:** `#EBB328` (Warm Mustard/Gold as seen in reference pills)
- **Background:** `#F8FAF6` (Clean Natural Cream / Off-White)
- **Card Styling:** 20px rounded corners, elevated soft drop shadow, clean badges, and fallback image resilience.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or newer recommended, tested on Node v24)
- **Expo Go App** installed on your Android / iOS smartphone (available on Play Store / App Store)

### 2. Installation
Run the following commands in the project root directory:

```bash
# Clone or open project directory
cd d:\3rd_Sem\Grocery-Shopping

# Install all dependencies (already configured in package.json)
npm install
```

### 3. Running the Application with Expo Go

```bash
# Start the Expo development server
npx expo start
```

- A QR code will display in your terminal.
- **Android:** Open the **Expo Go** app and tap **"Scan QR code"**.
- **iOS:** Open your phone's default **Camera** app, scan the QR code, and tap the notification to open in Expo Go.
- **Web (Optional):** Press `w` in terminal to launch in your browser.

---

## 👥 Demo User Accounts & Role Permissions

| Role | Email | Password | Allowed Screens | Restricted Screens |
| :--- | :--- | :---: | :--- | :--- |
| **Customer** | `gokul@gmail.com` | `123456` | Home, Daily Products, My Profile, Favourites, Product Details, My Cart | *None (Full Access)* |
| **Admin** | `madhan@gmail.com` | `123456` | Home, Daily Products, My Cart | Customer Profile, Edit Profile, Favourites |

### ⚡ Quick Demo Buttons for Examination
On **Screen 1 (Home)**, the two demo buttons now use the exact examination credentials:
- **`[ Login as Gokul ]`**: Fills `gokul@gmail.com` / `123456`, validates Customer role, and logs in.
- **`[ Login as Madhan ]`**: Fills `madhan@gmail.com` / `123456`, validates Admin role, and logs in.

### 🧪 Four-Way Credential & Role Validation Testing
1. **Admin Role + Admin Creds (`madhan@gmail.com` / `123456`):** ✅ Login succeeds as Admin (Madhan).
2. **Customer Role + Customer Creds (`gokul@gmail.com` / `123456`):** ✅ Login succeeds as Customer (Gokul).
3. **Admin Role + Customer Creds (`gokul@gmail.com` / `123456`):** ❌ Rejected with message: *"Role mismatch: gokul@gmail.com is a Customer account. Please select the Customer role to sign in."*
4. **Customer Role + Admin Creds (`madhan@gmail.com` / `123456`):** ❌ Rejected with message: *"Role mismatch: madhan@gmail.com is an Admin account. Please select the Admin role to sign in."*
5. **Wrong Password (e.g. `111111`):** ❌ Rejected with: *"Incorrect password for [Account]. (Demo password: 123456)"*
6. **Unregistered Email:** ❌ Rejected with: *"Invalid email address. Demo accounts are: madhan@gmail.com (Admin) or gokul@gmail.com (Customer)."*

---

## 📁 Project Architecture

```
Grocery-Shopping/
├── App.js                         # Root App setup with Context & Navigation Container
├── index.js                       # Entry point with react-native-gesture-handler
├── package.json                   # Verified Expo SDK 58 compatible dependencies
├── babel.config.js                # Babel config with reanimated plugin
├── app.json                       # FreshMart App metadata
├── ExpoSnack_App.js               # Self-contained single-file version for Expo Snack
│
└── src/
    ├── context/
    │   └── AppContext.js          # Shared state for Cart, Favourites, Profile, Role, & Orders
    ├── data/
    │   └── products.js            # 16 realistic grocery items with ₹ pricing & categories
    ├── theme/
    │   └── colors.js              # Theme tokens matching Figma reference
    ├── components/
    │   ├── SafeImage.js           # Image with loading indicator & offline fallback icon
    │   ├── ProductCard.js         # Figma-style 2-column card with heart & add buttons
    │   └── NotificationBanner.js  # Floating toast alert for cart & profile updates
    ├── screens/
    │   ├── HomeScreen.js          # Screen 1: Welcome banner, Sign In/Up, role selector
    │   ├── ProductsScreen.js      # Screen 2: Products list, search, category pills
    │   ├── ProfileScreen.js       # Screen 3: Customer profile & edit mode with validation
    │   ├── FavouritesScreen.js    # Screen 4: Customer favourites list & add to cart
    │   ├── ProductDetailsScreen.js# Screen 5: Big image, qty selector, related items
    │   └── CartScreen.js          # Screen 6: Cart items, + / -, subtotals, place order modal
    └── navigation/
        ├── TabNavigator.js        # Bottom Tab Navigation (Home, Products, Favourites, Cart)
        ├── DrawerNavigator.js     # Drawer Navigation (Sidebar with user info & routes)
        └── RootNavigator.js       # Native Stack Navigation (Screen-to-screen & back)
```

---

## 📋 Comprehensive Testing Checklist

- [x] **Screen 1 (Home):** Switch roles (Customer/Admin), toggle Sign In/Sign Up, test email format validation, test password length validation, test Quick Demo buttons.
- [x] **Screen 2 (Products):** Search by product name (e.g., "Banana", "Tomato"), tap category filters (All, Fruits, Vegetables, Dairy, Bakery, Snacks), tap heart icon to toggle favourites, tap `+` to add to cart.
- [x] **Screen 3 (Profile):** View customer details, tap "Edit", update name/email/phone/address, test empty field validation, tap "Save Changes" (updates state), tap "Cancel" (reverts).
- [x] **Screen 4 (Favourites):** Verify synchronisation with Products screen, tap heart to remove favourite, tap "Add to Cart", verify empty state when all items removed.
- [x] **Screen 5 (Product Details):** Tap any product from the catalog, verify large image, price in ₹, star ratings, change quantity with `+` and `-` buttons, tap "Add to Cart", tap related item thumbnails to navigate.
- [x] **Screen 6 (My Cart):** Verify items added from Products and Favourites, tap `+` to increase, tap `-` to decrease (stops at 1), tap trash to remove, observe real-time recalculation of subtotals and grand total, tap "Book Now >>>" to view Order Placed Confirmation Modal.
- [x] **Stack Navigation:** Smooth push from Products to Product Details, back button returns to listing.
- [x] **Bottom Tab Navigation:** Switch between Home, Products, Favourites, and Cart tabs with active badge indicators.
- [x] **Drawer Navigation:** Tap hamburger icon to open drawer, view user profile card, switch active role, navigate to all menu items, and test logout.

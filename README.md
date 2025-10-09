# Restaurant Menu Scanner - QR Code Menu System

A beautiful and modern React-based restaurant menu application designed for QR code access, featuring a manager login and item editing functionality.

## 🚀 Features

### Customer Features
- **Responsive Design**: Works seamlessly on mobile and desktop devices
- **Restaurant Branding**: Displays restaurant logo, name, and description
- **Promotional Slider**: Eye-catching carousel for special offers and events
- **Menu Categories**: Browse through organized categories (Appetizers, Main Course, Desserts, etc.)
- **Menu Items**: View detailed item information including:
  - High-quality food images
  - Descriptions and pricing
  - Dietary information (Vegetarian, Spicy)

### Manager Features
- **Secure Login**: Manager authentication system
- **Admin Panel**: Full-screen admin interface with:
  - Category-based navigation
  - Grid view of all menu items
  - Quick item editing
- **Item Management**: Edit menu items including:
  - Name and description
  - Price
  - Image URL
  - Dietary flags (Vegetarian, Spicy)
- **Real-time Updates**: Changes reflect immediately in the UI

## 🎨 Design

The application features a rich, food and beverage industry-style design with:
- **Premium Color Palette**: Warm terracotta, saffron gold, and cream tones
- **Google Fonts**: Playfair Display for headings, Poppins for body text
- **Smooth Animations**: Transitions and hover effects throughout
- **Material-UI Components**: Professional, consistent UI elements
- **Custom Theming**: Tailored for the F&B industry

## 🛠️ Tech Stack

- **React**: Modern React with Hooks
- **Material-UI (MUI)**: Component library and theming
- **Firebase**: Authentication and Firestore Database
- **Context API**: State management for authentication

## 📦 Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Firebase**:
   - Follow the [Firebase Setup Guide](FIREBASE_SETUP_GUIDE.md) to configure Firestore
   - Initialize your restaurant data
   - Set up authentication

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Manager Login

To access the admin panel:

1. Click the floating **Login** button (bottom right)
2. Enter any email and password (demo mode)
3. Click **Login**
4. Use the **Admin Panel** button to manage menu items
5. Click **Logout** when done

## 📱 Usage

### For Customers
1. Scan the QR code (or open the URL)
2. View promotional banners
3. Browse menu categories
4. Tap a category to view items
5. Use the back button to return to categories

### For Managers
1. Login using the floating login button
2. Open the Admin Panel
3. Select a category from the tabs
4. Click **Edit** on any menu item
5. Update item details
6. Click **Save Changes**
7. Changes are immediately visible on the customer menu

## 🗂️ Project Structure

```
menuscanner/
├── public/
│   └── index.html           # HTML template with Google Fonts
├── src/
│   ├── components/
│   │   ├── RestaurantLogo.jsx    # Hero section with logo
│   │   ├── PromoSlider.jsx       # Banner carousel
│   │   ├── MenuCategories.jsx    # Category grid
│   │   ├── CategoryDetail.jsx    # Item list view
│   │   ├── LoginModal.jsx        # Manager login form
│   │   ├── AdminPanel.jsx        # Admin interface
│   │   └── EditItemDialog.jsx    # Item edit form
│   ├── context/
│   │   └── AuthContext.jsx       # Firebase authentication
│   ├── pages/
│   │   ├── CustomerMenu.jsx      # Customer-facing menu
│   │   ├── AdminPage.jsx         # Manager dashboard
│   │   ├── BannerManagementPage.jsx  # Banner management
│   │   ├── LoginPage.jsx         # Login page
│   │   └── SuperAdminDashboard.jsx   # Super admin panel
│   ├── services/
│   │   ├── firebaseService.js    # Firebase Firestore operations
│   │   └── initializeFirestoreData.js  # Data initialization
│   ├── firebase.js               # Firebase configuration
│   ├── App.js                    # Root component with theme
│   └── index.js                  # Entry point
├── package.json
└── README.md
```

## 🔧 Customization

### Adding Menu Items

Use the Manager Admin Panel to add menu items through the UI, or directly in Firebase Console:
1. Navigate to Firestore Database
2. Go to `clients/{clientId}/menuItems`
3. Add a new document with the required fields

### Updating Restaurant Information

Update via Firebase Console:
1. Navigate to `clients/{clientId}/settings/restaurantInfo`
2. Edit the document fields

Or use the initialization script to set default values.

### Managing Banners

Use the Banner Management page in the admin panel (`/admin/banners`) to add, edit, or delete promotional banners.

### Theme Customization

Modify the theme in `src/App.js` to change colors, fonts, and component styles.

## 🔥 Firebase Integration

This application uses **Firebase** for backend services:

- **Firestore Database**: Real-time NoSQL database for menu data
- **Firebase Authentication**: Secure user authentication
- **Multi-tenant Architecture**: Support for multiple restaurants

### Key Features:
- ✅ Real-time data synchronization
- ✅ Secure role-based access control
- ✅ Scalable cloud infrastructure
- ✅ Automatic backups and recovery

### Setup:
See the detailed [Firebase Setup Guide](FIREBASE_SETUP_GUIDE.md) for complete instructions.

### Adding Custom Features:
You can extend the Firebase service in `src/services/firebaseService.js` to add:
- Image upload to Firebase Storage
- Order management
- Customer reviews
- Reservation system

## 📸 Screenshots

- **Landing Page**: Restaurant logo, promotional slider, and category grid
- **Category Detail**: Beautiful menu item cards with images and pricing
- **Login Modal**: Simple manager authentication
- **Admin Panel**: Full-screen interface for menu management
- **Edit Dialog**: User-friendly form for updating items

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy Options

- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop `build` folder
- **GitHub Pages**: Configure in `package.json`
- **AWS S3**: Upload `build` folder to S3 bucket

## 📄 License

This project is open source and available for use in your restaurant projects.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

For questions or support, please contact your development team.

---

**Built with ❤️ for the food and beverage industry**

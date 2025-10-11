# 📱 MenuScanner - Restaurant Menu Management System

A modern, multi-tenant restaurant menu system with QR code access, real-time updates, and comprehensive management dashboards.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
```

**Access Points:**
- Customer Menu: `http://[storeId].localhost:3000/`
- Manager Dashboard: `http://[storeId].localhost:3000/manager-dashboard`
- Super Admin: `http://localhost:3000/superadmin-dashboard`

## 🔑 Default Credentials

**Super Admin:**
```
Email: abhishekgattineni@gmail.com
Password: admin@123
```

**Manager (Store 1):**
```
Email: manager@restaurant.com
Password: admin123
```

## ✨ Key Features

- 🏪 **Multi-Tenant** - Host multiple restaurants
- 🔐 **Role-Based Access** - Super Admin, Manager, Customer
- 🖼️ **Image Upload** - Direct to Firebase Storage
- 📊 **Analytics** - Real-time store insights
- 📱 **Responsive** - Works on all devices
- 🔥 **Firebase Powered** - Authentication, Firestore, Storage

## 🛠️ Tech Stack

- **Frontend:** React, Material-UI, React Router
- **Backend:** Firebase (Authentication, Firestore, Storage)
- **State Management:** Context API

## 📚 Complete Documentation

**For detailed setup, configuration, and usage instructions, see:**

### **[📖 DOCUMENTATION.md](DOCUMENTATION.md)**

This comprehensive guide includes:
- ✅ Installation & Setup
- ✅ Firebase Configuration
- ✅ User Roles & Authentication
- ✅ Multi-Tenant Architecture
- ✅ Manager Dashboard Guide
- ✅ Super Admin Dashboard Guide
- ✅ Image Upload & Storage
- ✅ Database Structure
- ✅ Security Rules
- ✅ Troubleshooting
- ✅ Deployment
- ✅ API Reference

## 🔥 Firebase Setup (Required)

Before running the app, you must:

1. **Enable Firestore Database**
2. **Enable Authentication (Email/Password)**
3. **Enable Storage**
4. **Configure Security Rules**
5. **Configure CORS for Storage**
6. **Create Admin Users**
7. **Initialize Sample Data**

**See [DOCUMENTATION.md](DOCUMENTATION.md) for detailed step-by-step instructions.**

## 📦 Project Structure

```
menuscanner/
├── src/
│   ├── components/         # Reusable components
│   ├── pages/              # Page components
│   ├── services/           # Firebase services
│   ├── context/            # Auth context
│   ├── auth/               # Auth HOC
│   └── firebase.js         # Firebase config
├── DOCUMENTATION.md        # Complete documentation
├── LOGIN_CREDENTIALS.md    # Login credentials
└── README.md               # This file
```

## 🚀 Build & Deploy

```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## 📞 Support

For onboarding or technical support:
- Email: `support@menuscanner.com`
- Documentation: [DOCUMENTATION.md](DOCUMENTATION.md)

---

**Built with ❤️ by Anddhen Software Services**

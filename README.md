# MenuScanner - Restaurant Menu QR Code System

A React-based web application for displaying restaurant menus via QR code scanning. When customers scan a QR code at their table, they see the restaurant's menu with promotional banners and easy navigation.

## Features

- **Restaurant Logo Display**: Shows the restaurant's branding at the top
- **Promotional Slider**: Auto-rotating carousel for special offers and events
- **Menu Categories**: Clean, responsive grid of menu categories with icons
- **Fully Responsive**: Works seamlessly on mobile and desktop devices
- **Mock API**: Simulated backend API calls for easy development and testing

## Tech Stack

- **React 18**: Modern React with hooks
- **Material-UI (MUI)**: Component library for clean, professional UI
- **CSS-in-JS**: Emotion styling with MUI's sx prop for responsive design

## Project Structure

```
menuscanner/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── RestaurantLogo.jsx    # Restaurant branding component
│   │   ├── PromoSlider.jsx       # Promotional banners carousel
│   │   └── MenuCategories.jsx    # Menu categories grid
│   ├── pages/
│   │   └── LandingPage.jsx       # Main landing page
│   ├── services/
│   │   └── mockApi.js            # Mock API for data fetching
│   ├── App.js                     # Root component with theme
│   ├── index.js                   # App entry point
│   └── index.css                  # Global styles
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

The page will reload when you make changes.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Customization

### Updating Restaurant Data

Edit `src/services/mockApi.js` to customize:
- Restaurant name, logo, and description
- Promotional banners
- Menu categories

### Connecting to Real Backend

Replace the mock API functions in `src/services/mockApi.js` with actual API calls:

```javascript
export const fetchRestaurantInfo = async () => {
  const response = await fetch('https://your-api.com/restaurant');
  return response.json();
};

export const fetchBanners = async () => {
  const response = await fetch('https://your-api.com/banners');
  return response.json();
};

export const fetchMenuCategories = async () => {
  const response = await fetch('https://your-api.com/categories');
  return response.json();
};
```

### Styling and Theme

Customize the theme in `src/App.js`:
- Primary and secondary colors
- Typography
- Component styles
- Breakpoints

## Features to Add

Future enhancements could include:
- Category detail pages showing menu items
- Search functionality
- Filters (vegetarian, gluten-free, etc.)
- Multi-language support
- Shopping cart for online ordering
- Table number integration
- Real-time order status
- User reviews and ratings

## Responsive Design

The app is fully responsive with breakpoints:
- **xs** (0-600px): Mobile phones
- **sm** (600-900px): Tablets
- **md** (900-1200px): Small laptops
- **lg** (1200px+): Desktops

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is private and proprietary.

## Contributing

For internal development only.

# menuscanner

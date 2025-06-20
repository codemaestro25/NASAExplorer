# NASA Data Explorer

A beautiful, interactive web application that explores NASA's vast collection of space data through three main APIs:

1. **Earth Observatory Natural Event Tracker (EONET)** - Real-time natural events on Earth
2. **Near Earth Object (NEO) Tracker** - Asteroids and comets near Earth
3. **Mars Rover Photos** - Images from NASA's Mars rovers

## 🚀 Features

### ✅ Completed
- **Splash Screen**: Animated welcome screen with NASA branding
- **3D Earth Visualization**: Interactive 3D Earth using React Three Fiber
- **EONET Integration**: Real-time natural events displayed on the 3D Earth
- **Space Theme**: Beautiful dark theme with space aesthetics using Material UI
- **Responsive Design**: Works on desktop and mobile devices
- **TypeScript**: Full type safety throughout the application

### 🚧 In Progress
- NEO (Near Earth Object) visualization section
- Mars Rover exploration section
- Enhanced 3D Earth textures and effects

### 📋 Planned
- Zoom-based event filtering on 3D Earth
- Parallax scrolling effects
- Mars landscape backgrounds
- 3D rover models
- Advanced filtering and search capabilities

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **3D Graphics**: Three.js + React Three Fiber
- **UI Framework**: Material UI with custom space theme
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Styling**: Emotion (CSS-in-JS)

## 🎨 Design Features

- **Space Theme**: Dark blue/purple color palette
- **Animated Elements**: Smooth transitions and hover effects
- **3D Visualizations**: Interactive Earth and space objects
- **Responsive Layout**: Adapts to different screen sizes
- **Loading States**: Beautiful loading animations
- **Error Handling**: User-friendly error messages

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Get a NASA API key:
   - Visit [https://api.nasa.gov/](https://api.nasa.gov/)
   - Sign up for a free API key
   - Replace `DEMO_KEY` in `src/services/nasaApi.ts` with your actual API key

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 🔧 Configuration

### NASA API Key
Update the API key in `src/services/nasaApi.ts`:
```typescript
const API_KEY = 'YOUR_NASA_API_KEY_HERE';
```

### Available APIs
- **EONET**: `/EONET/api/v3/events` - Natural events tracking
- **NEO**: `/neo/rest/v1/feed` - Near Earth Objects
- **Mars Rover**: `/mars-photos/api/v1/rovers/{rover}/photos` - Mars rover images
- **EPIC**: `/EPIC/api/natural/date/{date}` - Earth images from space

## 📁 Project Structure

```
src/
├── components/
│   ├── common/
│   │   └── Layout.tsx          # Main layout component
│   ├── Earth3D/
│   │   └── Earth3D.tsx         # 3D Earth visualization
│   ├── NEOVisualizer/          # (Coming soon)
│   └── MarsRover/              # (Coming soon)
├── pages/
│   ├── SplashScreen.tsx        # Welcome screen
│   └── EarthPage.tsx           # Earth events page
├── services/
│   └── nasaApi.ts              # NASA API integration
├── styles/
│   └── theme.ts                # Material UI space theme
├── types/
│   └── nasa.ts                 # TypeScript interfaces
└── App.tsx                     # Main application component
```

## 🎯 Current Implementation

### Splash Screen
- Animated NASA logo with gradient effects
- Smooth transitions and loading animations
- Space-themed background with twinkling stars
- Call-to-action button to explore the universe

### 3D Earth
- Interactive 3D Earth sphere using Three.js
- Real-time natural events displayed as colored markers
- Hover effects with event details
- Smooth camera controls (zoom, pan, rotate)
- Color-coded events by category:
  - 🔥 Wildfires: Red
  - ⚡ Severe Storms: Orange
  - 🌋 Volcanoes: Red
  - 🌊 Other events: Blue

### Earth Events Page
- Integration with NASA's EONET API
- Real-time event data from the last 30 days
- Event cards with detailed information
- Modal dialogs for event details
- Responsive grid layout

## 🚀 Next Steps

1. **NEO Section**: Implement Near Earth Object visualization
2. **Mars Rover Section**: Add Mars exploration features
3. **Enhanced 3D Effects**: Improve Earth textures and lighting
4. **Performance Optimization**: Implement lazy loading and caching
5. **Advanced Features**: Add search, filtering, and data export

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [NASA APIs](https://api.nasa.gov/) for providing the data
- [Three.js](https://threejs.org/) for 3D graphics
- [Material UI](https://mui.com/) for the UI components
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) for React integration

---

**Note**: This is a work in progress. The application currently focuses on Earth events visualization, with NEO and Mars Rover sections planned for future development.

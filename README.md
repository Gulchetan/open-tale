# 📚 Open Tales

A modern React application for AI-powered story generation using Hugging Face models. The app features a beautiful glassmorphism UI and generates creative stories based on user prompts.

## 🏗️ Architecture

This project uses a **separated frontend and backend architecture** to avoid CORS issues:

- **Frontend**: React + Vite application (port 5174)
- **Backend**: Express.js proxy server (port 3001)
- **APIs**: Hugging Face Inference API (via proxy)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Hugging Face API token ([Get one here](https://huggingface.co/settings/tokens))

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd open-tales

# Install frontend dependencies
npm install

# Install backend dependencies
cd services
npm install
cd ..
```

### 2. Environment Setup

#### Frontend Environment (.env)
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your settings
VITE_API_BASE_URL=http://localhost:3001
VITE_NODE_ENV=development
```

#### Backend Environment (services/.env)
```bash
# Copy the example file
cp services/.env.example services/.env

# Edit services/.env with your Hugging Face token
HF_API_TOKEN=your_actual_hugging_face_token_here
PORT=3001
NODE_ENV=development
```

### 3. Run the Application

**You need to run both frontend and backend servers:**

#### Terminal 1 - Backend Server
```bash
cd services
npm start
# Server runs on http://localhost:3001
```

#### Terminal 2 - Frontend Development Server
```bash
npm run dev
# Frontend runs on http://localhost:5174
```

### 4. Access the Application

Open your browser and navigate to: **http://localhost:5174**

## 🛠️ Development

### Available Scripts

#### Frontend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

#### Backend
- `npm start` - Start the proxy server
- `npm run dev` - Start with auto-restart on file changes

### API Endpoints

#### Backend Proxy Server
- `GET /health` - Health check endpoint
- `POST /api/generate` - Generate stories via Hugging Face API

## 🔧 Troubleshooting

### CORS Errors
If you encounter CORS errors, ensure:
1. Backend server is running on port 3001
2. Frontend is configured to use `http://localhost:3001` as API base URL
3. Both servers are running simultaneously

### API Token Issues
1. Get a valid Hugging Face API token from [here](https://huggingface.co/settings/tokens)
2. Add it to `services/.env` as `HF_API_TOKEN=your_token`
3. Restart the backend server

### Port Conflicts
If ports 3001 or 5174 are in use:
1. Change `PORT` in `services/.env` for backend
2. Update `VITE_API_BASE_URL` in `.env` accordingly
3. Vite will automatically use next available port for frontend

## 🎨 Features

- ✨ **AI Story Generation**: Multiple Hugging Face models for creative writing
- 🎭 **Story Variations**: Generate multiple versions of the same prompt
- 🎨 **Themed Stories**: Pre-defined themes for inspiration
- 💎 **Glassmorphism UI**: Modern, beautiful interface with animations
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Fast Development**: Vite for instant hot reload
- 🛡️ **CORS-Free**: Proxy server eliminates browser CORS restrictions

## 🏗️ Project Structure

```
open-tales/
├── src/                    # Frontend React application
│   ├── components/         # React components
│   ├── services/          # API service functions
│   ├── App.jsx            # Main app component
│   └── main.jsx           # React entry point
├── services/              # Backend proxy server
│   ├── index.js           # Express server
│   ├── package.json       # Backend dependencies
│   ├── .env.example       # Backend environment template
│   └── .env               # Backend environment (create this)
├── public/                # Static assets
├── .env.example           # Frontend environment template
├── .env                   # Frontend environment (create this)
├── package.json           # Frontend dependencies
└── README.md              # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

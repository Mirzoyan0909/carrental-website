# 🚗 PremiumAuto - Premium Car Dealership Website

Modern website for selling and renting premium automobiles with stunning design and powerful features!

## ✨ Features

### 🎨 Design
- **Premium animations** - smooth appearances, gradients, hover effects
- **Modern UI** - golden accents, dark theme, professional look
- **Responsive** - works perfectly on all devices
- **Beautiful typography** - elegant fonts and styles
- **Real Telegram icon** - blue, recognizable Telegram branding

### 🔐 Admin Panel
- **Quick access** - golden floating button at bottom right
- **Default login**: `Autorent` / `Rentauto` (auto-created on startup)
- **Vehicle management** - add, edit, delete
- **Photo upload** - from PC or mobile phone camera
- **Contact management** - phone and Telegram

### 🚀 Functionality
- Vehicle catalog with filters (sale/rent/all)
- Detailed information for each car
- Contact forms (phone, Telegram)
- Responsive navigation menu
- Smooth scrolling to sections
- **Mobile-friendly photo upload** - works from phone camera!

## 📦 Technologies

### Frontend
- **React 18** - modern UI framework
- **Tailwind CSS** - utility styles
- **Lucide Icons** - beautiful icons + custom Telegram SVG
- **Axios** - HTTP client
- **React Router** - routing
- **Sonner** - notifications

### Backend
- **FastAPI** - modern Python framework
- **MongoDB** - NoSQL database
- **Motor** - async MongoDB driver
- **JWT** - authentication
- **Bcrypt** - password hashing
- **File upload** - multipart/form-data support

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- MongoDB

### Installation

1. **Clone repository**
```bash
git clone https://github.com/yourusername/premiumauto-website.git
cd premiumauto-website
```

2. **Backend**
```bash
cd backend
pip install -r requirements.txt
# Configure .env file
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

3. **Frontend**
```bash
cd frontend
yarn install
# Configure .env file
yarn start
```

4. **MongoDB**
```bash
# Start MongoDB locally or use MongoDB Atlas
mongod
```

## 🌐 Deployment

Detailed free hosting instructions in [DEPLOYMENT.md](DEPLOYMENT.md)

### Quick version:
- **Backend**: Render.com (free)
- **Frontend**: Netlify (free)
- **Database**: MongoDB Atlas (free)

## 🔑 Admin Access

### Login to admin panel:
- **URL**: `/admin`
- **Username**: `Autorent`
- **Password**: `Rentauto`

Or just click the golden shield icon at the bottom right! 🎯

## 📁 Project Structure

```
premiumauto-website/
├── backend/
│   ├── server.py          # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   ├── .env              # Environment variables
│   └── uploads/          # Uploaded photos
├── frontend/
│   ├── src/
│   │   ├── App.js        # Main component (English)
│   │   ├── App.css       # Styles & animations
│   │   └── index.js      # Entry point
│   ├── public/           # Static files
│   ├── package.json      # Node dependencies
│   └── .env             # Environment variables
├── render.yaml           # Render config
├── netlify.toml          # Netlify config
├── DEPLOYMENT.md         # Deployment guide
├── GITHUB_SAVE.md        # GitHub save instructions
└── README.md            # This file
```

## 🎯 API Endpoints

### Public
- `GET /api/` - API information
- `GET /api/cars` - List vehicles
- `GET /api/cars/{id}` - Vehicle details
- `GET /api/contacts` - Contact information
- `POST /api/auth/login` - Admin login

### Protected (require token)
- `POST /api/cars` - Add vehicle
- `PUT /api/cars/{id}` - Update vehicle
- `DELETE /api/cars/{id}` - Delete vehicle
- `PUT /api/contacts` - Update contacts
- `POST /api/upload` - Upload photo (works from mobile!)
- `POST /api/seed` - Seed test data

## 🎨 Customization

### Colors
Main colors in `App.css`:
- Gold: `#D4AF37`
- Dark: `#050505`
- Light: `#F9FAFB`
- Telegram Blue: `#0088cc`

### Fonts
Used fonts:
- **Headings**: Libre Baskerville (serif)
- **Body**: Manrope (sans-serif)

### Animations
All animations defined in `App.css`:
- `fadeInUp` - appear from bottom
- `fadeIn` - smooth appearance
- `glow` - glowing effect
- `gradientShift` - gradient animation

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check MongoDB
sudo systemctl status mongodb

# Check port 8001
lsof -i :8001

# Check logs
tail -f /var/log/supervisor/backend.err.log
```

### Frontend won't compile
```bash
# Clear cache
rm -rf node_modules package-lock.json
yarn install

# Check environment variables
cat frontend/.env
```

### Photo upload not working
```bash
# Check uploads folder
ls -la backend/uploads

# Check permissions
chmod 755 backend/uploads
```

## 📱 Mobile Features

✅ **Photo upload from phone camera** - `capture="environment"` attribute
✅ **Responsive design** - works on all screen sizes
✅ **Touch-friendly** - optimized for mobile interactions
✅ **Fast loading** - optimized images and code

## 🎊 What Makes This Special

### Premium Design
- 🏆 Gold gradient animations
- 🎯 Modern typography
- 📱 100% responsive
- 🖼️ Beautiful shadows and gradients
- 💎 Professional appearance

### Smart Filters
- **All** - shows all vehicles (sale + rent)
- **For Sale** - shows only vehicles available for purchase
- **For Rent** - shows only vehicles available for rent
- Real-time filtering

### Real Telegram Integration
- 🔵 Authentic Telegram blue color (#0088cc)
- 📱 Custom SVG Telegram icon
- 🔗 Direct link to Telegram chat

## 📝 License

MIT License - use as you wish!

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first.

## 👨‍💻 Author

Created with ❤️ and coffee ☕

Perfect for the USA market! 🇺🇸

---

**Enjoy using PremiumAuto! 🚀**

If you have questions - open an issue on GitHub!

**Current Preview**: https://dreamy-nightingale-2.preview.emergentagent.com

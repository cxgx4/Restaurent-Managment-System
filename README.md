# Restaurant Management System

A full-stack web application for comprehensive restaurant management, featuring a customer-facing food ordering interface and a robust backend system for inventory tracking, order processing, and sales analytics.

## 🚀 Features

### Customer Interface
- **Interactive Food Ordering**: Browse menu items and place orders seamlessly
- **Real-time Order Updates**: Track order status in real-time
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Backend Management
- **Inventory Tracking**: Real-time monitoring of ingredient stock levels
- **Order Processing**: Automated order management workflow
- **Sales Analytics**: Comprehensive insights into restaurant performance
- **Data Persistence**: Reliable PostgreSQL database via Supabase

## 🛠️ Tech Stack

### Frontend
- **React**: Modern UI framework for building interactive interfaces
- **JavaScript**: Core programming language
- **CSS**: Styling and responsive design

### Backend
- **FastAPI**: High-performance Python web framework
- **Python**: Backend logic and API development

### Database
- **Supabase (PostgreSQL)**: Cloud-hosted database with real-time capabilities

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- npm or yarn
- pip (Python package manager)

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/cxgx4/Restaurent-Managment-System.git
cd Restaurent-Managment-System
```

### 2. Backend Setup

Navigate to the API directory and install dependencies:
```bash
cd api
pip install -r ../requirements.txt
```

Create a `.env` file in the `api` directory with your Supabase credentials:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Start the Backend Server
```bash
cd api
uvicorn main:app --reload
```
The API will be available at `http://localhost:8000`

### Start the Frontend Development Server
```bash
cd frontend
npm start
```
The application will open at `http://localhost:3000`

## 🔗 API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation powered by Swagger UI.

## 🗃️ Database Schema

The application uses Supabase (PostgreSQL) with the following main tables:
- **menu_items**: Restaurant menu with prices and descriptions
- **orders**: Customer orders and their status
- **inventory**: Ingredient stock levels
- **sales**: Transaction records for analytics

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**cxgx4**
- GitHub: [@cxgx4](https://github.com/cxgx4)


⭐ If you find this project useful, please consider giving it a star!

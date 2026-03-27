# 🌾 Flour Management App

A comprehensive full-stack management system designed for flour mills and shops. This application streamlines inventory tracking, sales processing, reservation management, and provides insightful analytics for shop owners.

---

## 🚀 Features

### For Shop Owners
- **📦 Inventory Management**: Track stock levels of different flour types (Wheat, Rice, etc.) in real-time.
- **💰 Sales Tracking**: Record daily sales, manage pricing, and handle customer payments.
- **📅 Reservation System**: Manage pre-orders and reservations from customers.
- **📊 Analytics Dashboard**: Visualize sales trends, popular products, and revenue growth.
- **💬 Feedback Management**: Systematically review and respond to customer feedback.

### For Customers
- **🏠 Personal Dashboard**: View order history, active reservations, and loyalty status.
- **🛍️ Easy Ordering**: Reserve flour products online for later pickup.
- **💳 Secure Payments**: Integrated payment processing for seamless transactions.
- **📝 Feedback System**: Share experiences and suggestions directly with the shop owner.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Bootstrap (React-Bootstrap)
- **Icons**: Lucide React
- **Charts**: Chart.js / React-Chartjs-2
- **State/Routing**: React Router DOM, Axios

### Backend
- **Framework**: Django & Django REST Framework (DRF)
- **Authentication**: JWT (SimpleJWT)
- **CORS**: Django CORS Headers
- **Database**: MySQL (PyMySQL)

---

## 📂 Project Structure

```text
.
├── backend/                # Django REST API
│   ├── apps/               # Business logic (users, inventory, sales, etc.)
│   ├── config/             # Django project settings
│   └── manage.py           # Django CLI
├── frontend/               # React Vite Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Dashboard and feature pages
│   │   └── services/       # API integration
│   └── package.json        # Node dependencies
└── README.md               # You are here!
```

---

## ⚙️ Getting Started

### Prerequisites
- Python 3.10+
- Node.js & npm/yarn
- MySQL Server

### Backend Setup
1. **Navigate to backend**: `cd backend`
2. **Setup Virtual Environment**: `python -m venv venv`
3. **Activate Environment**: `source venv/bin/activate` (Use `venv\Scripts\activate` on Windows)
4. **Install Dependencies**: `pip install -r requirements.txt`
5. **Database Configuration**: Ensure MySQL is running and update `backend/config/settings.py` with your credentials.
6. **Migrations**: `python manage.py migrate`
7. **Run Server**: `python manage.py runServer`

### Frontend Setup
1. **Navigate to frontend**: `cd frontend`
2. **Install Dependencies**: `npm install`
3. **Run Dev Server**: `npm run dev`

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

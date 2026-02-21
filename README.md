# 🎙️ VoiceHU - Academic Feedback & Complaint Platform

VoiceHU is a complete, production-ready Academic Feedback & Complaint Management System specifically designed for Haramaya University's College of Computing and Informatics. 

## 🚀 Quick Setup Instructions

Follow these exact steps to get the platform running on your machine.

### 1. Prerequisites
- **Node.js**: v16+ installed
- **MongoDB**: MongoDB Community Server installed and running on `localhost:27017`
- **npm**: (Included with Node.js)

### 2. Installations
Open your terminal in the project root directory and run:
```bash
# Set up server and client
npm run install-all
```

### 3. Initialize Database (Crucial)
Seed the database with default categories and demo accounts:
```bash
npm run seed
```

### 4. Run the Application
Start both the backend and frontend simultaneously:
```bash
npm run dev
```

The application will be available at:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

---

## 🔑 Demo Credentials

Once the database is seeded, you can log in with these accounts:

| Role | Email | Password |
|------|-------|----------|
| **System Admin** | `admin@haramaya.edu.et` | `Admin@12345` |
| **Faculty Staff** | `staff@haramaya.edu.et` | `Staff@12345` |
| **Student** | `student@haramaya.edu.et` | `Student@12345` |

---

## ✨ Features Checklist
- [x] **Full-Stack Integration**: Complete React frontend + Express backend communication.
- [x] **Role-Based Access**: Specialized views for Students, Staff, and Admins.
- [x] **Ticket Management**: Auto-generation of Ticket IDs (e.g., VHU-2412-0001).
- [x] **Interactive Dashboard**: Real-time stats and data visualization.
- [x] **File Uploads**: Support for PDF/Image attachments for evidence.
- [x] **Real-time Notifications**: In-app alerts for ticket updates.
- [x] **Threaded Chat**: Built-in messaging for complaint resolution.
- [x] **Anonymous Mode**: Students can submit sensitive issues anonymously.
- [x] **Analytics**: Admin data on resolution rates and category trends.
- [x] **Premium UI**: Modern Tailwind CSS design with glassmorphism and animations.

## 📁 Project Structure

```bash
/client         # React + Tailwind Frontend
/server         # Node.js + Express + MongoDB Backend
  /config       # Database configuration
  /controllers  # Request logic
  /models       # MongoDB schemas
  /routes       # API endpoints
  /middleware   # Auth & Upload logic
  /utils        # Seed scripts
/uploads        # Storage for complaint attachments
```

---
Built for **Haramaya University**.

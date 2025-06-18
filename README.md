# 🍽️ Full-Featured Food Delivery Web App – Node.js, Express, MongoDB, EJS

This is a fully functioning **food delivery website** built using **Node.js**, **Express**, **MongoDB**, and **EJS templates** (not React). The project simulates a real-world food ordering system, including cart management, admin panel, live order tracking, and rider assignment. Designed to enhance both the **user** and **admin** experience.

---

## 🚀 Features

### 🛒 Session-Based Cart System
- Customers can add food items to their cart.
- The cart is stored in the session so users can modify it freely before checkout.

### 📊 Admin Panel with Real-Time Order Updates
- Admins can view new incoming orders in **real-time**.
- The panel provides a clear order status overview for restaurant staff.

### ⚡ Real-Time Updates with WebSockets
- Integrated **socket.io** for real-time communication.
- Both users and admins see live updates as the order status changes (placed → preparing → out for delivery → delivered).

### 🚚 Order Assignment to Riders
- Admins can assign orders to riders manually.
- Tracks rider assignment and manages delivery logistics.

### 🔗 Order Confirmation Links
- Customers receive a confirmation link to track their order.
- Ensures transparency and real-time tracking for the end user.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js  
- **Frontend:** EJS Templates (HTML/CSS/Bootstrap)  
- **Database:** MongoDB (Mongoose ODM)  
- **Real-Time Communication:** Socket.IO  
- **Authentication:** Session  

---



## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Slayer9966/FoodDeliveryApp.git
cd FoodDeliveryApp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Copy the `.env` example and fill in your MongoDB URI and session secret:

```bash
cp .env.example .env
```

Inside `.env`:

```dotenv
PORT=3000
MONGODB_URI=mongodb://localhost:27017/fooddelivery
SESSION_SECRET=your_secret_key
```

### 4. Run the Application

```bash
npm start
```



---

## 📌 Notes

- Real-time functionality requires WebSockets to be running.
- Admin credentials can be set manually in the database.
- Rider assignment currently uses a manual method (can be extended to automated assignment).
- Session-based carts reset if the server restarts without session storage setup.

---

## 📜 License

Licensed under the **MIT License** — use, modify, and distribute freely.

---

## 🙋‍♂️ Author

**Syed Muhammad Faizan Ali**  
📍 Islamabad, Pakistan  
📧 faizandev666@gmail.com  
🔗 [GitHub](https://github.com/Slayer9966) | [LinkedIn](https://www.linkedin.com/in/faizan-ali-7b4275297/)

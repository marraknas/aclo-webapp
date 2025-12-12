# 🛒 Aclo Kids WebApp – Developer Guide

An **E-commerce website for Aclo Kids** built with the **MERN stack** (MongoDB, Express, ReactTS, Node.js) and styled using **TailwindCSS**.

---

## 📂 Media & Design Resources

- [Product Media Files](https://drive.google.com/drive/folders/1SKppfBxIqeFtCQiOBIFwNS9com7imV_C)  
- [Additional Media Files](https://drive.google.com/drive/folders/1u_drSFTyd-MdUcTf0afZx_hcs3mwmQIZ)  
- [Logos](https://drive.google.com/drive/folders/105wbnh_jKl8X2LCaxE1s6me20ELkgiL3)  
- [Logos (Transparent BG)](https://drive.google.com/drive/folders/109eZM1VNZ92N6tEZLiyKQmWISz2SndFC)  
- [Promotional Slides](https://drive.google.com/drive/folders/15lcxXwzA0nVio-R_7abX4SUCfhr_7Lr2)  

### Current Platforms
- 🌐 Static Website: [aclokids.com](https://aclokids.com/)  
- 🛍 Tokopedia Store: [Aclo Kids Tokopedia](https://www.tokopedia.com/aclokids)  
- 📺 Tutorial Video: [YouTube](https://www.youtube.com/watch?v=hpgh2BTtac8)  
- 🎨 Figma Design (by Celine): [Figma Link](https://www.figma.com/design/wT9UGae3tDgkw4Ymoeaa2h/Savourly?t=XLFq4LwYPP0BIBgZ-0)  

---

## 🏗 Project Structure

### Frontend (React + TypeScript + TailwindCSS)

**Components** (Reusable UI elements):
- `admin` → Dashboard, order management, user management  
- `cart` → Shopping cart, checkout, payment button  
- `common` → Header, footer, navbar  
- `layout` → User layout, hero layout, cart drawer  
- `products` → Product details, product price  

**Pages** (Route-based components):
- `home`  
- `admin home`  
- `login`  
- `collection`  

**Notes:**
- API calls handled via **Axios**  
- State management via **Redux slices**  

---

### Backend (Node.js + Express + MongoDB)

**Packages Used:**
- `express` → API framework  
- `mongoose` → MongoDB ODM (schemas & queries)  
- `dotenv` → Environment variable loader  
- `jsonwebtoken` → User authentication & authorization  
- `bcryptjs` → Password hashing  
- `cors` → Handle cross-domain requests  
- `nodemon` → Auto-restart dev server  
- `multer` → File uploads  
- `cloudinary` → Image hosting API  
- `streamifier` → Convert data chunks into streams  

**Cart Behavior:**
- Guest users can create carts but **cannot checkout**.  
- On login, guest cart merges into **User Cart**.  



## ⚙️ Environment Variables
### Frontend (`frontend/.env`)
```Env
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
VITE_BACKEND_URL=http://localhost:9000
```
### Backend (`backend/.env`)
```Env
PORT=9000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📖 Documentation References
- [Biteship API Docs](https://biteship.com/en/docs/intro) → Shipping cost calculation
- [React Icons](https://react-icons.github.io/react-icons/search/#q=) → Icons library
- [Paypal Developer Docs](https://developer.paypal.com/) → Reference for checkout flow
- [Cloudinary Docs](https://cloudinary.com/documentation/image_upload_api_reference) → Image uploads

## 🛠 Recommended VS Code Extensions
- Tailwind CSS Intellisense
- Prettier (code formatter)
- Path Intellisense
- ES7+ React/Redux/React-Native snippets
### Formatting Setup (`settings.json`)
```Json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

## 🔧 Setup Instructions

1. **Node Packages**
- Run `npm install` on both `frontend` and `backend` folders

2. **MongoDB Atlas**
- Create your own cluster for development.
- Add your MONGO_URI to `.env`.
- Seed mock data:
```bash
npm run seed
```
- Peter will share access to the actual dev server DB.

3. **Cloudinary**
- Create an account and configure API keys in `.env`.
- Peter will share the Cloudinary folder for you guys to access the images

4. **Paypal Developer**
- Temporary setup for checkout flow testing.


## 🚀 Running the Project

### Frontend
```bash
cd frontend
npm run dev
```

### Backend
```bash
cd backend
npm run dev
```

## Postman Collection
A Postman collection will be shared for API testing (currently not fully documented).

## ✅ Development Standards
- Always use **Prettier** with `formatOnSave`.
- Do your best to maintain consistent code style across frontend & backend.
- We'll follow the workflow for CS2103T for the most part yea :) Do make branches when you want to make an enhancement/fix, and name the branches `feature/feature1`, `fix/fix1`, and so on for better organization + make pull requests for every change.

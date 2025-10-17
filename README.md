# 💼✨ Track Your Offer

A backend-focused tool to track job applications, manage statuses, upload CVs, and send reminders — designed to demonstrate real-world system design, async processing, and robust API development.

---

## 🔗 Project Demo / URLs
- **Backend API Base URL:** [https://apptracker-production.up.railway.app](https://apptracker-production.up.railway.app)
- **Swagger UI:** [http://apptracker-production.up.railway.app/api-docs](http://apptracker-production.up.railway.app/api-docs)
- **Frontend (deployed):** [https://track-your-offer-iota.vercel.app/](https://track-your-offer-iota.vercel.app/)
 

---

## 🛠️ Tech Stack
- **Backend:** Node.js + Express (TypeScript)  
- **Database:** MongoDB (Mongoose)  
- **Authentication:** JWT  
- **File Uploads:** Cloudinary / local directory  
- **Background Jobs:** Bull + Redis  
- **Testing:** Jest + Supertest  
- **CI/CD:** GitHub Actions  
- **Deployment:** Railway (backend), Vercel (frontend)  

---

## ✨ Key Features
- User authentication & authorization (JWT)  
- CRUD for job applications  
- Tag management & notes  
- Dashboard stats & nudges  
- File uploads (CVs)  
- Background jobs for email reminders  
- Sorting, filtering, and search  
- Swagger API documentation  
- Rate limiting & error handling  

> ⚡ Full API endpoints are available via [Swagger UI](http://apptracker-production.up.railway.app/api-docs).

---

## 🏗️ System Design Highlights
- **Database Schema:** Users, Jobs, Tags, and Activity Logs; textually documented relationships for clarity:  
  - One user → many jobs  
  - One job → multiple tags  
  - Activity logs track changes for auditing  
- **Async Processing:** Background email reminders using Bull + Redis queues  
- **Error Handling & Rate Limiting:** Centralized middleware ensures production-ready behavior  
- **CI/CD & Deployment:** GitHub Actions runs tests, builds, and deploys to multiple environments  
- **API Documentation:** Swagger ensures clear handoff to frontend or external developers  

---

## ⚙️ Setup / Installation
1. Clone repository:  
   ```bash
   git clone https://github.com/maeganliew/TrackYourOffer.git track-your-offer
   cd track-your-offer
   ```
   
2. Configure environment variables: .env (backend URL, JWT secret, Cloudinary credentials, Redis URL, DB URL)

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Run backend:
   ```bash
   npm run dev
   ```
   
5. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```
   
6. Run frontend:
   ```bash
   npm run dev
   ```
   
## 🧪 Testing
### Backend Tests
From the `backend` folder:

```bash
npm run test
# or to detect open handles
npx jest --detectOpenHandles
```

### Frontend Tests
From the `frontend` folder:

```bash
npx jest
```

### Notes
- Includes **unit + integration tests**  
- Mocks file uploads and Redis for testing  
- Coverage reports available if configured with Jest

## 🚀 Future Improvements

- Role-based access control (admin vs user)
- Refresh tokens for JWT
- Analytics dashboard (aggregated job stats)
- Job scraping / external API integrations

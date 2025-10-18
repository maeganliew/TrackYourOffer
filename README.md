# 💼✨ Track Your Offer
[![CI Build Status](https://img.shields.io/github/actions/workflow/status/maeganliew/TrackYourOffer/ci.yml?branch=main)](https://github.com/maeganliew/TrackYourOffer/actions)
[![Frontend Live](https://img.shields.io/badge/frontend-live-brightgreen)](https://track-your-offer-iota.vercel.app/)
[![Coverage](https://img.shields.io/codecov/c/gh/maeganliew/TrackYourOffer?branch=main)](https://codecov.io/gh/maeganliew/TrackYourOffer)

**Track Your Offer** is a backend-focused job application tracker designed to showcase real-world system design, asynchronous processing, and robust API development.

The platform allows users to manage job applications, upload CVs, track statuses, set reminders, and visualize dashboard insights — all built with scalability, maintainability, and production-readiness in mind.

## Key Highlights

- **Full-stack API design:** Clean, well-documented endpoints with Swagger integration
- **Asynchronous workflows:** Background email reminders using Bull + Redis
- **Secure authentication & authorization:** JWT-based access control with room for role-based extensions
- **Production-ready practices:** CI/CD, testing, error handling, rate limiting, and deployment to Railway & Vercel
---

## 🔗 Project Demo / URLs
- **Backend API Base URL:** [https://track-your-offer.up.railway.app](https://track-your-offer.up.railway.app)
- **Swagger UI:** [http://track-your-offer.up.railway.app/api-docs](http://track-your-offer.up.railway.app/api-docs)
- **Frontend (deployed):** [https://track-your-offer-iota.vercel.app/](https://track-your-offer-iota.vercel.app/)
 

---

## 🛠️ Tech Stack
- **Backend:** Node.js + Express (TypeScript)  
- **Database:** MongoDB (Mongoose)  
- **Authentication:** JWT  
- **File Uploads:** Cloudinary
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

> ⚡ Full API endpoints are available via [Swagger UI](http://track-your-offer.up.railway.app/api-docs).

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
npm run test       # run all backend tests and generate coverage
npx jest --detectOpenHandles   # debug open handles
```

### Frontend Tests
From the `frontend` folder:

```bash
npm run test      # run all frontend tests and generate coverage
```

### Notes
- Includes **unit + integration tests**  
- Mocks file uploads and Redis for testing  
- Coverage reports available if configured with Jest

## 🚀 Future Improvements

- Role-based access control: Admin vs. user views, planned for production-ready security.
- Refresh tokens: Improve JWT security and session management.
- Analytics dashboard: Aggregate job stats, trends, and reminders.
- Scalability & performance considerations:
  - With 10k+ users, I would implement database sharding and query caching for dashboard stats.
  - Introduce rate limiting and horizontal scaling for API servers to handle high concurrency.
  - Move background jobs to microservices if queue volume grows.

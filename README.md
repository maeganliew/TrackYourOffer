# 🏗️ Track Your Offer
[![Build Status](https://img.shields.io/github/actions/workflow/status/maeganliew/TrackYourOffer/cd.yml?branch=main)](https://github.com/maeganliew/TrackYourOffer/actions)  
[![Coverage](https://img.shields.io/codecov/c/gh/maeganliew/TrackYourOffer?branch=main)](https://codecov.io/gh/maeganliew/TrackYourOffer)  
[![Frontend Live](https://img.shields.io/badge/frontend-live-brightgreen)](http://<frontend-url>)

---

### One-liner
A backend-focused tool to track job applications, manage statuses, upload CVs, and send reminders — designed to demonstrate real-world system design, async processing, and robust API development.

---

## 🔗 Project Demo / URLs
- **Backend API Base URL:** [https://apptracker-production.up.railway.app](https://apptracker-production.up.railway.app)
- **Swagger UI:** [http://apptracker-production.up.railway.app/api-docs](http://apptracker-production.up.railway.app/api-docs)
- **Frontend (deployed):** [https://apptracker-production.up.railway.app](https://apptracker-production.up.railway.app)
 

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


# System Design & Trade-offs

This section explains the design decisions and trade-offs made while building **Track Your Offer**, a backend-focused job application tracker.

---

## 1. Database Design (MongoDB + Mongoose)

- **Why MongoDB**: Flexible schema allows rapid iteration with evolving features like tags, notes, and job statuses.
- **Schema Overview**:
  - `User` → owns many `Jobs` and `Tags`
  - `Job` → contains file info (CV), status, and timestamps
  - `JobTag` → links `Jobs` to `Tags` (many-to-many relationship)
  - `Tag` → user-defined labels with colors
- **Trade-offs**: MongoDB is less strict than SQL for relational constraints, but simplifies early development and scaling for flexible data models.

---

## 2. Async Processing (Bull + Redis)

- **Purpose**: Handles background jobs for sending email reminders without blocking API responses.
- **Why Bull + Redis**: Persistent queues, retry logic, and concurrency control for robust async processing.
- **Trade-offs**: Adds infrastructure complexity, but decouples time-consuming tasks from the main request flow.

---

## 3. Authentication (JWT)

- **Purpose**: Stateless authentication for API endpoints.
- **Why JWT**: Scales easily without server-side session storage; supports role-based access in future.
- **Trade-offs**: Refresh tokens not implemented yet; potential for token expiration issues handled in future improvements.

---

## 4. File Uploads (Cloudinary)

- **Purpose**: Store user CVs efficiently without burdening the backend server.
- **Why Cloudinary**: Simplifies deployment and CDN delivery.
- **Trade-offs**: Introduces external dependency, but avoids scaling issues for media storage.

---

## 5. CI/CD (GitHub Actions)

- **Purpose**: Automates testing and deployment for both backend and frontend.
- **Why CI/CD**: Ensures code quality and reduces deployment errors.
- **Trade-offs**: Initial setup requires time, but provides production-level reliability and repeatable builds.

# Easy SonarQube + Express.ts + Jenkins + Docker Agents Demo

A quick-start project demonstrating CI/CD with SonarQube code quality analysis for a TypeScript Express.js application, using Jenkins with Docker agents and GitHub repository polling.

## Project Structure

```
lpu/
├── qjs/                  # Your Express.ts application
│   ├── src/
│   │   └── index.ts     # Simple Express server with routes
│   ├── package.json
│   ├── tsconfig.json
│   ├── Jenkinsfile      # Declarative pipeline for Jenkins
│   ├── compose.yml      # Spins up SonarQube + Jenkins
│   └── ...
└── README.md
```

## Quick Start (Local Setup)

### 1. Start Services with Docker Compose

```bash
cd lpu/qjs
docker compose up -d
```

- **SonarQube**: http://localhost:9000 (login: admin / admin - change password on first login)
- **Jenkins**: http://localhost:8080 (initial admin password in logs: `docker logs jenkins`)

### 2. Configure Jenkins

1. Open Jenkins at http://localhost:8080
2. Install suggested plugins (includes SonarQube plugin)
3. Create a new **Pipeline** job:
   - Name: `sonar-express-demo`
   - Pipeline script from SCM:
     - SCM: **Git**
     - Repository URL: `https://github.com/YOUR_USERNAME/sonar-express-jenkins.git` (or your fork)
     - Branch: `main` (or `master`)
   - **Poll SCM**: Check the box and set schedule to `H/5 * * * *` (every 5 minutes) for GitHub polling
4. Configure SonarQube in Jenkins:
   - Manage Jenkins → Configure System → SonarQube servers
   - Add server:
     - Name: `SonarQube`
     - Server URL: `http://sonarqube:9000`
     - SonarQube authentication token: Generate in SonarQube (Administration → Security → Users → Tokens) and add as Jenkins **Secret text** credential named `SONAR_TOKEN`

### 3. Create SonarQube Project (Optional but Recommended)

In SonarQube UI (http://localhost:9000):

- Create new project → **Manually**
- Project key: `sonar-express-ts-demo`
- Project name: `Sonar Express TS Demo`
- Main branch: `main`

### 4. Push to GitHub (for Polling to Work)

1. Create a new GitHub repo (public or private)
2. Initialize and push this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: SonarQube Express TS demo"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/sonar-express-jenkins.git
   git push -u origin main
   ```

### 5. Trigger Build

- Jenkins will poll every 5 minutes, or manually trigger the job.
- Or push a change to GitHub to trigger (if webhook set, but polling is used here for simplicity).

## How It Works

- **Docker Agent**: Jenkins pipeline uses `node:20-alpine` Docker image as the build agent (no need for permanent agents).
- **GitHub Polling**: Jenkins checks the repo every 5 minutes for changes.
- **Pipeline Stages**:
  1. Checkout code
  2. `npm install`
  3. `npm run build` (TypeScript compilation)
  4. **SonarQube Analysis** (using `sonar-scanner`)
  5. **Quality Gate** check (fails pipeline if quality gate fails)
  6. Tests (placeholder)
- **SonarQube**: Analyzes code for bugs, vulnerabilities, code smells, duplication, and security hotspots. Supports TypeScript out of the box.

## Customization

- **Add more code**: Edit `qjs/src/index.ts` — Sonar will detect issues like unused variables, complexity, etc.
- **Quality Gate**: Customize in SonarQube (Quality Gates → Create)
- **Advanced**: Add Docker build stage, deploy to Kubernetes, etc.
- **Real GitHub Webhook** (optional, instead of polling): In GitHub repo → Settings → Webhooks → Add webhook to Jenkins (requires public Jenkins URL).

## Troubleshooting

- **SonarQube token error**: Ensure `SONAR_TOKEN` credential exists and has `scan` permissions.
- **Quality Gate timeout**: Increase timeout in Jenkinsfile or check SonarQube analysis log.
- **Docker agent issues**: Ensure Docker socket is mounted (already in docker-compose).
- **First run**: SonarQube takes ~1-2 min to start. Jenkins initial setup ~5 min.

## Next Steps

- Add unit tests with Jest + coverage for better Sonar reports.
- Integrate with GitHub Actions as alternative.
- Add OWASP dependency check or SAST tools.

Enjoy your clean, high-quality code! 🚀

For issues or improvements, open a PR or contact the maintainer.

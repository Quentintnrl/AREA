Here's the updated README with the Gitmoji commit convention:

# 🚀 Action-Reaction: Automation Platform
## 📋 Project Overview
Action-Reaction is an automation platform inspired by IFTTT and Zapier, allowing users to create custom integrations between various services through Actions and Reactions.
### 🎯 Key Features
- User registration and authentication
- Service integration via OAuth2
- Create custom Action-Reaction (AREA) workflows
- Cross-platform support (Web and Mobile)
- Trigger-based automation
## 🛠 Technology Stack
### Backend
- Language: Node.js
- Framework: Express
- Database: MySQL
- Authentication: OAuth2, JWT
### Frontend
- Web: React
- Mobile: React Native
## 🚦 Project Setup
### Prerequisites
- Docker
- Docker Compose
- Node.js (v16+)
- npm or yarn
### Installation
1. Clone the repository
```bash
git clone https://github.com/your-org/action-reaction.git
cd action-reaction
```
2. Build and Run with Docker
```bash
docker-compose build
docker-compose up
```
## 🌐 Application Access
- Web Client: `http://localhost:8081`
- Application Server: `http://localhost:8080`
- Mobile Client APK: `http://localhost:8081/client.apk`
## 📡 API Endpoints
Detailed API documentation available in `docs/API.md`
## 🤝 Contributing
### Development Workflow
1. **Never push directly to `main`**
2. Create feature branches
3. Submit Pull Requests
4. Mandatory code reviews
5. CI/CD checks must pass

### Commit Message Convention
```
<gitmoji> <subject>
Gitmojis:
- 🚀 Initial commit
- ✨ New feature
- 🐛 Bug fix
- 📝 Documentation changes
- 💄 UI/Style changes
- ♻️ Refactoring
- ✅ Tests
- 🔧 Configuration changes
- 🚸 Improving user experience
- 🌐 Internationalization
- 💡 Code comments/cleanup
```

### Example Commits
```bash
git commit -m "✨ Implement OAuth2 login flow"
git commit -m "🐛 Fix authentication token expiration issue"
git commit -m "📝 Update API documentation"
```

## 👥 Team Organization
### Roles
- Backend Developers: @QuentinTennerel, @RegineEmmanuelleEmagniDeugo
- Frontend Developers: @zia, @iKroZz44
- DevOps & Documentation: All team members
### Communication Channels
- Project Management: Notion
- Team Communication: Microsoft Teams
- Code Collaboration: GitHub
## 🎯 Project Goals
- Minimum 5 services
- 12+ total Action/Reaction components
- Cross-platform accessibility
- Robust and scalable architecture
## 📚 Documentation
- [API Documentation](docs/API.md)
- [Technical Guide](docs/TECHNICAL.md)
- [User Manual](docs/USER_MANUAL.md)
- [Comparative Guide](docs/COMP.md)
## 🤔 Support
For questions or issues, please open a GitHub issue or contact us via.

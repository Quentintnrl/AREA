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
- Mobile Client: get the apk with `http://localhost:8081/client.apk`
## 📡 API Endpoints
Detailed API documentation available [API Documentation](http://localhost:8080/api-docs/) -> when server is running
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
git commit -m "✨ implement OAuth2 login flow"
git commit -m "🐛 fix authentication token expiration issue"
git commit -m "📝 update API documentation"
```

## 👥 Team Organization
### Roles
- Backend Developers: [@Quentintnrl](https://github.com/Quentintnrl), [@eregine](https://github.com/eregine)
- Frontend Developers: [@ziaa15](https://github.com/ziaa15), [@lxnbt](https://github.com/lxnbt)
- DevOps : [@Quentintnrl](https://github.com/Quentintnrl)
- Documentation: All team members
### Communication Channels
- Project Management: [Notion Organisation](https://lowly-desert-eb1.notion.site/AREA-1433927a231c800a8ed0e917efa11492?pvs=4)
- Team Communication: Microsoft Teams
- Code Collaboration: GitHub
## 🎯 Project Goals
- Minimum 5 services
- 12+ total Action/Reaction components
- Cross-platform accessibility
- Robust and scalable architecture
## 📚 Documentation
- [API Documentation](http://localhost:8080/api-docs/) -> when server is running
- [Technical Guide](https://www.notion.so/Developer-Documentation-180962a4e5bb8072ae41f45e2877c70f)
- [User Manual](https://www.notion.so/User-Documentation-180962a4e5bb803b8245e75ff4d9d722)
- [Comparative Guide](https://www.notion.so/Comparative-Documentation-180962a4e5bb8084b5bffd50dee9d0cf?pvs=23)
## 🤔 Support
For questions or issues, please open a GitHub issue.

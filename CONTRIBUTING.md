# Contributing to Coffybara ☕

We're thrilled that you're interested in contributing to Coffybara! This document will help you get started and understand our development process.

## 🎯 Ways to Contribute

- 🐞 **Bug Reports**: Found a bug? Let us know!
- ✨ **Feature Requests**: Have an idea? We'd love to hear it!
- 📝 **Documentation**: Help improve our docs
- 🔧 **Code Contributions**: Submit bug fixes or new features
- 🧪 **Testing**: Help us test new features and find edge cases
- 🎨 **Design**: Improve UI/UX and visual design

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed
- **Google Cloud CLI** (`gcloud`) installed and configured
- **Git** for version control
- A **Google Cloud Project** with necessary APIs enabled
- Access to a **GKE cluster** (for testing)

### Development Setup

1. **Fork the repository**

   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/coffybara.git
   cd coffybara
   ```

2. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/oslabs-beta/coffybara.git
   ```

3. **Set up Google Cloud Secrets** (for testing)

   ```bash
   # Follow the setup instructions in README.md
   gcloud services enable secretmanager.googleapis.com
   # Create necessary secrets...
   ```

4. **Install dependencies and start development**

   ```bash
   npm start
   ```

5. **Verify everything works**
   - Dashboard: http://localhost:5173
   - API: http://localhost:3001
   - Run tests: `npm test`

## 🔄 Development Workflow

### Creating a New Feature or Bug Fix

1. **Create a new branch** from `main`

   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**

   - Write clear, concise commit messages
   - Follow our coding standards (see below)
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**

   ```bash
   # Run all tests
   npm test

   # Run specific tests
   npm run test:client
   npm run test:server

   # Check code formatting
   npm run format:check
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add new anomaly detection algorithm"
   # or
   git commit -m "fix: resolve WebSocket connection timeout issue"
   ```

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (formatting, etc.)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to build process or auxiliary tools

**Examples:**

```bash
feat(ai): implement semantic similarity scoring for events
fix(websocket): handle connection timeouts gracefully
docs(readme): update installation instructions
test(api): add unit tests for event processing
```

## 📋 Pull Request Process

### Before Submitting

- [ ] Code follows our style guidelines
- [ ] Tests pass locally (`npm test`)
- [ ] Documentation is updated (if applicable)
- [ ] Commit messages follow our guidelines
- [ ] Changes are focused and atomic

### Pull Request Template

When creating a PR, please include:

```markdown
## Description

Brief description of what this PR does

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

- [ ] Tests pass locally
- [ ] Added new tests for this change
- [ ] Manual testing completed

## Screenshots (if applicable)

Add screenshots for UI changes

## Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
```

### Review Process

1. **Automated Checks**: GitHub Actions will run tests and checks
2. **Code Review**: Team members will review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged

## 🎨 Coding Standards

### TypeScript/JavaScript

- Use **TypeScript** for type safety
- Follow **ESLint** and **Prettier** configurations
- Use **meaningful variable names**
- Add **JSDoc comments** for complex functions
- Prefer **async/await** over Promises

```typescript
// Good
async function processKubernetesEvent(
  event: K8sEvent,
): Promise<ProcessedEvent> {
  // Implementation
}

// Avoid
function processEvent(e: any) {
  // Implementation
}
```

### React Components

- Use **functional components** with hooks
- Keep components **small and focused**
- Use **TypeScript interfaces** for props
- Follow **component naming conventions**

```typescript
// Good
interface EventCardProps {
  event: K8sEvent;
  onEventClick: (event: K8sEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onEventClick,
}) => {
  // Component implementation
};
```

### CSS/Styling

- Use **Tailwind CSS** classes
- Keep custom CSS minimal
- Use **semantic class names**
- Maintain **responsive design**

### Backend Code

- Use **Express.js** best practices
- Implement proper **error handling**
- Use **middleware** for common functionality
- Follow **RESTful API** conventions

## 🧪 Testing Guidelines

### Unit Tests

- Write tests for **new functions and components**
- Use **Vitest** for testing framework
- Aim for **meaningful test coverage**
- Test **edge cases and error conditions**

```typescript
// Example test
describe('EventProcessor', () => {
  it('should process Kubernetes events correctly', async () => {
    const mockEvent = createMockK8sEvent();
    const result = await processEvent(mockEvent);

    expect(result).toBeDefined();
    expect(result.processed).toBe(true);
  });
});
```

### Integration Tests

- Test **API endpoints** with real data
- Test **WebSocket connections**
- Verify **database interactions**
- Test **external service integrations**

## 🐛 Reporting Issues

When reporting bugs, please include:

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**

- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Node.js version: [e.g. 18.17.0]
- Project version: [e.g. 1.2.3]

**Additional context**
Add any other context about the problem.
```

## 💡 Feature Requests

For feature requests, please provide:

- **Clear description** of the feature
- **Use case** and why it would be valuable
- **Possible implementation** approach (if you have ideas)
- **Alternatives considered**

## 📁 Project Structure

Understanding our project structure:

```
coffybara/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # API controllers
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript types
│   └── tests/              # Backend tests
├── docs/                   # Documentation
└── scripts/                # Build and deployment scripts
```

## 🌟 Code Review Guidelines

### For Contributors

- **Keep PRs small** and focused
- **Respond promptly** to feedback
- **Be open** to suggestions and improvements
- **Test thoroughly** before submitting

### For Reviewers

- **Be constructive** and helpful
- **Explain reasoning** behind feedback
- **Approve quickly** when ready
- **Be respectful** and encouraging

## 🤝 Community Guidelines

### Be Respectful

- Use **welcoming and inclusive** language
- **Respect differing** viewpoints and experiences
- **Accept constructive criticism** gracefully
- **Focus on what's best** for the community

### Be Collaborative

- **Help others** learn and grow
- **Share knowledge** and resources
- **Celebrate contributions** from all members
- **Work together** towards common goals

## 🏆 Recognition

We appreciate all contributions! Contributors will be:

- **Listed** in our README
- **Mentioned** in release notes

## 💬 Getting Help

Need help? Reach out to us:

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion

## 📄 License

By contributing to Coffybara, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

## 🙏 Thank You!

Thank you for contributing to Coffybara! Every contribution helps make Kubernetes monitoring better for everyone.

**Happy coding!** ☕

---

_Questions about this guide? Open an issue and we'll help clarify!_

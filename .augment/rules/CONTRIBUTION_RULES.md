---
type: 'always_apply'
---

# Augment Code PKG Revival - Contribution Rules

## Welcome Contributors!

Thank you for your interest in contributing to the PKG revival project. This document outlines the rules and guidelines for contributing to ensure a smooth and productive collaboration.

## 1. Getting Started Rules

### 1.1 Before You Contribute

- **Read Documentation**: Familiarize yourself with [USER_GUIDELINES.md](./USER_GUIDELINES.md) and [DEVELOPMENT_RULES.md](./DEVELOPMENT_RULES.md)
- **Check Issues**: Look for existing issues before creating new ones
- **Join Community**: Join our Discord server for real-time discussions
- **Sign CLA**: Contributors License Agreement required for code contributions

### 1.2 Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/callmedayz/pkg.git
cd pkg

# Install dependencies
npm install

# Run tests to ensure everything works
npm test

# Start development
npm run dev
```

### 1.3 Environment Requirements

- Node.js 18.x or higher
- Git 2.20 or higher
- Platform-specific build tools (see README.md)

## 2. Issue Contribution Rules

### 2.1 Creating Issues

- **Search First**: Check existing issues and discussions
- **Use Templates**: Use provided issue templates
- **Clear Title**: Descriptive and specific titles
- **Reproduction**: Provide minimal reproduction cases
- **Environment**: Include system and version information

### 2.2 Issue Types

- **Bug Report**: Use bug report template
- **Feature Request**: Use feature request template
- **Documentation**: Use documentation template
- **Question**: Use discussion instead of issues

### 2.3 Issue Labels

Contributors can suggest labels, but only maintainers can assign:

- `bug` - Confirmed bugs
- `enhancement` - New features
- `documentation` - Documentation improvements
- `good first issue` - Beginner-friendly
- `help wanted` - Community help needed

## 3. Code Contribution Rules

### 3.1 Pull Request Process

1. **Fork Repository**: Create your own fork
2. **Create Branch**: Use descriptive branch names
3. **Make Changes**: Follow development rules
4. **Test Thoroughly**: Ensure all tests pass
5. **Update Documentation**: Update relevant docs
6. **Submit PR**: Use PR template
7. **Address Feedback**: Respond to review comments
8. **Merge**: Maintainers will merge when approved

### 3.2 Branch Naming

- `feature/add-node21-support`
- `fix/windows-path-issue`
- `docs/update-installation-guide`
- `refactor/improve-error-handling`

### 3.3 Commit Rules

- **Conventional Commits**: Follow conventional commit format
- **Atomic Commits**: One logical change per commit
- **Clear Messages**: Descriptive commit messages
- **Sign Commits**: Use GPG signing for security

Examples:

```
feat(targets): add support for Node.js 21.x targets
fix(cli): resolve path resolution on Windows
docs(readme): add troubleshooting section
test(core): add unit tests for package builder
```

### 3.4 Code Quality Requirements

- **Linting**: Code must pass ESLint checks
- **Formatting**: Use Prettier for consistent formatting
- **Types**: TypeScript types required for new code
- **Tests**: Minimum 80% coverage for new code
- **Documentation**: JSDoc comments for public APIs

## 4. Testing Rules

### 4.1 Test Requirements

- **Unit Tests**: Required for all new functions
- **Integration Tests**: Required for CLI changes
- **Platform Tests**: Test on multiple platforms when possible
- **Regression Tests**: Add tests for bug fixes

### 4.2 Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests with coverage
npm run test:coverage

# Run tests on specific platform
npm run test:windows
npm run test:macos
npm run test:linux
```

### 4.3 Test Guidelines

- **Descriptive Names**: Clear test descriptions
- **Isolated Tests**: Tests should not depend on each other
- **Mock External**: Mock external dependencies
- **Clean Up**: Clean temporary files after tests

## 5. Documentation Rules

### 5.1 Documentation Types

- **Code Comments**: Inline documentation
- **API Documentation**: JSDoc for public APIs
- **User Guides**: End-user documentation
- **Developer Docs**: Technical implementation details

### 5.2 Documentation Standards

- **Clear Language**: Simple, clear explanations
- **Examples**: Include code examples
- **Up-to-date**: Keep documentation current
- **Accessible**: Consider accessibility guidelines

### 5.3 Documentation Changes

- Update relevant docs with code changes
- Test documentation examples
- Review for clarity and accuracy

## 6. Review Process Rules

### 6.1 Code Review Guidelines

- **Constructive Feedback**: Focus on code, not person
- **Explain Reasoning**: Provide context for suggestions
- **Suggest Solutions**: Don't just point out problems
- **Acknowledge Good Work**: Recognize quality contributions

### 6.2 Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests are comprehensive and pass
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance impact considered
- [ ] Backward compatibility maintained

### 6.3 Addressing Feedback

- **Respond Promptly**: Address feedback within 48 hours
- **Ask Questions**: Clarify unclear feedback
- **Make Changes**: Implement requested changes
- **Update PR**: Keep PR description current

## 7. Community Guidelines

### 7.1 Code of Conduct

- **Respectful**: Treat all community members with respect
- **Inclusive**: Welcome contributors from all backgrounds
- **Professional**: Maintain professional communication
- **Constructive**: Provide helpful, constructive feedback

### 7.2 Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord**: Real-time chat and collaboration
- **Email**: Private or sensitive matters

### 7.3 Conflict Resolution

1. **Direct Communication**: Try to resolve directly
2. **Mediator**: Ask maintainer to mediate
3. **Code of Conduct**: Report violations to maintainers
4. **Final Decision**: Maintainers make final decisions

## 8. Recognition Rules

### 8.1 Contributor Recognition

- **Contributors File**: All contributors listed
- **Release Notes**: Significant contributions mentioned
- **GitHub Profile**: Contributions show on GitHub profile
- **Community Highlights**: Regular contributor spotlights

### 8.2 Maintainer Path

- **Consistent Contributions**: Regular, quality contributions
- **Community Involvement**: Active in discussions and reviews
- **Technical Expertise**: Demonstrated technical knowledge
- **Leadership**: Help guide project direction

## 9. Legal Requirements

### 9.1 Contributor License Agreement (CLA)

- **Required**: All contributors must sign CLA
- **Process**: Automated CLA bot on first PR
- **Rights**: Grants project rights to use contributions
- **Protection**: Protects both contributors and project

### 9.2 Copyright and Licensing

- **MIT License**: All contributions under MIT license
- **Original Work**: Only contribute original work
- **Third-party Code**: Properly attribute third-party code
- **License Compatibility**: Ensure compatible licenses

## 10. Enforcement

### 10.1 Rule Violations

- **Minor**: Gentle reminder and guidance
- **Moderate**: Request changes before merge
- **Severe**: Temporary restriction from contributing
- **Critical**: Permanent ban from project

### 10.2 Appeals Process

- **Contact Maintainers**: Email maintainers directly
- **Provide Context**: Explain your perspective
- **Review Process**: Maintainers will review fairly
- **Final Decision**: Maintainer decision is final

## Getting Help

### Resources

- **Documentation**: [docs.augment-code.org/pkg](https://docs.augment-code.org/pkg)
- **Discord**: [discord.gg/augment-code](https://discord.gg/augment-code)
- **Discussions**: [GitHub Discussions](https://github.com/augment-code/pkg/discussions)
- **Email**: maintainers@augment-code.org

### Mentorship

- **First-time Contributors**: Mentorship available
- **Good First Issues**: Labeled for beginners
- **Pair Programming**: Available for complex features
- **Code Review**: Detailed feedback for learning

---

**Remember**: Contributing to open source should be enjoyable and rewarding. Don't hesitate to ask for help or clarification on any of these rules!

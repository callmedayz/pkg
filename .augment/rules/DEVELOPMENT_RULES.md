---
type: 'always_apply'
---

# Augment Code PKG Revival - Development Rules

## Core Development Principles

This document establishes the fundamental rules and standards for developing the revived PKG project under Augment Code maintenance.

## 1. Code Quality Rules

### 1.1 Code Standards

- **Language**: TypeScript for new code, gradual migration from JavaScript
- **Style**: Prettier + ESLint with Airbnb configuration
- **Testing**: Minimum 80% code coverage for new features
- **Documentation**: JSDoc comments required for all public APIs

### 1.2 File Structure

```
src/
├── cli/           # Command-line interface
├── core/          # Core packaging logic
├── targets/       # Platform-specific code
├── utils/         # Utility functions
├── types/         # TypeScript definitions
└── __tests__/     # Test files
```

### 1.3 Naming Conventions

- **Files**: kebab-case (`package-builder.ts`)
- **Classes**: PascalCase (`PackageBuilder`)
- **Functions/Variables**: camelCase (`buildPackage`)
- **Constants**: SCREAMING_SNAKE_CASE (`DEFAULT_TARGET`)

## 2. Git Workflow Rules

### 2.1 Branch Strategy

- **main**: Production-ready code only
- **develop**: Integration branch for features
- **feature/\***: Individual feature development
- **hotfix/\***: Critical bug fixes
- **release/\***: Release preparation

### 2.2 Commit Standards

- Use [Conventional Commits](https://www.conventionalcommits.org/)
- Format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:

```
feat(cli): add support for Node.js 21 targets
fix(core): resolve asset bundling issue on Windows
docs(readme): update installation instructions
```

### 2.3 Pull Request Rules

- **Required**: All changes must go through PR review
- **Reviewers**: Minimum 2 approvals for core changes
- **Checks**: All CI checks must pass
- **Description**: Use PR template with clear description
- **Size**: Keep PRs under 500 lines when possible

## 3. Testing Rules

### 3.1 Test Requirements

- **Unit Tests**: Required for all new functions/classes
- **Integration Tests**: Required for CLI commands
- **E2E Tests**: Required for packaging workflows
- **Platform Tests**: Must pass on Windows, macOS, and Linux

### 3.2 Test Structure

```javascript
describe('PackageBuilder', () => {
  describe('buildExecutable', () => {
    it('should create executable for valid Node.js project', () => {
      // Test implementation
    });

    it('should throw error for invalid project structure', () => {
      // Test implementation
    });
  });
});
```

### 3.3 Test Data

- Use fixtures in `__tests__/fixtures/`
- Clean up temporary files after tests
- Mock external dependencies appropriately

## 4. Security Rules

### 4.1 Dependency Management

- **Updates**: Regular security updates required
- **Audit**: Run `npm audit` before releases
- **Pinning**: Pin exact versions in package-lock.json
- **Review**: Security review for new dependencies

### 4.2 Code Security

- **Input Validation**: Validate all user inputs
- **Path Traversal**: Prevent directory traversal attacks
- **Execution**: Sanitize shell commands and file paths
- **Secrets**: No hardcoded secrets or API keys

### 4.3 Binary Security

- **Signing**: Code signing for Windows and macOS executables
- **Verification**: Checksum verification for downloads
- **Sandboxing**: Consider security implications of bundled code

## 5. Performance Rules

### 5.1 Build Performance

- **Caching**: Implement aggressive caching strategies
- **Parallelization**: Use worker threads for CPU-intensive tasks
- **Memory**: Monitor memory usage during builds
- **Profiling**: Regular performance profiling required

### 5.2 Runtime Performance

- **Startup Time**: Minimize executable startup time
- **Memory Footprint**: Optimize memory usage of generated executables
- **Size Optimization**: Implement compression and tree-shaking

## 6. Compatibility Rules

### 6.1 Node.js Support

- **Versions**: Support Node.js 18.x, 20.x, 21.x (LTS + Current)
- **Features**: Use features available in minimum supported version
- **Testing**: Test against all supported Node.js versions

### 6.2 Platform Support

- **Primary**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **Architecture**: x64 and arm64 support required
- **Testing**: Automated testing on all supported platforms

### 6.3 Backward Compatibility

- **CLI**: Maintain CLI compatibility with original PKG
- **Config**: Support existing package.json configurations
- **Migration**: Provide clear migration path for breaking changes

## 7. Documentation Rules

### 7.1 Code Documentation

- **Public APIs**: Complete JSDoc documentation
- **Complex Logic**: Inline comments explaining algorithms
- **Examples**: Code examples in documentation
- **Types**: Full TypeScript type definitions

### 7.2 User Documentation

- **README**: Keep README.md up-to-date
- **Changelog**: Maintain detailed CHANGELOG.md
- **Guides**: Comprehensive user guides
- **Troubleshooting**: Common issues and solutions

## 8. Release Rules

### 8.1 Versioning

- **Semantic Versioning**: Follow semver strictly
- **Pre-releases**: Use alpha/beta/rc tags for testing
- **LTS**: Maintain LTS versions for stability

### 8.2 Release Process

1. **Testing**: Full test suite on all platforms
2. **Documentation**: Update all relevant docs
3. **Changelog**: Update with all changes
4. **Review**: Final review by maintainers
5. **Tagging**: Create signed git tags
6. **Publishing**: Automated publishing via CI/CD

### 8.3 Hotfix Process

- **Urgency**: Security fixes within 24 hours
- **Testing**: Minimal but sufficient testing
- **Communication**: Clear communication to users

## 9. Community Rules

### 9.1 Issue Management

- **Triage**: Issues triaged within 48 hours
- **Labels**: Consistent labeling system
- **Templates**: Use issue templates
- **Closure**: Close stale issues after 30 days

### 9.2 Communication

- **Tone**: Professional and welcoming
- **Response Time**: Respond to questions within 72 hours
- **Transparency**: Open about limitations and roadmap

## 10. Maintenance Rules

### 10.1 Dependencies

- **Updates**: Monthly dependency updates
- **Security**: Immediate security updates
- **Deprecation**: Plan for deprecated dependencies
- **Audit**: Regular dependency audits

### 10.2 Technical Debt

- **Tracking**: Track technical debt in issues
- **Allocation**: 20% of development time for debt reduction
- **Refactoring**: Regular refactoring sessions

### 10.3 Monitoring

- **Metrics**: Track build success rates
- **Performance**: Monitor performance regressions
- **Usage**: Understand user patterns and pain points

## Enforcement

### Code Review Checklist

- [ ] Follows coding standards
- [ ] Has appropriate tests
- [ ] Documentation updated
- [ ] Security considerations addressed
- [ ] Performance impact assessed
- [ ] Backward compatibility maintained

### Automated Checks

- ESLint and Prettier formatting
- TypeScript compilation
- Test coverage reports
- Security vulnerability scanning
- Performance benchmarks

### Violations

- **Minor**: Address in next PR
- **Major**: Block PR until resolved
- **Critical**: Immediate fix required

---

**Note**: These rules are living documents and may be updated based on project needs and community feedback. All changes to rules require team consensus.

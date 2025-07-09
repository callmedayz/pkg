---
type: 'always_apply'
---

# Augment Code PKG Revival - Security Rules

## Security Policy and Guidelines

This document establishes security rules and guidelines for the PKG revival project to ensure the safety and integrity of the codebase and generated executables.

## 1. Security Principles

### 1.1 Core Security Principles

- **Defense in Depth**: Multiple layers of security controls
- **Least Privilege**: Minimal permissions and access rights
- **Secure by Default**: Secure configurations as defaults
- **Fail Securely**: Graceful failure without exposing sensitive data
- **Input Validation**: Validate all inputs at boundaries

### 1.2 Threat Model

- **Malicious Input**: Untrusted package.json and source files
- **Supply Chain**: Compromised dependencies
- **Code Injection**: Arbitrary code execution during build
- **Binary Tampering**: Modified executables
- **Information Disclosure**: Sensitive data in executables

## 2. Code Security Rules

### 2.1 Input Validation

```javascript
// ✅ Correct - Validate all inputs
function validatePackageJson(pkg) {
  if (!pkg || typeof pkg !== 'object') {
    throw new SecurityError('Invalid package.json format');
  }

  if (pkg.name && !isValidPackageName(pkg.name)) {
    throw new SecurityError('Invalid package name');
  }
}

// ❌ Incorrect - No validation
function processPackage(pkg) {
  return pkg.scripts[pkg.main]; // Potential undefined access
}
```

### 2.2 Path Security

```javascript
// ✅ Correct - Prevent path traversal
const path = require('path');
function safePath(userPath, basePath) {
  const resolved = path.resolve(basePath, userPath);
  if (!resolved.startsWith(basePath)) {
    throw new SecurityError('Path traversal attempt detected');
  }
  return resolved;
}

// ❌ Incorrect - Vulnerable to path traversal
function unsafePath(userPath) {
  return path.join(__dirname, userPath); // Can escape directory
}
```

### 2.3 Command Execution

```javascript
// ✅ Correct - Safe command execution
const { spawn } = require('child_process');
function safeExecute(command, args) {
  // Validate command is in allowlist
  if (!ALLOWED_COMMANDS.includes(command)) {
    throw new SecurityError('Command not allowed');
  }

  // Sanitize arguments
  const sanitizedArgs = args.map((arg) => sanitizeArg(arg));
  return spawn(command, sanitizedArgs, { shell: false });
}

// ❌ Incorrect - Shell injection vulnerability
function unsafeExecute(userCommand) {
  return exec(userCommand); // Shell injection risk
}
```

## 3. Dependency Security Rules

### 3.1 Dependency Management

- **Audit Regularly**: Run `npm audit` before every release
- **Pin Versions**: Use exact versions in package-lock.json
- **Review New Dependencies**: Security review for all new dependencies
- **Monitor Vulnerabilities**: Automated vulnerability monitoring

### 3.2 Dependency Validation

```javascript
// Package.json security checks
{
  "scripts": {
    "audit": "npm audit --audit-level=moderate",
    "audit-fix": "npm audit fix",
    "security-check": "npm run audit && npm run license-check"
  }
}
```

### 3.3 Supply Chain Security

- **Verify Checksums**: Verify package checksums
- **Use Lock Files**: Commit package-lock.json
- **Scan Dependencies**: Automated dependency scanning
- **License Compliance**: Ensure license compatibility

## 4. Build Security Rules

### 4.1 Build Environment

- **Isolated Builds**: Use containerized build environments
- **Clean Environment**: Fresh environment for each build
- **No Network Access**: Restrict network during sensitive operations
- **Audit Logs**: Log all build activities

### 4.2 Asset Handling

```javascript
// ✅ Correct - Validate asset files
function validateAsset(filePath) {
  const stats = fs.statSync(filePath);

  // Check file size limits
  if (stats.size > MAX_ASSET_SIZE) {
    throw new SecurityError('Asset file too large');
  }

  // Check file type
  const ext = path.extname(filePath).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new SecurityError('Asset file type not allowed');
  }
}
```

### 4.3 Code Injection Prevention

- **No eval()**: Prohibit eval and similar functions
- **Sanitize Inputs**: Sanitize all user-provided code
- **Validate Syntax**: Parse and validate JavaScript syntax
- **Sandbox Execution**: Use isolated execution contexts

## 5. Binary Security Rules

### 5.1 Executable Security

- **Code Signing**: Sign all distributed executables
- **Checksum Verification**: Provide SHA-256 checksums
- **Virus Scanning**: Scan executables before distribution
- **Reproducible Builds**: Ensure build reproducibility

### 5.2 Runtime Security

```javascript
// Secure runtime configuration
const SECURE_DEFAULTS = {
  // Disable dangerous Node.js features
  '--no-deprecation': true,
  '--no-warnings': true,
  '--max-old-space-size': '512', // Limit memory
  '--max-semi-space-size': '64',
};
```

### 5.3 Information Disclosure Prevention

- **Strip Debug Info**: Remove debug information from production builds
- **Obfuscate Sources**: Optional source obfuscation
- **Remove Comments**: Strip comments from bundled code
- **Environment Variables**: Don't embed sensitive env vars

## 6. Vulnerability Management

### 6.1 Vulnerability Response

1. **Assessment**: Evaluate severity and impact
2. **Containment**: Immediate containment measures
3. **Fix Development**: Develop and test fix
4. **Release**: Emergency release if critical
5. **Communication**: Notify users and community

### 6.2 Security Advisories

- **CVE Process**: Follow CVE assignment process
- **Disclosure Timeline**: Responsible disclosure timeline
- **User Notification**: Clear communication to users
- **Patch Availability**: Timely patch releases

### 6.3 Incident Response

```
Severity Levels:
- Critical: Immediate response (< 4 hours)
- High: Same day response (< 24 hours)
- Medium: Within 72 hours
- Low: Next release cycle
```

## 7. Access Control Rules

### 7.1 Repository Access

- **Principle of Least Privilege**: Minimal required permissions
- **Two-Factor Authentication**: Required for all maintainers
- **Regular Access Review**: Quarterly access reviews
- **Offboarding Process**: Immediate access revocation

### 7.2 Release Process Security

- **Signed Commits**: All release commits must be signed
- **Multiple Approvals**: Require multiple maintainer approvals
- **Automated Checks**: Security checks in CI/CD pipeline
- **Audit Trail**: Complete audit trail for releases

## 8. Data Protection Rules

### 8.1 User Data

- **No Telemetry**: No user data collection without consent
- **Local Processing**: Process data locally when possible
- **Data Minimization**: Collect only necessary data
- **Secure Storage**: Encrypt sensitive data at rest

### 8.2 Build Data

- **Temporary Files**: Secure cleanup of temporary files
- **Log Sanitization**: Remove sensitive data from logs
- **Cache Security**: Secure build cache storage
- **Memory Cleanup**: Clear sensitive data from memory

## 9. Security Testing Rules

### 9.1 Security Test Requirements

- **Static Analysis**: SAST tools in CI pipeline
- **Dependency Scanning**: Automated dependency vulnerability scanning
- **Penetration Testing**: Regular security assessments
- **Fuzzing**: Fuzz testing for input validation

### 9.2 Security Test Implementation

```javascript
// Example security test
describe('Security Tests', () => {
  it('should prevent path traversal attacks', () => {
    expect(() => {
      processPath('../../../etc/passwd');
    }).toThrow(SecurityError);
  });

  it('should validate package.json structure', () => {
    const maliciousPackage = { __proto__: { isAdmin: true } };
    expect(() => {
      validatePackageJson(maliciousPackage);
    }).toThrow(SecurityError);
  });
});
```

## 10. Compliance and Reporting

### 10.1 Security Reporting

- **Security Email**: security@augment-code.org
- **Encrypted Communication**: PGP key available
- **Response Time**: Acknowledge within 24 hours
- **Confidentiality**: Maintain confidentiality until fix

### 10.2 Security Metrics

- **Vulnerability Count**: Track open vulnerabilities
- **Response Time**: Average response time to security issues
- **Patch Time**: Time from disclosure to patch
- **Test Coverage**: Security test coverage metrics

### 10.3 Compliance Requirements

- **OWASP Guidelines**: Follow OWASP secure coding practices
- **Industry Standards**: Comply with relevant security standards
- **Legal Requirements**: Meet applicable legal requirements
- **Audit Readiness**: Maintain audit-ready documentation

## Security Contacts

### Reporting Security Issues

- **Email**: security@augment-code.org
- **PGP Key**: [Public key available on website]
- **Response Time**: 24 hours acknowledgment
- **Severity Assessment**: Within 48 hours

### Security Team

- **Security Lead**: [Name and contact]
- **Backup Contact**: [Name and contact]
- **External Advisor**: [Security consultant if applicable]

## Security Resources

### Tools and References

- **OWASP**: [owasp.org](https://owasp.org)
- **Node.js Security**: [nodejs.org/en/security](https://nodejs.org/en/security)
- **npm Security**: [docs.npmjs.com/security](https://docs.npmjs.com/security)
- **CVE Database**: [cve.mitre.org](https://cve.mitre.org)

---

**Remember**: Security is everyone's responsibility. When in doubt, err on the side of caution and consult the security team.

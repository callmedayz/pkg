---
type: 'always_apply'
---

# Augment Code PKG Revival - GitHub Push and Tracking Rules

## Overview

This document establishes specific rules for GitHub pushing and regular progress tracking to ensure consistent project visibility, collaboration, and backup of work in progress.

## 1. Daily Push Requirements

### 1.1 Mandatory Daily Pushes

- **Frequency**: All active work must be pushed to GitHub at least once per day
- **Timing**: Push before end of work session or by 6 PM local time
- **Purpose**: Ensure work is backed up and visible to team members
- **Exception**: Weekends and holidays (push when resuming work)

### 1.2 Work-in-Progress Pushes

- **Feature Development**: Push after each logical unit of work completion
- **Bug Fixes**: Push after local testing confirms fix works
- **Documentation**: Push immediately after completion
- **Experiments**: Push to experimental branches for team visibility

## 2. Branch Management for Tracking

### 2.1 Branch Naming for Progress Tracking

```
feature/[username]/[feature-name]
fix/[username]/[issue-number]-[description]
docs/[username]/[document-name]
experiment/[username]/[experiment-name]
wip/[username]/[work-description]
```

Examples:

```
feature/john/node21-sea-integration
fix/sarah/1234-windows-path-issue
docs/mike/api-documentation-update
experiment/lisa/performance-optimization
wip/alex/typescript-migration-core
```

### 2.2 Branch Protection Rules

- **main**: Protected - No direct pushes allowed
- **develop**: Protected - Requires PR and review
- **feature/\***: Open for direct pushes by branch owner
- **wip/\***: Open for direct pushes, temporary branches

## 3. Commit Standards for Tracking

### 3.1 Commit Message Format

```
type(scope): description [tracking-tag]

[optional body]

[optional footer]
```

### 3.2 Tracking Tags

- `[WIP]` - Work in progress, not ready for review
- `[READY]` - Ready for review and testing
- `[DRAFT]` - Draft implementation, needs refinement
- `[BACKUP]` - Backup commit, may not be functional
- `[MILESTONE]` - Significant progress milestone reached

Examples:

```
feat(cli): add basic Node.js 21 target support [WIP]
fix(core): resolve Windows path resolution issue [READY]
docs(readme): update installation instructions [READY]
refactor(build): restructure webpack configuration [DRAFT]
test(integration): add cross-platform tests [MILESTONE]
```

### 3.3 Commit Granularity Rules

- **Single Purpose**: Each commit addresses one specific change
- **Functional Units**: Commits should represent working functionality when possible
- **Incremental Progress**: Show clear progression of work
- **Rollback Safety**: Each commit should be safe to rollback to

## 4. Progress Tracking Mechanisms

### 4.1 GitHub Issues Integration

- **Link Commits**: Reference issue numbers in commit messages
- **Progress Updates**: Comment on issues with commit references
- **Status Updates**: Update issue labels based on commit progress
- **Milestone Tracking**: Link commits to project milestones

### 4.2 Pull Request Draft Usage

```
# Create draft PR for ongoing work
git push origin feature/username/feature-name
# Create draft PR on GitHub with [WIP] prefix
# Convert to ready for review when complete
```

### 4.3 GitHub Projects Integration

- **Task Cards**: Move cards based on commit progress
- **Automated Updates**: Use commit messages to trigger card movements
- **Progress Visualization**: Maintain clear project board status

## 5. Team Collaboration Rules

### 5.1 Code Sharing and Visibility

- **Early Sharing**: Push experimental work for team feedback
- **Collaboration**: Use shared feature branches for pair programming
- **Knowledge Transfer**: Regular pushes enable knowledge sharing
- **Mentoring**: Junior developers push frequently for guidance

### 5.2 Review and Feedback Process

- **Continuous Review**: Team members can review WIP commits
- **Early Feedback**: Provide feedback on work-in-progress
- **Collaborative Development**: Multiple developers can contribute to feature branches
- **Learning Opportunities**: Use commit history for learning and improvement

## 6. Backup and Recovery Rules

### 6.1 Work Backup Strategy

- **Local Work**: Never keep work only on local machine overnight
- **Multiple Locations**: Push to both feature and backup branches if needed
- **Critical Work**: Push immediately after significant progress
- **Experimental Work**: Push to experimental branches for safety

### 6.2 Recovery Procedures

- **Lost Work**: Use GitHub history to recover lost local work
- **Rollback Process**: Clear commit history enables easy rollbacks
- **Branch Recovery**: Recover accidentally deleted branches from GitHub
- **Collaboration Recovery**: Team can continue work from any pushed state

## 7. Tracking and Reporting

### 7.1 Daily Tracking Metrics

- **Commits per Day**: Track development velocity
- **Lines Changed**: Monitor code change volume
- **Files Modified**: Track scope of changes
- **Issue Progress**: Monitor issue resolution rate

### 7.2 Weekly Progress Reports

```markdown
## Weekly Progress Report - [Date Range]

### Commits This Week

- Total commits: [number]
- Features developed: [list]
- Bugs fixed: [list]
- Documentation updated: [list]

### Key Achievements

- [Achievement 1]
- [Achievement 2]

### Next Week Goals

- [Goal 1]
- [Goal 2]
```

### 7.3 Milestone Tracking

- **Feature Milestones**: Track major feature completion
- **Release Milestones**: Monitor release preparation progress
- **Quality Milestones**: Track testing and quality improvements
- **Community Milestones**: Monitor community engagement progress

## 8. Emergency and Exception Procedures

### 8.1 Critical Fix Protocol

1. **Immediate Push**: Push critical fixes immediately
2. **Emergency Branch**: Use `hotfix/critical-[description]` naming
3. **Fast-Track Review**: Expedited review process for critical fixes
4. **Post-Hoc Documentation**: Document emergency procedures after resolution

### 8.2 Exception Handling

- **System Outages**: Document when GitHub is unavailable
- **Personal Emergencies**: Team coverage for urgent pushes
- **Technical Issues**: Alternative backup procedures
- **Holiday Coverage**: Reduced frequency during holidays

## 9. Quality Assurance

### 9.1 Pre-Push Checklist

- [ ] Code compiles without errors
- [ ] Basic functionality tested locally
- [ ] Commit message follows format standards
- [ ] Sensitive information removed
- [ ] Branch name follows naming convention

### 9.2 Push Validation

- **Automated Checks**: CI/CD runs on every push
- **Quality Gates**: Automated quality checks
- **Security Scanning**: Automatic security vulnerability scanning
- **Performance Monitoring**: Track performance impact of changes

## 10. Tools and Automation

### 10.1 Git Hooks for Tracking

```bash
# Pre-commit hook example
#!/bin/sh
# Ensure commit message includes tracking tag
commit_regex='^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+ \[(WIP|READY|DRAFT|BACKUP|MILESTONE)\]$'

if ! grep -qE "$commit_regex" "$1"; then
    echo "Invalid commit message format. Must include tracking tag."
    exit 1
fi
```

### 10.2 GitHub Actions for Tracking

```yaml
name: Progress Tracking
on: [push]
jobs:
  track-progress:
    runs-on: ubuntu-latest
    steps:
      - name: Update Project Board
        uses: alex-page/github-project-automation-plus@v0.8.1
        with:
          project: PKG Revival Progress
          column: In Progress
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```

### 10.3 Notification Systems

- **Slack Integration**: Notify team of significant pushes
- **Email Alerts**: Daily summary of team progress
- **Dashboard Updates**: Real-time progress visualization
- **Mobile Notifications**: Critical update alerts

## Enforcement and Monitoring

### 10.4 Compliance Monitoring

- **Daily Check**: Verify all team members pushed work
- **Weekly Review**: Review commit quality and frequency
- **Monthly Assessment**: Evaluate tracking effectiveness
- **Quarterly Improvement**: Update rules based on experience

### 10.5 Non-Compliance Procedures

- **First Reminder**: Gentle reminder about daily push requirement
- **Pattern Issues**: Discussion with team member about challenges
- **Support Needed**: Provide additional tools or training
- **Process Improvement**: Adjust rules if they're not working

---

**Remember**: The goal of these rules is to improve collaboration, ensure work backup, and maintain project visibility. They should enable better teamwork, not create bureaucratic overhead.

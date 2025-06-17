# Coffybara Release Process

This document outlines the standardized process for creating releases in the Coffybara project.

## 📋 Prerequisites

- GitHub CLI installed and authenticated (`gh auth login`)
- Write access to the `oslabs-beta/capybara` repository
- Node.js and npm installed locally

## 🚀 Release Workflow

### 1. Prepare the Release

#### Update CHANGELOG.md

Add a new version section with the changes for this release:

```markdown
## [0.9.1] - 2025-06-20

### Added

- New feature descriptions
- Enhancement details

### Changed

- Modified functionality descriptions
- Updated dependencies

### Fixed

- Bug fix descriptions
- Security patches

### Removed

- Deprecated features removed
```

#### Update Version Numbers

Update all package.json files to the new version:

```bash
# From project root
npm version 0.9.1 --no-git-tag-version

# Update client
cd client && npm version 0.9.1 --no-git-tag-version

# Update server
cd ../server && npm version 0.9.1 --no-git-tag-version

# Return to root
cd ..
```

### 2. Commit and Tag

```bash
# Stage all changes
git add .

# Commit with conventional commit format
git commit -m "chore: bump version to 0.9.1

- Updated CHANGELOG.md with release notes
- Bumped package.json versions across all modules"

# Create and push the tag
git tag v0.9.1
git push origin main
git push origin v0.9.1
```

### 3. Automated Release Creation

Once you push the tag, our GitHub Action (`.github/workflows/release.yml`) will automatically:

- ✅ Create the GitHub release
- ✅ Extract release notes from CHANGELOG.md
- ✅ Build and attach client artifacts
- ✅ Mark as pre-release (until v1.0.0)
- ✅ Trigger deployment pipeline

### 4. Manual Release (Alternative)

If you prefer to create releases manually or the automated workflow fails:

```bash
# Using GitHub CLI
gh release create v0.9.1 \
  --title "Coffybara v0.9.1 - Bug Fixes & Improvements" \
  --notes-file <(awk '/^## \[0.9.1\]/{flag=1; next} /^## \[0.9.0\]/{flag=0} flag' CHANGELOG.md) \
  --target main \
  --prerelease
```

Or via GitHub web interface:

1. Go to [Releases](https://github.com/oslabs-beta/capybara/releases)
2. Click "Create a new release"
3. Tag: `v0.9.1`
4. Title: `Coffybara v0.9.1 - Bug Fixes & Improvements`
5. Copy release notes from CHANGELOG.md
6. Check "Set as a pre-release" (for versions < 1.0.0)
7. Publish release

## 📊 Version Strategy

### Pre-1.0.0 Releases

- **0.x.0** (Minor): New features, API changes, breaking changes allowed
- **0.x.y** (Patch): Bug fixes, small improvements, documentation updates

### Pre-release Versions

- **0.x.y-alpha.z**: Early development, internal testing
- **0.x.y-beta.z**: Feature complete, broader testing
- **0.x.y-rc.z**: Release candidates, final testing

### Examples

```
0.9.0 → 0.9.1 → 0.9.2-rc.1 → 0.9.2 → 1.0.0-rc.1 → 1.0.0
```

## 🎯 Release Types

### Patch Release (0.9.0 → 0.9.1)

**When to use:** Bug fixes, security patches, documentation updates

```bash
npm version patch --no-git-tag-version
```

### Minor Release (0.9.1 → 0.10.0)

**When to use:** New features, API additions, significant improvements

```bash
npm version minor --no-git-tag-version
```

### Major Release (0.10.0 → 1.0.0)

**When to use:** Breaking changes, major API overhauls, stable release

```bash
npm version major --no-git-tag-version
```

## ✅ Release Checklist

Before creating any release, ensure:

- [ ] All tests pass locally (`npm test`)
- [ ] Build succeeds without errors (`npm run build`)
- [ ] CHANGELOG.md is updated with release notes
- [ ] Version numbers match across all package.json files
- [ ] Documentation is up to date
- [ ] Breaking changes are clearly documented
- [ ] Security vulnerabilities are addressed

## 🔄 Post-Release Tasks

After creating a release:

1. **Verify deployment** completed successfully
2. **Test production environment** functionality
3. **Update project boards** (Jira/GitHub Projects)
4. **Notify team members** of the new release
5. **Monitor for issues** in the first 24 hours
6. **Update documentation** if needed

## 🚨 Hotfix Process

For critical bug fixes that need immediate release:

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/0.9.2

# Make critical fixes
# ... fix the issue ...

# Update version for hotfix
npm version patch --no-git-tag-version
cd client && npm version patch --no-git-tag-version
cd ../server && npm version patch --no-git-tag-version
cd ..

# Update CHANGELOG.md with hotfix notes
# Commit and create PR to main
git add .
git commit -m "hotfix: critical bug fix for v0.9.2"
git push origin hotfix/0.9.2

# After PR merge, create release
git checkout main
git pull origin main
git tag v0.9.2
git push origin v0.9.2
```

## 📞 Support

If you encounter issues with the release process:

1. Check [GitHub Actions](https://github.com/oslabs-beta/capybara/actions) for build errors
2. Verify the [release workflow](/.github/workflows/release.yml) configuration
3. Contact the team leads: **Wenjun Song**, **Steven Yeung**, or **Amit Haror**

## 📚 References

- [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
- [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
- [GitHub Releases Documentation](https://docs.github.com/en/repositories/releasing-projects-on-github)
- [Conventional Commits](https://www.conventionalcommits.org/)

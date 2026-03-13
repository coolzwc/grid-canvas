#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/release.sh [patch|minor|major] or ./scripts/release.sh 0.2.0
# Bumps version in both packages, commits, tags, and pushes.

VERSION_ARG="${1:-patch}"

# Resolve current version from core package
CURRENT=$(node -p "require('./packages/core/package.json').version")
echo "Current version: $CURRENT"

# Calculate next version
if [[ "$VERSION_ARG" =~ ^[0-9]+\.[0-9]+\.[0-9] ]]; then
  NEXT="$VERSION_ARG"
else
  IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT"
  case "$VERSION_ARG" in
    major) NEXT="$((MAJOR + 1)).0.0" ;;
    minor) NEXT="${MAJOR}.$((MINOR + 1)).0" ;;
    patch) NEXT="${MAJOR}.${MINOR}.$((PATCH + 1))" ;;
    *) echo "Usage: $0 [patch|minor|major|x.y.z]"; exit 1 ;;
  esac
fi

echo "Bumping to: $NEXT"

# Update version in both packages
cd packages/core
npm version "$NEXT" --no-git-tag-version
cd ../react
npm version "$NEXT" --no-git-tag-version
cd ../..

# Stage, commit, tag, push
git add packages/core/package.json packages/react/package.json
git commit -m "release: v${NEXT}"
git tag "v${NEXT}"

echo ""
echo "Done! Run the following to publish:"
echo ""
echo "  git push origin main --tags"
echo ""
echo "This will trigger the Release workflow to:"
echo "  1. Run tests"
echo "  2. Publish @grid-canvas/core@${NEXT} to npm"
echo "  3. Publish @grid-canvas/react@${NEXT} to npm"
echo "  4. Create GitHub Release v${NEXT} with changelog"

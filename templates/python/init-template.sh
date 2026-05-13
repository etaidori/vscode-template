#!/bin/bash

# Project Template Initializer - Shell Wrapper
# 
# Usage:
#   ./init-template.sh <target-folder>
#   ./init-template.sh <target-folder> --git

if [ $# -eq 0 ]; then
  echo "❌ Error: Target folder path required"
  echo ""
  echo "Usage: ./init-template.sh <target-folder> [--git]"
  echo ""
  echo "Examples:"
  echo "  ./init-template.sh ../my-new-project"
  echo "  ./init-template.sh ~/projects/new-project --git"
  exit 1
fi

# Run Node.js script with all arguments passed through
node "$(dirname "$0")/init-template.js" "$@"

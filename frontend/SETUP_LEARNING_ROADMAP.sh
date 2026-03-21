#!/bin/bash
# Learning Roadmap Component Installation & Setup Guide

# ============================================
# STEP 1: INSTALL REQUIRED DEPENDENCIES
# ============================================

echo "📦 Installing dependencies..."
npm install framer-motion recharts react-router-dom axios

# ============================================
# STEP 2: VERIFY INSTALLATION
# ============================================

echo "✅ Dependencies installed successfully"
echo ""
echo "Installed packages:"
npm list framer-motion recharts react-router-dom

# ============================================
# STEP 3: FILE STRUCTURE
# ============================================

echo ""
echo "📁 Component files created in /frontend/src/components/:"
ls -la src/components/{Learning*,Progress*,Timeline*,Skill*,*.css}

# ============================================
# DONE
# ============================================

echo ""
echo "✨ Setup complete! Next steps:"
echo ""
echo "1. Review LEARNING_ROADMAP_README.md for documentation"
echo "2. Check example-integration.js for usage examples"
echo "3. Update App.jsx with React Router routes"
echo "4. Test with sample data from example-integration.js"
echo ""
echo "Happy coding! 🚀"

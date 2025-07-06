# PowerShell script to start both backend (API) and frontend (web) for Edu AI Platform
# This will open two windows: one for API, one for web

Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd "apps/api"; npm run dev'
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd "apps/web"; npm run dev'

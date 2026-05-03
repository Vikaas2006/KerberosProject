@echo off
REM Kerberos Authentication Protocol Simulator - Windows Setup Script

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  Kerberos Authentication Protocol Simulator Setup         ║
echo ║  Installing dependencies for backend and frontend        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Backend Setup
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Setting up Backend...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cd backend
call npm install
echo.
echo ✓ Backend dependencies installed
echo.

REM Frontend Setup
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Setting up Frontend...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cd ..\frontend
call npm install
echo.
echo ✓ Frontend dependencies installed
echo.

REM Summary
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ✓ Setup Complete!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo Next steps:
echo.
echo Terminal 1 - Start Backend:
echo   cd backend
echo   npm start
echo.
echo Terminal 2 - Start Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo Then open: http://localhost:3000
echo.
echo Happy learning! 🚀
echo.
pause

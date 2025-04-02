@echo off
start cmd /c "npm run dev"
cd /d "%~dp0\src\back"
start cmd /c "node Servidor.js"

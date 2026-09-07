@echo off
cd /d "C:\Users\sergi\Desktop\mepillo-site"
echo.
echo ======================================
echo       MEPILLO - PUBLICAR WEB
echo ======================================
echo.
echo Vas a publicar la version actual en Firebase.
echo.
pause
firebase.cmd deploy --only hosting
echo.
pause

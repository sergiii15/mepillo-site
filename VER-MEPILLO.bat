@echo off
cd /d "C:\Users\sergi\Desktop\mepillo-site"
start "" http://localhost:5000
firebase.cmd serve --only hosting
pause

@echo off
cd /d "%~dp0"
start "Lab 6" http://localhost:8000/
py -m http.server 8000

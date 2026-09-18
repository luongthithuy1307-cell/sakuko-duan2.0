@echo off
REM Run Be Thuy bot with AUTO-RESTART on drop/crash.
cd /d "%~dp0"
:loop
echo [%date% %time%] Starting bot... >> log.txt
node bot.js >> log.txt 2>&1
echo [%date% %time%] Bot exited, restarting in 5s... >> log.txt
timeout /t 5 /nobreak >nul
goto loop

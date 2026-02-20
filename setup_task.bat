@echo off
set SCRIPT_PATH=%~dp0twitter_poster.js
set NODE_PATH=node

echo Setting up Windows Task Scheduler for Twitter Poster...
echo This will create a task to run every hour.
echo.

schtasks /create /tn "JobLlamaTwitterPoster" /tr "'%NODE_PATH%' '%SCRIPT_PATH%'" /sc hourly /mo 1 /f

if %errorlevel% equ 0 (
    echo [SUCCESS] Task "JobLlamaTwitterPoster" created successfully.
    echo It will run every hour.
) else (
    echo [ERROR] Failed to create task. You may need to run this script as Administrator.
)

pause

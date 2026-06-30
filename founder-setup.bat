@echo off
REM ══════════════════════════════════════════════════════════════════════════
REM  NATIVE NOVA PROTOCOL — Sovereign Founder Setup Script
REM
REM  Place this file in the root of the NATIVE-NOVA-PROTOCOL repository.
REM  Double-click (or run from cmd) to:
REM    1. Verify Node.js is installed
REM    2. Install all npm dependencies
REM    3. Build the TypeScript SDK (tsc)
REM    4. Open the Founder Dashboard in your default browser
REM
REM  φ = 1.6180339887498948482
REM  SOVEREIGNTY_FLOOR = 0.75
REM  LOSS_AVERSION_LAMBDA = 2.25
REM  KURAMOTO_K = φ
REM ══════════════════════════════════════════════════════════════════════════

setlocal enabledelayedexpansion

echo.
echo  ╔══════════════════════════════════════════════════════════════════╗
echo  ║        ⚡  NATIVE NOVA PROTOCOL — Sovereign Setup               ║
echo  ║           φ = 1.6180339887   SOVEREIGNTY_FLOOR = 0.75           ║
echo  ╚══════════════════════════════════════════════════════════════════╝
echo.

REM ── Step 0: Set working directory to script location ───────────────────
cd /d "%~dp0"
echo [INFO] Working directory: %CD%
echo.

REM ── Step 1: Check Node.js ──────────────────────────────────────────────
echo [STEP 1/4] Checking Node.js...
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo.
    echo  [ERROR] Node.js was not found on PATH.
    echo.
    echo  Install Node.js 18 or later from:
    echo    https://nodejs.org/en/download
    echo.
    echo  Then re-run this script.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VER=%%i
echo  [OK] Node.js %NODE_VER%   npm %NPM_VER%
echo.

REM ── Step 2: npm install ────────────────────────────────────────────────
echo [STEP 2/4] Installing dependencies (npm install)...
echo  This may take a minute on first run.
echo.
call npm install
if %ERRORLEVEL% neq 0 (
    echo.
    echo  [ERROR] npm install failed.
    echo  Check your internet connection and try again.
    echo.
    pause
    exit /b 1
)
echo.
echo  [OK] Dependencies installed.
echo.

REM ── Step 3: TypeScript build ───────────────────────────────────────────
echo [STEP 3/4] Building TypeScript SDK (npm run build)...
echo  Output will be written to: .nova/build/organism/
echo.
call npm run build
if %ERRORLEVEL% neq 0 (
    echo.
    echo  [ERROR] TypeScript build failed.
    echo  Check for type errors above.
    echo.
    pause
    exit /b 1
)
echo.
echo  [OK] SDK built successfully.
echo  SDK entry point: .nova\build\organism\organism\sdk\index.js
echo.

REM ── Step 4: Open Founder Dashboard ────────────────────────────────────
echo [STEP 4/4] Launching Founder Dashboard...

if not exist "founder-dashboard.html" (
    echo  [INFO] founder-dashboard.html not found locally — downloading now...
    set "DASH_URL=https://raw.githubusercontent.com/ItsNotAILABS/NATIVE-NOVA-PROTOCOL/main/founder-dashboard.html"
    powershell -NoProfile -Command "Invoke-WebRequest -Uri '%DASH_URL%' -OutFile 'founder-dashboard.html' -UseBasicParsing" >nul 2>&1
    if not exist "founder-dashboard.html" (
        echo.
        echo  [ERROR] Auto-download failed.  Please download the file manually:
        echo.
        echo    %DASH_URL%
        echo.
        echo  Save it as founder-dashboard.html in the same folder as this script:
        echo    %~dp0
        echo.
        pause
        exit /b 1
    )
    echo  [OK] Downloaded founder-dashboard.html.
)

start "" "%~dp0founder-dashboard.html"
echo  [OK] Dashboard opened in your default browser.
echo  File: %~dp0founder-dashboard.html
echo.

REM ── Done ───────────────────────────────────────────────────────────────
echo  ╔══════════════════════════════════════════════════════════════════╗
echo  ║  NOVA is live.  Your sovereign substrate is running.            ║
echo  ║                                                                  ║
echo  ║  Engines built:                                                  ║
echo  ║    FristonFreeEnergyEngine   LotkaVolterraEngine                ║
echo  ║    HormeticCycleEngine       AntifragilityEngine                ║
echo  ║    SL0VampireGate            KuramotoEngine                     ║
echo  ║    FractalSovereigntyRegistry                                    ║
echo  ║    BehavioralEconomicsLaws   (L-72 through L-79)                ║
echo  ║    SovereignQueryEngine      FounderWorkspace                   ║
echo  ║                                                                  ║
echo  ║  SDK: .nova\build\organism\organism\sdk\index.js                ║
echo  ╚══════════════════════════════════════════════════════════════════╝
echo.
pause
endlocal

@echo off
chcp 65001 >nul
title Rodar projeto local (Windows)
cd /d "%~dp0"

echo ============================================
echo   Iniciando o projeto no seu computador
echo   Sem banco de dados, sem nuvem, 100%% local
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERRO] Node.js nao encontrado.
  echo Instale o Node.js LTS em https://nodejs.org e rode este arquivo de novo.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Instalando dependencias pela primeira vez. Isso pode levar alguns minutos...
  call npm install
  if errorlevel 1 (
    echo.
    echo [ERRO] Falha ao instalar as dependencias.
    pause
    exit /b 1
  )
)

echo.
echo Subindo o servidor local em http://localhost:8080
echo Feche esta janela para parar o servidor.
echo.

start "" http://localhost:8080
call npm run dev

echo.
echo Servidor encerrado.
pause

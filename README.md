# WealthForge
Repository name: wealthforge Description: WealthForge — Africa’s Creative + Financial Wealth Operating System 
name: Deploy WealthForge Africa OS

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test-build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install deps
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install pytest flake8

      - name: Lint + Test
        run: |
          flake8. --count --select=E9,F63,F7,F82 --show-source --statistics
          pytest tests/ -v

      - name: Build Docker
        run: docker build -t wealthforge-africa-os.

      - name: Deploy to VPS/Render/Railway
        if: github.ref == 'refs/heads/main'
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
        run: |
          echo "Deploying... add your SSH/Render CLI here"
          # ssh user@vps "cd app && git pull && docker-compose up -d"

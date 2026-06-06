# GitHub Actions: EC2 に直接デプロイ (コンテナなし)

コンテナを使わず、SSH 経由でビルド済みコードを EC2 に転送して実行する方法。

## 前提条件

- EC2 に Node.js がインストール済み（[setup.md](./setup.md) 参照）
- GitHub Secrets に以下を登録:
  - `EC2_HOST` – EC2 のパブリック IP or ホスト名
  - `EC2_USER` – SSH ユーザー（例: `ec2-user`）
  - `EC2_SSH_KEY` – SSH 秘密鍵
- EC2 のセキュリティグループで SSH (22) を許可

## ワークフロー

`.github/workflows/deploy-direct.yml`

```yaml
name: Deploy to EC2 (Direct)

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - run: npm ci
      - run: npm run build

      - name: Deploy via SSH
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          source: "dist/,package.json,package-lock.json"
          target: "/home/${{ secrets.EC2_USER }}/app"

      - name: Restart app
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/app
            npm ci --omit=dev
            pm2 restart app || pm2 start dist/server.js --name app
```

## EC2 側の事前準備

```bash
# pm2 をインストール（プロセス管理用）
sudo npm install -g pm2
pm2 startup
```

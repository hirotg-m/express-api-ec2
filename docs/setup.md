# セットアップ & 使い方

## 1. Node.js インストール

### Rocky Linux 9 (EC2)

```bash
curl -fsSL https://rpm.nodesource.com/setup_23.x | sudo bash -
sudo dnf install -y nodejs
```

### Windows

https://nodejs.org/ から LTS 版をダウンロードしてインストール。

### 確認

```bash
node -v
npm -v
```

## 2. アプリケーション起動

```bash
cd express-api-ec2
npm install
npm run build
npm start
```

開発時（ビルド不要で直接実行）:

```bash
npm run dev
```

ポートを変更する場合:

```bash
PORT=8080 npm start
```

## 3. API エンドポイント (curl)

サーバーが `localhost:3000` で動いている前提です。

### Health check

```bash
curl http://localhost:3000/health
```

### データ作成 (POST)

```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name": "item1", "price": 100}'
```

### 全件取得 (GET)

```bash
curl http://localhost:3000/items
```

### 1件取得 (GET)

```bash
curl http://localhost:3000/items/1
```

### 更新 (PUT)

```bash
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 200}'
```

### 削除 (DELETE)

```bash
curl -X DELETE http://localhost:3000/items/1
```

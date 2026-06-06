# Docker コンテナ実行手順

## 1. コンテナイメージのビルド

```bash
cd express-api-ec2
docker build -t express-api .
```

## 2. コンテナの実行

```bash
docker run -d -p 3000:3000 --name express-api express-api
```

| オプション | 説明 |
|-----------|------|
| `-d` | バックグラウンド実行 |
| `-p 3000:3000` | ホスト:コンテナ のポートマッピング |
| `--name express-api` | コンテナ名を指定 |

ポートを変更する場合:

```bash
docker run -d -p 8080:3000 --name express-api express-api
```

## 3. 動作確認

```bash
curl http://localhost:3000/health
```

## 4. ログ確認

```bash
docker logs express-api
```

## 5. コンテナの停止・削除

```bash
docker stop express-api
docker rm express-api
```

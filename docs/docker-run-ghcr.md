# コンテナイメージの利用方法

GitHub Container Registry に公開されているイメージを使ってアプリを実行する手順。

## イメージ情報

| 項目 | 値 |
|------|---|
| レジストリ | ghcr.io |
| イメージ名 | ghcr.io/hirotg-m/express-api-ec2 |
| タグ | `latest`, `sha-<commit-hash>` |

パッケージは Public なので認証なしで pull できる。

## ローカルで実行

```bash
docker pull ghcr.io/hirotg-m/express-api-ec2:latest
docker run -d -p 3000:3000 ghcr.io/hirotg-m/express-api-ec2:latest
```

確認:

```bash
curl http://localhost:3000/health
```

停止:

```bash
docker stop $(docker ps -q --filter ancestor=ghcr.io/hirotg-m/express-api-ec2:latest)
```

## EC2 で実行

```bash
docker pull ghcr.io/hirotg-m/express-api-ec2:latest
docker stop app || true
docker rm app || true
docker run -d --name app -p 3000:3000 ghcr.io/hirotg-m/express-api-ec2:latest
```

## 特定バージョンを指定して実行

```bash
docker run -d -p 3000:3000 ghcr.io/hirotg-m/express-api-ec2:sha-2926142
```

## ポートを変更する場合

ホスト側のポートを 8080 にする例:

```bash
docker run -d -p 8080:3000 ghcr.io/hirotg-m/express-api-ec2:latest
```

## イメージの更新

新しいバージョンがリリースされたら:

```bash
docker pull ghcr.io/hirotg-m/express-api-ec2:latest
docker stop app || true
docker rm app || true
docker run -d --name app -p 3000:3000 ghcr.io/hirotg-m/express-api-ec2:latest
```

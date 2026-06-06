# GitHub Actions: コンテナイメージを GitHub Container Registry に保存

CI でコンテナイメージをビルドし、GitHub Container Registry (ghcr.io) にプッシュするまでの手順。

## 前提条件

- リポジトリに `Dockerfile` が存在すること
- GitHub リポジトリの設定が完了していること（下記参照）

## GitHub リポジトリ設定

GITHUB_TOKEN でコンテナレジストリへの書き込みを許可する必要がある。

1. リポジトリページで **Settings** タブを開く
2. 左メニューから **Actions** > **General** を選択
3. 「Workflow permissions」セクションまでスクロール
4. **Read and write permissions** を選択
5. **Save** をクリック

この設定を行わないと、イメージの push 時に `403 Forbidden` エラーになる。

## ワークフロー

`.github/workflows/ci-container.yml`

```yaml
name: CI - Build and Push Container Image

on:
  push:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - uses: docker/metadata-action@v5
        id: meta
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha
            type=raw,value=latest

      - uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

## 結果確認

プッシュ後、リポジトリの **Packages** タブにイメージが表示される。

```
ghcr.io/<owner>/<repo>:latest
ghcr.io/<owner>/<repo>:sha-<commit-hash>
```

## コンテナイメージを使う

### 認証

ghcr.io からイメージを pull するには、GitHub Personal Access Token (PAT) が必要。

1. GitHub で **Settings** > **Developer settings** > **Personal access tokens** > **Tokens (classic)** を開く
2. **Generate new token** で `read:packages` スコープを付与して作成
3. トークンで ghcr.io にログイン:

```bash
echo <GITHUB_PAT> | docker login ghcr.io -u <username> --password-stdin
```

### ローカルで実行

```bash
docker pull ghcr.io/<owner>/express-api-ec2:latest
docker run -d -p 3000:3000 ghcr.io/<owner>/express-api-ec2:latest
```

### EC2 で実行

```bash
# ghcr.io にログイン
echo <GITHUB_PAT> | docker login ghcr.io -u <username> --password-stdin

# pull & 起動
docker pull ghcr.io/<owner>/express-api-ec2:latest
docker stop app || true
docker rm app || true
docker run -d --name app -p 3000:3000 ghcr.io/<owner>/express-api-ec2:latest
```

### パッケージの公開設定（PAT 不要にする場合）

イメージを public にすれば認証なしで pull できる。

1. リポジトリの **Packages** タブからパッケージを開く
2. **Package settings** をクリック
3. **Danger Zone** の **Change visibility** で **Public** を選択

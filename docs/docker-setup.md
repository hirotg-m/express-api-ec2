# Docker 環境構築 (Rocky Linux 9)

## 1. Podman の無効化・削除

インストール済みの場合のみ停止・削除する。

```bash
sudo systemctl stop podman.socket 2>/dev/null
sudo systemctl disable podman.socket 2>/dev/null
sudo dnf remove -y podman buildah skopeo 2>/dev/null
```

確認:

```bash
rpm -q podman
# "package podman is not installed" と表示されれば OK
```

## 2. Docker インストール

```bash
sudo dnf install -y dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

## 3. Docker 起動・自動起動設定

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

## 4. 一般ユーザーで実行できるようにする

```bash
sudo usermod -aG docker $USER
newgrp docker
```

## 5. 動作確認

```bash
docker --version
docker run --rm hello-world
```

## 6. よく使うコマンド

### コンテナイメージ一覧

```bash
docker images
```

### コンテナ一覧

```bash
# 実行中のコンテナ
docker ps

# 停止中を含む全コンテナ
docker ps -a
```

### コンテナの停止

```bash
# 指定したコンテナを停止
docker stop <コンテナIDまたは名前>

# 全コンテナを停止
docker stop $(docker ps -q)
```

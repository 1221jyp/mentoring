# 시스팀 동아리 웹페이지

## 사이트 주소 : https://onamsysteam.com

## 개발환경 : localhost:5700

### 프로덕션 환경에서 실행시킬 명령어

```
    docker compose -f docker-compose.prod.yml up
```

### 개발 환경에서 실행시킬 명령어

```
    make dev
```

### 도커 이미지 빌드 명령어 - 맥

```
    DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose build --no-cache
```

### 도커 이미지 빌드 명령어 - 윈도우

```
    $env:DOCKER_DEFAULT_PLATFORM="linux/amd64"; docker compose build --no-cache
```

### 도커허브에 업로드

```
    make up
```

### 루트 폴더에서 client 수정했을때

```
    make build
```

### 서버에서 pull 받아오기

```
    docker pull onamsysteam/yeolpulta-server:latest
```

### 서버에서 옛날 이미지 삭제

```
    docker rmi $(docker images --filter "dangling=true" -q)
```

### 서버에서 WAS 키기

```
    docker run -d -p 5700:5700 1221jyp/yeolpumta:latest
```

### SSL 인증서 발급

```
    sudo certbot certonly --manual --preferred-challenges=dns -d onamsysteam.com -d www.onamsysteam.com
```

### 구글 oauth 설정 주소

https://console.cloud.google.com/apis/

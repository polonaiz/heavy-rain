FROM mcr.microsoft.com/vscode/devcontainers/base:0-ubuntu-22.04

# timezone
RUN apt-get update && \
    apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    dpkg-reconfigure --frontend noninteractive tzdata

# make
RUN apt-get update && \
    apt-get install -y make vim bash-completion

# docker
 RUN apt update && \
     apt install -y ca-certificates curl && \
     install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc && \
    chmod a+r /etc/apt/keyrings/docker.asc
RUN tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF
RUN apt update && \
    apt install -y docker-ce-cli

# bun
USER vscode
RUN curl -fsSL https://bun.com/install | bash
USER root

# node
RUN apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash - && \
    apt-get install -y nodejs && \
    node -v

# wrk
RUN apt install -y wrk


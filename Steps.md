# Steps To Run Project 

## STEP 1 — Launch EC2 Instance

Go to AWS Console: 

Click `Launch Instance`

- Name: hotel-management-devops
- AMI: Ubuntu Server 24.04 LTS
- Instance type: t3.small

## STEP 2 — Configure Security Group

Allow these inbound ports:

```text
22
80
8080
3000
9090
9100
```
Source: Anywhere IPv4

Connect EC2 Instance
 
## STEP 3 — Install Docker

Run these commands one by one:

```bash
sudo apt update
```

```bash
sudo apt install docker.io docker-compose-v2 -y
```

```bash
sudo systemctl enable docker
```

```bash
sudo systemctl start docker
```

```bash
sudo usermod -aG docker ubuntu
```

Apply group changes:

```bash
newgrp docker
```

Verify installation:

```bash
docker --version
```

```bash
docker compose version
```

## STEP 4 — Clone GitHub Repository

Run:

```bash
git clone https://github.com/Rushi83081/hotel-management-system.git
```
```bash
cd hotel-management-system
```

# STEP 5 — Build Docker Containers

Run:

```bash
docker compose build
```

Wait until build completes successfully.

<img width="1920" height="1080" alt="Screenshot (158)" src="https://github.com/user-attachments/assets/b4aaee65-5ee4-4ffe-b9c8-43513fdd9ce7" />

# STEP 6 — Start All Containers

Run:

```bash
docker compose up -d
```

This command starts:
- frontend
- backend
- mariadb

<img width="1920" height="1080" alt="Screenshot (158)" src="https://github.com/user-attachments/assets/8422848c-80ca-41b0-98d0-585319badbba" />

# STEP 7 — Open Frontend Application

Open browser:

```text
http://YOUR_PUBLIC_IP
```

Frontend application should open successfully.

Test:
- pages loading
- Fill Info & check Record store

<img width="1920" height="1080" alt="Screenshot (159)" src="https://github.com/user-attachments/assets/e85e8060-1f48-46e6-a4f9-ce48f78b1f5b" />

# STEP 8 — Verify GitHub Actions Pipeline

Open GitHub repository.

Go to:
```text
Actions
```

Wait for workflow execution.


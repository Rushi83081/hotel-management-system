# 🚀 Hotel Management System — DevOps Project

A complete DevOps project using:
- AWS EC2
- Docker & Docker Compose
- GitHub Actions CI/CD
- Grafana + Prometheus Monitoring
- Node Exporter Metrics

---

# 📌 STEP 1 — Launch EC2 Instance

Go to AWS Console:

👉 EC2 → Launch Instance

Settings:
- **Name:** hotel-management-devops
- **AMI:** Ubuntu Server 24.04 LTS
- **Instance Type:** t3.small

---

# 🔐 STEP 2 — Configure Security Group

Allow inbound ports:

```text
22   → SSH
80   → Frontend
8080 → Backend
3000 → Grafana
9090 → Prometheus
9100 → Node Exporter
```

Source:
```text
Anywhere IPv4
```

---

# 🐳 STEP 3 — Install Docker

Run:

```bash
sudo apt update

sudo apt install docker.io docker-compose-v2 -y

sudo systemctl enable docker
sudo systemctl start docker

sudo usermod -aG docker ubuntu
newgrp docker

docker --version
docker compose version
```

---

# 📥 STEP 4 — Clone Repository

```bash
git clone https://github.com/Rushi83081/hotel-management-system.git

cd hotel-management-system
```

---

# 🏗️ STEP 5 — Build Project

```bash
docker compose build
```
<img width="1920" height="1080" alt="Screenshot (157)" src="https://github.com/user-attachments/assets/6cb6fb9e-25e8-461c-bfb4-0af4224622bc" />

---

# ▶️ STEP 6 — Run Containers

```bash
docker compose up -d
```

Services:
- Frontend
- Backend
- MariaDB

<img width="1920" height="1080" alt="Screenshot (158)" src="https://github.com/user-attachments/assets/8422848c-80ca-41b0-98d0-585319badbba" />

---

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

---

# ⚡ STEP 8 — GitHub Actions CI/CD

Go to:
```text
GitHub → Actions
```

Check:
- Build success
- Green pipeline

---

# 📊 STEP 9 — Install Grafana

```bash
docker run -d \
--name=grafana \
-p 3000:3000 \
--restart always \
grafana/grafana
```

Open:
```text
http://YOUR_PUBLIC_IP:3000
```

Login:

```text
Username: admin
Password: admin
```
*After that add new password 

---

# 📈 STEP 10 — Install Prometheus

```bash
docker run -d \
--name=prometheus \
-p 9090:9090 \
--restart always \
prom/prometheus
```

Open:
```text
http://YOUR_PUBLIC_IP:9090
```

<img width="1920" height="1080" alt="Screenshot (160)" src="https://github.com/user-attachments/assets/b7a048b5-97bc-4847-bb04-7af869bd84a6" />

---

# 🔗 STEP 11 — Connect Prometheus to Grafana

Grafana → Connections → Data Sources → Add Prometheus

URL:
```text
http://YOUR_PUBLIC_IP:9090
```

Click:
```text
Save & Test
```

<img width="1881" height="898" alt="Screenshot 2026-05-24 115049" src="https://github.com/user-attachments/assets/9ce99271-eb1c-4bd5-a086-543b147e8594" />

---

# 📊 STEP 12 — Create Dashboard

Grafana:
Left sidebar:

```text
Dashboards → Create Dashboard → Add new panel → Configure → Datasource: Prometheus → Metric: up → Click: Run queries
```
Graph should appear.

Click:
```text
Save dashboard
```

<img width="1901" height="899" alt="Screenshot 2026-05-24 115544" src="https://github.com/user-attachments/assets/ae467965-352a-4f46-86de-d44df9b2281a" />

---

# 🖥️ STEP 13 — Install Node Exporter

```bash
docker run -d \
--name=node-exporter \
-p 9100:9100 \
--restart always \
prom/node-exporter
```

Verify container:

```bash
docker ps
```

<img width="1876" height="196" alt="Screenshot 2026-05-24 115728" src="https://github.com/user-attachments/assets/8a799c27-220f-4169-878e-1be3584bb41b" />

---

# ⚙️ STEP 14 — Configure Prometheus

Create file:

```bash
nano prometheus.yml
```

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  - job_name: "node-exporter"
    static_configs:
      - targets: ["YOUR_PUBLIC_IP:9100"]
```
*REPLACE YOUR_PUBLIC_IP 

---

# 🔄 STEP 15 — Restart Prometheus

```bash
docker stop prometheus
docker rm prometheus

docker run -d \
--name=prometheus \
-p 9090:9090 \
--restart always \
-v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
prom/prometheus
```

---

# 📡 STEP 16 — Verify Targets

Open:
```text
http://YOUR_PUBLIC_IP:9090/targets
```

You should see:
- Prometheus → UP
- Node Exporter → UP

<img width="1920" height="1080" alt="Screenshot (163)" src="https://github.com/user-attachments/assets/2bb71cf1-43c1-4770-aa4a-b210f5873524" />

---


# STEP 17 — Add CPU Monitoring Panel

Open Grafana.

Go to:
```text
Dashboards → Your Dashboard → Add new panel → Datasource: Prometheus → Metric: node_cpu_seconds_total → Click: Run queries
```
Graph should appear.

Click:
```text
Apply
```

---

# STEP 18 — Add Memory Monitoring Panel

Again click:
```text
Add new panel → Metric: node_memory_MemAvailable_bytes → Click: Run queries
```
**Click: Save dashboard**

<img width="1898" height="896" alt="Screenshot 2026-05-24 120523" src="https://github.com/user-attachments/assets/12975f14-79fb-489a-9870-4284ba2ddbd0" />

---

---

# 🚀 STEP 19 — Create Deployment Script

Navigate to the project directory:

```bash
cd ~/hotel-management-system
```

Create deployment script:

```bash
nano deploy.sh
```

Paste the following:

```bash
#!/bin/bash

cd ~/hotel-management-system || exit 1

git pull origin main

docker compose down
docker compose up -d --build

docker image prune -f
```

Make the script executable:

```bash
chmod +x deploy.sh
```

Verify deployment script:

```bash
./deploy.sh
```

---

# 🔔 STEP 20 — Create Webhook Server

Create webhook server file:

```bash
nano webhook-server.js
```

Paste:

```javascript
const http = require("http");
const { exec } = require("child_process");

const PORT = 9000;

const server = http.createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/deploy") {
    res.writeHead(404);
    return res.end("Not found");
  }

  exec("./deploy.sh", (error, stdout, stderr) => {
    if (error) {
      console.error(stderr);
      res.writeHead(500);
      return res.end("Deploy failed");
    }

    console.log(stdout);
    res.writeHead(200);
    res.end("Deploy started");
  });
});

server.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
});
```

---

# 📦 STEP 21 — Install Node.js & NPM

Install Node.js and npm:

```bash
sudo apt update
sudo apt install nodejs npm -y
```

Verify installation:

```bash
node -v
npm -v
```

Expected output:

```text
vXX.X.X
X.X.X
```

---

# ▶️ STEP 22 — Start Webhook Server

Start the webhook service:

```bash
nohup node webhook-server.js > webhook.log 2>&1 &
```

Check logs:

```bash
cat webhook.log
```

Expected output:

```text
Webhook server running on port 9000
```

---

# 🔓 STEP 23 — Open Port 9000

In AWS EC2 Security Group add an inbound rule:

```text
Type   : Custom TCP
Port   : 9000
Source : Anywhere IPv4
```

Save the rule.

---

# 🔗 STEP 24 — Configure GitHub Webhook

Open GitHub Repository:

```text
Settings → Webhooks → Add webhook
```

Configure:

```text
Payload URL:
http://YOUR_PUBLIC_IP:9000/deploy

Content Type:
application/json

SSL Verification:
Disable

Events:
Just the push event

Active:
✓ Checked
```

Click:

```text
Add Webhook
```

---

# 🧪 STEP 25 — Test Webhook Deployment

Trigger deployment manually:

```bash
curl -X POST http://YOUR_PUBLIC_IP:9000/deploy
```

Expected response:

```text
Deploy started
```

Check logs:

```bash
tail -50 webhook.log
```

---

# 🔄 STEP 26 — Verify Automatic Deployment

Make a small change in GitHub repository and push to:

```text
main branch
```

Webhook should automatically:

```text
✅ Pull latest code
✅ Rebuild Docker containers
✅ Restart application
```

Verify running containers:

```bash
docker ps
```

---

# 📊 STEP 27 — Verify Monitoring Stack

Check Prometheus Targets:

```text
http://YOUR_PUBLIC_IP:9090/targets
```

Expected:

```text
prometheus     → UP
node-exporter  → UP
```

Open Grafana:

```text
http://YOUR_PUBLIC_IP:3000
```

Login:

```text
Username : admin
Password : admin
```

---

# 📈 STEP 28 — Create Grafana Dashboard

Navigate to:

```text
Dashboards → New Dashboard → Add Visualization
```

Select:

```text
Prometheus Data Source
```

Add panels using:

### Server Availability

```promql
up
```

### CPU Metrics

```promql
node_cpu_seconds_total
```

### Memory Metrics

```promql
node_memory_MemAvailable_bytes
```

Save dashboard as:

```text
Hotel Management Monitoring
```

---

# 🎯 Final Project Features

### ☁️ Cloud & Infrastructure

✅ AWS EC2 Deployment
✅ Linux Administration
✅ Security Group Configuration

### 🐳 Containerization

✅ Docker
✅ Docker Compose

### ⚙️ CI/CD & Automation

✅ GitHub Actions CI/CD
✅ GitHub Webhook Auto Deployment
✅ Automated Container Rebuilds

### 🌐 Application Stack

✅ React Frontend
✅ Spring Boot Backend
✅ MariaDB Database
✅ Nginx Reverse Proxy

### 📊 Monitoring & Observability

✅ Prometheus Monitoring
✅ Grafana Dashboards
✅ Node Exporter Metrics

### 🏨 Hotel Management Features

✅ Room Management
✅ Customer Management
✅ Booking Management
✅ Booking Validation
✅ Room Availability Tracking
✅ Auto Checkout Workflow

---

# 🎉 Project Successfully Deployed

The Hotel Management System is now fully deployed with:

* Automated CI/CD Pipeline
* Auto Deployment using GitHub Webhooks
* Monitoring with Prometheus & Grafana
* Dockerized Full-Stack Architecture
* AWS EC2 Hosting
* Production-Ready Deployment Workflow

# 🚀 END OF PROJECT

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

<img width="1920" height="1080" alt="Screenshot (158)" src="https://github.com/user-attachments/assets/b4aaee65-5ee4-4ffe-b9c8-43513fdd9ce7" />

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

Grafana →  Connections → Data Sources → Add Prometheus

URL:
```text
http://YOUR_PUBLIC_IP:9090
```

Click:
```text
Save & Test
```

---

# 📊 STEP 12 — Create Dashboard

Grafana:
Left sidebar:

```text
Dashboards → New → New Dashboard → Add new panel → Datasource: Prometheus  → Metric: up →  Click: Run queries
```
Graph should appear.

Click:
```text
Save dashboard
```

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
Add new panel → Metric: node_memory_MemAvailable_bytes → Click: Run queries → Click: Save dashboard
```
**Click: Save dashboard**

---

# 🚀 END OF PROJECT

# Docker

## What is it?

Docker is a platform that packages an application together with everything it needs (libraries, dependencies, configuration) into a **container**. This way, the app runs the same on any machine, which ends the "it works on my computer" problem.

## How does it work?

- You write a **Dockerfile**, which is the recipe for building the environment.
- With that file, you build an **image**, which is a read-only template.
- When you run the image, it creates a **container**: an isolated process that shares the host operating system's kernel. This is why it is much lighter than a virtual machine.
- **Docker Engine** builds and runs the containers, and **Docker Hub** is the public repository for images.
- **Docker Compose** starts several containers together from a single YAML file.

```
Dockerfile --(docker build)--> Image --(docker run)--> Container
```

## Where can we use it?

- Microservices architectures
- CI/CD pipelines (like the GitHub Actions pipeline in this project)
- Cloud deployment (AWS, Azure, Google Cloud)
- Running test databases such as PostgreSQL or MySQL without installing them
- Giving the whole team the same development environment

## Who implemented it?

- **Netflix** runs containers at large scale with its own platform, **Titus**.
- **Spotify** was an early adopter and built its own container orchestrator, **Helios**.
- **PayPal** moved thousands of applications to containers to standardize deployments.
- **Uber, Lyft, Shopify, ING and Adobe** use it in their microservices architectures.
- **Cloud providers:** AWS (ECS, EKS), Microsoft Azure and Google Cloud (Cloud Run, GKE) run Docker/OCI containers.
- **DevOps tools:** GitHub Actions, GitLab CI and Jenkins use containers to build and test code.
- **Kubernetes** can orchestrate containers built with Docker.

## Who created it?

- **Solomon Hykes** created Docker at **dotCloud**, a Platform-as-a-Service company he founded in Paris in 2008 with Kamel Founadi and Sebastien Pahl. dotCloud joined the **Y Combinator** accelerator in 2010.
- Docker started as an **internal tool** at dotCloud. Hykes presented it in **March 2013** at **PyCon** (Santa Clara, USA) and released it as **open source** that same month.
- Because of its success, dotCloud changed its name to **Docker, Inc.** in October 2013.

**Timeline:**

| Year | Event |
|------|-------|
| 2013 | Launch. Docker first used LXC (Linux Containers). |
| 2014 | Replaced LXC with its own library, **libcontainer**, written in **Go**. Version 1.0 released. |
| 2015 | Docker and other companies created the **Open Container Initiative (OCI)** with the Linux Foundation. |
| 2017 | The open-source code was renamed the **Moby Project**. |
| 2018 | Solomon Hykes left the company. |
| 2019 | Docker sold its enterprise business to **Mirantis** and focused on developer tools (Docker Desktop, Docker Hub). |

## Our POC

See `back/Dockerfile`, `front/Dockerfile` and `docker-compose.yml`. Two containers (Nginx frontend and Node.js backend) start with one command and talk to each other through a private Docker network.

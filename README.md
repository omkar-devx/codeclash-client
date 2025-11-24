# CodeClash-Client

![CodeClash Frontend Banner](/docs/codeclash-logo.png)

**Realtime collaborative coding frontend** for CodeClash — built with React, CodeMirror, Yjs, TanStack Router/Query, Tailwind CSS and ShadCN UI.

---

[![license](https://img.shields.io/badge/license-MIT-blue)](#license)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Demo](#quick-demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)

---

## Overview

CodeClash-Client is the single-page application that lets users:

- Join realtime collaborative coding rooms
- Edit code live (CRDT powered by Yjs)
- Chat with room participants
- Run/submit code via Judge0 through the backend
- Track progress, bookmarks and achievements

---

## Features

- Realtime collaborative editor (CodeMirror + Yjs)
- Room-based WebSocket chat & presence
- Authentication (JWT access + refresh flow)
- Problem listing, submission, and results view
- Responsive UI with Tailwind + ShadCN components

---

## Quick Demo

- Home → Problem List → Open a problem → Join/Create a room → Code together → Submit to run.
- Authentication uses short-lived access tokens and refresh tokens. See the backend for token endpoints.

![CodeClash Demo](/docs/codeclash-demo.gif)

---s

## Tech Stack

**Frontend**

- React (Vite)
- CodeMirror 6 (editor)
- Yjs + y-websocket (CRDT sync)
- TanStack Router & Query (routing & data fetching)
- Tailwind CSS + ShadCN UI (design system)
- Redux (state)
- Axios (HTTP)
- Recharts (analytics)

**Integration**

- Backend: Node/Express API (Auth, Rooms, Questions, Submissions)
- WebSocket: `wss://.../ws` — chat & presence
- Yjs WebSocket: `wss://.../yjs` or proxied via same domain
- Judge0: via backend API (self-hosted Azure VM)

---

## Getting Started

```bash
# Clone
git clone https://github.com/omkar-devx/codeclash-client.git
cd codeclash-client

# Install
npm i

# Copy .env example
cp .env.example .env

# Run dev server
npm run dev
```

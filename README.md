# Hidders

<div align="center">

![Hidders Banner](https://via.placeholder.com/1200x300?text=Hidders:+The+Unified+Stack)

**One File. One Language. Every Platform.**

[![Rust](https://img.shields.io/badge/built_with-Rust-dca282.svg)](https://www.rust-lang.org/)
[![WASM](https://img.shields.io/badge/target-WebAssembly-654ff0.svg)](https://webassembly.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Prototype_v0.1-orange.svg)]()

</div>

---

## ⚡ Introduction

**Hidders** is an experimental development platform designed to kill "Glue Code."

Modern full-stack development is fragmented. Developers waste 50% of their time managing the space *between* technologies: connecting React to Node, Node to Postgres, and wrapping it all in Docker.

**Hidders unifies this.** You write a single **`.hdr`** file that contains your Database Schema, UI, Styling, and Backend Logic. The Hidders Engine compiles this single file into a high-performance **Rust binary** or **WebAssembly module**.

## 🚀 The Hidders Promise

1.  **Zero Boilerplate:** No `node_modules`. No `webpack.config.js`. No `migrations` folder.
2.  **Native Speed:** Your high-level logic compiles down to raw Rust.
3.  **Universal Targets:** Deploy the same code to the Web (WASM), Desktop (Native), or Embedded devices.

## 📄 The `.hdr` File Format

A Hidders component is a vertical slice of your application. It encapsulates the full lifecycle of a feature.

```html
<!-- user_profile.hdr -->

<model>
    // 1. Database Schema
    // Hidders automatically handles SQL migrations based on this struct.
    table User {
        id: uuid primary key,
        username: string,
        score: u32,
        is_active: bool
    }
</model>

<view>
    <!-- 2. UI Layout -->
    <div class="profile-card">
        <h2>{this.username}</h2>
        <p>Current Score: <span class="highlight">{this.score}</span></p>
        
        <!-- Direct binding to Logic functions -->
        <button onclick="{incrementScore}">Level Up</button>
    </div>
</view>

<style>
    /* 3. Scoped CSS */
    .profile-card {
        background: #222;
        color: white;
        padding: 2rem;
        border-radius: 12px;
    }
    .highlight { color: #00ff00; font-weight: bold; }
</style>

<logic>
    // 4. Business Logic (Compiles to Rust)
    // 'db' is auto-injected based on the <model>
    import { db, console } from '@hidders/std';

    pub fn incrementScore() {
        this.score += 100;
        console.log("Score updated!");
        
        // Persist to database instantly
        db.User.save(this); 
    }
</logic>
````

## 🛠️ Architecture

Hidders is not a framework; it is a **Compiler**.

1.  **Lexer/Parser:** Reads `.hdr` files and separates concerns.
2.  **Transpiler:** Converts high-level `<logic>` syntax into safe, memory-managed **Rust** code using `web-sys` and `wasm-bindgen`.
3.  **Builder:** Orchestrates `cargo` and `wasm-pack` to produce a highly optimized binary.

## 🗺️ Roadmap

  - [x] **v0.1: Core Engine** - Lexer & Parser for `.hdr` files.
  - [x] **v0.1: Web Target** - Basic HTML/CSS injection and Rust WASM compilation.
  - [ ] **v0.2: DOM Hydration** - Intelligent binding of `<view>` events to `<logic>` functions.
  - [ ] **v0.3: Data Layer** - SQLite integration for the `<model>` tag.
  - [ ] **v0.4: Desktop Target** - Integration with Tauri for native binaries.
  - [ ] **v1.0: The Studio** - A specialized IDE for Hidders development.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

-----

<p align="center"\>
Built with 🦀 Rust and a lot of ☕ coffee.
</p\>

# Emoji to PNG

![Version](https://img.shields.io/badge/version-1.0.0-blue) ![Premiere Pro](https://img.shields.io/badge/Premiere%20Pro-CC%202017+-purple) ![After Effects](https://img.shields.io/badge/After%20Effects-CC%202017+-purple) ![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS-lightgrey)

⚡ **One-click emoji importer for Premiere Pro & After Effects**

A free Adobe CEP extension that lets you instantly add **high‑quality emoji PNGs** directly to your timeline.

---

## Features

- 🎨 **Multiple Styles** — Apple, Google, Twitter, and Facebook emoji sets
- 🔍 **Search** — Quickly find any emoji by name
- ⚡ **One‑Click Add** — Instantly imports emoji PNG to your project bin and timeline
- 🎬 **Works in** — Adobe Premiere Pro (CC 2017+) and After Effects (CC 2017+)
- 🌐 **Zero Dependencies** — Pure HTML/CSS/JS, no npm or build step required

---

## Installation

### Option 1: ZXP Installer (Recommended)

1. Download `EmojiToPNG_v1.0.0.zxp` from the [Releases](https://github.com/dapkeakash9/emoji-to-png/releases)
2. Install using [aescripts + aeplugins manager](https://aescripts.com/learn/aescripts-aeplugins-manager-app/) or [ZXP Installer](https://aescripts.com/learn/zxp-installer/)
3. Restart your Adobe application
4. Go to **Window → Extensions → Emoji to PNG**

### Option 2: Manual Install

Copy the extension folder to your CEP extensions directory.

**Windows**

    C:\Users\<username>\AppData\Roaming\Adobe\CEP\extensions\com.antigravity.emojitopng

**macOS**

    ~/Library/Application Support/Adobe/CEP/extensions/com.antigravity.emojitopng

Enable unsigned extensions (for development):

Open Registry Editor and set:

    HKEY_CURRENT_USER\SOFTWARE\Adobe\CSXS.11\PlayerDebugMode = 1

Restart your Adobe application.

---

## Usage

1. Open the panel: **Window → Extensions → Emoji to PNG**
2. Browse or search for an emoji
3. Select a platform style (Apple, Google, Twitter, Facebook)
4. Click the **Add** button
5. The emoji PNG is saved beside your project and imported to the timeline

---

## Compatibility

| Application | Minimum Version |
|---|---|
| Adobe Premiere Pro | CC 2017 (v11.0) |
| Adobe After Effects | CC 2017 (v14.0) |

---

## Building from Source

1. Ensure `tools/ZXPSignCmd.exe` and `tools/cert.p12` are present
2. Run `build.bat` (Windows)
3. The signed `.zxp` will be output to `dist/`

---

## Maintainer

**[@dapkeakash9](https://github.com/dapkeakash9)**
Independent Developer, AI Artist & Motion Graphics Designer

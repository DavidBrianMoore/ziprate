# 🚀 PhantomRate

**PhantomRate** is a high-performance Userscript designed to take back control of your media playback. It combines extreme speed control (up to 16x) with a "Stealth Mode" that tricks websites into thinking you are always active and focused on the page.

## ✨ Features

- **Stealth Mode:** Overrides the Page Visibility API and Focus events. Websites will believe you are always looking at the tab, preventing auto-pausing or quality drops when you switch tabs.
- **Smart-Play:** Automatically starts the "primary" video/audio on the page when you first interact, while intelligently ignoring hidden previews or background ads to avoid overlapping audio.
- **Precision Speed Control:** Fine-tune your playback speed from 0.1x to 16x.
- **Premium UI:** A sleek, glassmorphic overlay that stays out of your way and pulses when you make changes.
- **Shadow DOM Support:** Recursively searches through modern web components to find hidden videos that other speed controllers miss.

## ⌨️ Controls

- **`G`**: Cycle common speeds (1x, 2x, 3x, 4x).
- **`D`**: Increase speed by **+0.1**.
- **`S`**: Decrease speed by **-0.1**.

## 🛠️ Installation

1. Install a Userscript manager like [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
2. Create a new script and paste the contents of `phantom-rate.user.js`.
3. Save and refresh any page with video or audio!

## 📜 License

MIT License - Feel free to use and modify.

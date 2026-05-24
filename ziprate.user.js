// ==UserScript==
// @name         ⚡ ZipRate: Stealth Speed Controller
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Persistent speed control, stealth mode (tricks site focus), and Smart-Play (avoids overlapping audio).
// @author       David Brian Moore
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    console.log("⚡ ZipRate: Initializing...");

    /* 1. STEALTH MODE: Keeps site 'convinced' focus is never lost */
    try {
        Object.defineProperty(document, 'hidden', { value: false, writable: false });
        Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: false });
        document.hasFocus = () => true;
        const block = e => e.stopImmediatePropagation();
        window.addEventListener('visibilitychange', block, true);
        window.addEventListener('blur', block, true);
    } catch(e) { console.log("ZipRate: Stealth Mode Error", e); }

    let currentSpeed = 3.0;
    let activeMedia = new Set();
    const MAX_SPEED = 16.0;
    const MIN_SPEED = 0.1;

    /* 2. UI Setup */
    const overlay = document.createElement("div");
    const initUI = () => {
        overlay.style.cssText = "position:fixed;top:10px;left:10px;padding:4px 8px;background:rgba(0,0,0,0.9);color:#00ffcc;font-family:sans-serif;font-size:11px;font-weight:bold;border-radius:6px;z-index:2147483647;pointer-events:none;transition:all 0.2s;box-shadow:0 4px 16px rgba(0,0,0,0.6);border:1px solid #00ffcc;backdrop-filter:blur(10px);opacity:0;transform:translateY(-10px);";
        document.body.appendChild(overlay);
        updateUI();
    };

    const updateUI = () => {
        if (!overlay.parentElement) return;
        overlay.innerText = `🚀 Speed: ${currentSpeed.toFixed(1)}x`;
        overlay.style.opacity = "1";
        overlay.style.transform = "translateY(0) scale(1.05)";
        overlay.style.borderColor = currentSpeed > 4 ? "#ff3366" : "#00ffcc";
        overlay.style.color = currentSpeed > 4 ? "#ff3366" : "#00ffcc";
        
        setTimeout(() => overlay.style.transform = "translateY(0) scale(1)", 100);
        clearTimeout(window.__speedFadeTimeout);
        window.__speedFadeTimeout = setTimeout(() => overlay.style.opacity = "0", 2000);
    };

    /* 3. Smart-Play Logic: Only auto-play the primary content */
    const getPrimaryMedia = () => {
        let best = null;
        let maxArea = -1;
        activeMedia.forEach(m => {
            const area = (m.offsetWidth * m.offsetHeight) || 1;
            if (area > maxArea) {
                maxArea = area;
                best = m;
            }
        });
        return best;
    };

    const applyTo = e => {
        if (e.tagName === "VIDEO" || e.tagName === "AUDIO") {
            if (!activeMedia.has(e)) {
                activeMedia.add(e);
                e.addEventListener("ratechange", () => { if(e.playbackRate !== currentSpeed) e.playbackRate = currentSpeed; });
                e.addEventListener("play", () => e.playbackRate = currentSpeed);
            }
            e.playbackRate = currentSpeed;
        }
    };

    const scan = (root = document) => {
        root.querySelectorAll("video, audio").forEach(applyTo);
        root.querySelectorAll("*").forEach(e => { if (e.shadowRoot) scan(e.shadowRoot); });
    };

    /* 4. Activation on first user gesture */
    window.addEventListener('click', () => {
        const primary = getPrimaryMedia();
        if (primary) { try { primary.play(); } catch(e) {} }
        updateUI();
    }, { once: true });

    /* 5. Keyboard Controls */
    window.addEventListener("keydown", e => {
        if (["INPUT", "TEXTAREA"].includes(e.target.tagName) || e.target.isContentEditable) return;
        const key = e.key.toLowerCase();
        let changed = false;
        if (key === "g") { currentSpeed = currentSpeed < 2 ? 2 : currentSpeed < 3 ? 3 : currentSpeed < 4 ? 4 : 1; changed = true; }
        else if (key === "f") { currentSpeed = currentSpeed > 3 ? 3 : currentSpeed > 2 ? 2 : currentSpeed > 1 ? 1 : 4; changed = true; }
        else if (key === "d") { currentSpeed = Math.min(MAX_SPEED, currentSpeed + 0.1); changed = true; }
        else if (key === "s") { currentSpeed = Math.max(MIN_SPEED, currentSpeed - 0.1); changed = true; }
        
        if (changed) {
            e.preventDefault(); e.stopImmediatePropagation();
            activeMedia.forEach(m => m.playbackRate = currentSpeed);
            updateUI();
        }
    }, true);

    if (document.body) initUI(); else window.addEventListener('DOMContentLoaded', initUI);

    new MutationObserver(muts => {
        for (let m of muts) for (let n of m.addedNodes) if (n.nodeType === 1) {
            if (n.tagName === "VIDEO" || n.tagName === "AUDIO") applyTo(n); else scan(n);
        }
    }).observe(document.documentElement, { childList: true, subtree: true });

    setInterval(() => {
        scan();
        activeMedia.forEach(m => { if (m.playbackRate !== currentSpeed) m.playbackRate = currentSpeed; });
    }, 1000);
})();

document.addEventListener('DOMContentLoaded', () => {
    // Bookmarklet code string template (with fullscreen compatibility!)
    const bookmarkletCode = `javascript:(function(){try{Object.defineProperty(document,'hidden',{value:false,writable:false});Object.defineProperty(document,'visibilityState',{value:'visible',writable:false});document.hasFocus=()=>true;const block=e=>e.stopImmediatePropagation();window.addEventListener('visibilitychange',block,true);window.addEventListener('blur',block,true)}catch(e){console.log("ZipRate: Stealth Mode Error",e)}if(window.__speedControllerActive)return;window.__speedControllerActive=true;let currentSpeed=3,activeMedia=new Set;const MAX_SPEED=16,MIN_SPEED=0.1;const overlay=document.createElement("div");overlay.style.cssText="position:fixed;top:10px;left:10px;padding:4px 8px;background:rgba(0,0,0,0.9);color:#00ffcc;font-family:sans-serif;font-size:11px;font-weight:bold;border-radius:6px;z-index:2147483647;pointer-events:none;transition:all 0.2s;box-shadow:0 4px 16px rgba(0,0,0,0.6);border:1px solid #00ffcc;backdrop-filter:blur(10px);opacity:0;transform:scale(0.9);";document.body.appendChild(overlay);const updateUI=()=>{const fsElement=document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement;const targetParent=fsElement||document.body;if(overlay.parentElement!==targetParent){targetParent.appendChild(overlay)}overlay.innerText=\`🚀 Speed: \${currentSpeed.toFixed(1)}x\`;overlay.style.opacity="1";overlay.style.transform="scale(1.05)";overlay.style.borderColor=currentSpeed>4?"#ff3366":"#00ffcc";overlay.style.color=currentSpeed>4?"#ff3366":"#00ffcc";setTimeout(()=>overlay.style.transform="scale(1)",100);clearTimeout(window.__speedFadeTimeout);window.__speedFadeTimeout=setTimeout(()=>overlay.style.opacity="0",2000)};document.addEventListener('fullscreenchange',()=>{const fsElement=document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement;const targetParent=fsElement||document.body;if(overlay.parentElement&&overlay.parentElement!==targetParent){targetParent.appendChild(overlay)}});const applyTo=e=>{if(e.tagName==="VIDEO"||e.tagName==="AUDIO"){if(!activeMedia.has(e)){activeMedia.add(e);e.addEventListener("play",()=>e.playbackRate=currentSpeed)}e.playbackRate=currentSpeed}};const scan=(root=document)=>{root.querySelectorAll("video, audio").forEach(applyTo);root.querySelectorAll("*").forEach(e=>{if(e.shadowRoot)scan(e.shadowRoot)})};const handleKey=e=>{if(["INPUT","TEXTAREA"].includes(e.target.tagName)||e.target.isContentEditable)return;const key=e.key.toLowerCase();let changed=false;if(key==="g"){currentSpeed=currentSpeed<2?2:currentSpeed<3?3:currentSpeed<4?4:1;changed=true}else if(key==="a"){currentSpeed=currentSpeed>3?3:currentSpeed>2?2:currentSpeed>1?1:4;changed=true}else if(key==="d"){currentSpeed=Math.min(MAX_SPEED,currentSpeed+0.1);changed=true}else if(key==="s"){currentSpeed=Math.max(MIN_SPEED,currentSpeed-0.1);changed=true}if(changed){e.preventDefault();e.stopImmediatePropagation();activeMedia.forEach(m=>m.playbackRate=currentSpeed);updateUI()}};window.addEventListener("keydown",handleKey,true);new MutationObserver(muts=>{for(let m of muts){for(let n of m.addedNodes){if(n.nodeType===1){if(n.tagName==="VIDEO"||n.tagName==="AUDIO")applyTo(n);else scan(n)}}}}).observe(document.documentElement,{childList:true,subtree:true});scan();setInterval(()=>{activeMedia.forEach(m=>{if(m.playbackRate!==currentSpeed)m.playbackRate=currentSpeed})},400)})()`;

    // Userscript code string template (with fullscreen compatibility!)
    const userscriptTemplate = `// ==UserScript==
// @name         ⚡ ZipRate: Stealth Speed Controller
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Persistent speed control and stealth mode (tricks site focus) with a safe, temporary fullscreen-compatible HUD.
// @author       David Brian Moore
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    console.log("⚡ ZipRate: Initializing (Stealth Mode Active)...");

    /* 1. STEALTH MODE: Keeps site 'convinced' focus is never lost */
    try {
        Object.defineProperty(document, 'hidden', { value: false, writable: false });
        Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: false });
        document.hasFocus = () => true;
        const block = e => e.stopImmediatePropagation();
        window.addEventListener('visibilitychange', block, true);
        window.addEventListener('blur', block, true);
    } catch(e) { console.log("ZipRate: Stealth Mode Error", e); }

    let currentSpeed = {{DEFAULT_SPEED}};
    let activeMedia = new Set();
    const MAX_SPEED = 16.0;
    const MIN_SPEED = 0.1;

    /* 2. UI Setup */
    const overlay = document.createElement("div");
    const initUI = () => {
        overlay.style.cssText = "position:fixed;top:10px;left:10px;padding:4px 8px;background:rgba(0,0,0,0.9);color:#00ffcc;font-family:sans-serif;font-size:11px;font-weight:bold;border-radius:6px;z-index:2147483647;pointer-events:none;transition:all 0.2s;box-shadow:0 4px 16px rgba(0,0,0,0.6);border:1px solid #00ffcc;backdrop-filter:blur(10px);opacity:0;transform:translateY(-10px);";
        document.body.appendChild(overlay);
    };

    const updateUI = () => {
        // Ensure the overlay is attached to the current active fullscreen container if in fullscreen
        const fsElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        const targetParent = fsElement || document.body;
        if (overlay.parentElement !== targetParent) {
            targetParent.appendChild(overlay);
        }

        overlay.innerText = \`🚀 Speed: \${currentSpeed.toFixed(1)}x\`;
        overlay.style.opacity = "1";
        overlay.style.transform = "translateY(0) scale(1.05)";
        overlay.style.borderColor = currentSpeed > 4 ? "#ff3366" : "#00ffcc";
        overlay.style.color = currentSpeed > 4 ? "#ff3366" : "#00ffcc";
        
        setTimeout(() => overlay.style.transform = "translateY(0) scale(1)", 100);
        clearTimeout(window.__speedFadeTimeout);
        window.__speedFadeTimeout = setTimeout(() => overlay.style.opacity = "0", 2000);
    };

    // Keep overlay appended to correct container when switching fullscreen mode
    document.addEventListener('fullscreenchange', () => {
        const fsElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        const targetParent = fsElement || document.body;
        if (overlay.parentElement && overlay.parentElement !== targetParent) {
            targetParent.appendChild(overlay);
        }
    });

    const applyTo = e => {
        if (e.tagName === "VIDEO" || e.tagName === "AUDIO") {
            if (!activeMedia.has(e)) {
                activeMedia.add(e);
                e.addEventListener("play", () => e.playbackRate = currentSpeed);
            }
            e.playbackRate = currentSpeed;
        }
    };

    const scan = (root = document) => {
        root.querySelectorAll("video, audio").forEach(applyTo);
        root.querySelectorAll("*").forEach(e => { if (e.shadowRoot) scan(e.shadowRoot); });
    };

    /* 3. Keyboard Controls */
    window.addEventListener("keydown", e => {
        if (["INPUT", "TEXTAREA"].includes(e.target.tagName) || e.target.isContentEditable) return;
        const key = e.key.toLowerCase();
        let changed = false;
        if (key === "g") { currentSpeed = currentSpeed < 2 ? 2 : currentSpeed < 3 ? 3 : currentSpeed < 4 ? 4 : 1; changed = true; }
        else if (key === "a") { currentSpeed = currentSpeed > 3 ? 3 : currentSpeed > 2 ? 2 : currentSpeed > 1 ? 1 : 4; changed = true; }
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
})();`;

    // Interactive Playground / Simulator Setup
    const video = document.getElementById('demo-video');
    const mockOverlay = document.getElementById('mock-overlay');
    const speedBar = document.getElementById('speed-bar');
    const speedText = document.getElementById('speed-text');
    
    let playgroundSpeed = 1.0;
    const PLAYGROUND_MAX_SPEED = 16.0;
    const PLAYGROUND_MIN_SPEED = 0.1;
    let fadeTimeout = null;

    // Synchronize video elements and slider displays
    const updatePlaygroundSpeed = (speed) => {
        playgroundSpeed = parseFloat(speed);
        if (video) {
            video.playbackRate = playgroundSpeed;
        }

        // Update display text and colors
        speedText.innerText = `${playgroundSpeed.toFixed(1)}x`;
        mockOverlay.innerText = `🚀 Speed: ${playgroundSpeed.toFixed(1)}x`;
        
        const isHigh = playgroundSpeed > 4.0;
        const color = isHigh ? '#ff3366' : '#00ffcc';
        
        speedText.style.color = color;
        speedBar.style.backgroundColor = color;

        if (isHigh) {
            mockOverlay.classList.add('high-speed');
        } else {
            mockOverlay.classList.remove('high-speed');
        }

        // Calculate progress percentage for speed bar
        const percent = ((playgroundSpeed - PLAYGROUND_MIN_SPEED) / (PLAYGROUND_MAX_SPEED - PLAYGROUND_MIN_SPEED)) * 100;
        speedBar.style.width = `${percent}%`;

        // Pulse mock speed overlay
        mockOverlay.classList.add('visible');
        mockOverlay.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            mockOverlay.style.transform = 'scale(1)';
        }, 100);

        clearTimeout(fadeTimeout);
        fadeTimeout = setTimeout(() => {
            mockOverlay.classList.remove('visible');
        }, 2000);
    };

    // Listen to mock video playground focus and keyboard shortcuts
    window.addEventListener('keydown', (e) => {
        if (["INPUT", "TEXTAREA"].includes(e.target.tagName) || e.target.isContentEditable) return;
        
        const key = e.key.toLowerCase();
        let changed = false;
        let newSpeed = playgroundSpeed;

        if (key === 'g') {
            newSpeed = playgroundSpeed < 2 ? 2 : playgroundSpeed < 3 ? 3 : playgroundSpeed < 4 ? 4 : 1;
            changed = true;
        } else if (key === 'a') {
            newSpeed = playgroundSpeed > 3 ? 3 : playgroundSpeed > 2 ? 2 : playgroundSpeed > 1 ? 1 : 4;
            changed = true;
        } else if (key === 'd') {
            newSpeed = Math.min(PLAYGROUND_MAX_SPEED, playgroundSpeed + 0.1);
            changed = true;
        } else if (key === 's') {
            newSpeed = Math.max(PLAYGROUND_MIN_SPEED, playgroundSpeed - 0.1);
            changed = true;
        }

        if (changed) {
            e.preventDefault();
            updatePlaygroundSpeed(newSpeed);
        }
    });

    // Speed Preference Customizer Logic
    const prefSpeedSlider = document.getElementById('pref-speed-slider');
    const prefSpeedDisplay = document.getElementById('pref-speed-display');
    const downloadBtn = document.getElementById('btn-install-script');
    const copyBtn = document.getElementById('copy-bookmarklet');
    const toast = document.getElementById('toast');

    let downloadUrl = null;
    let customizedBookmarklet = bookmarkletCode;

    const updateInstallers = (prefSpeed) => {
        // 1. Update customized Userscript
        const customizedUserscript = userscriptTemplate.replace('{{DEFAULT_SPEED}}', prefSpeed.toFixed(1));
        const blob = new Blob([customizedUserscript], { type: 'text/javascript' });
        
        if (downloadUrl) {
            URL.revokeObjectURL(downloadUrl);
        }
        
        downloadUrl = URL.createObjectURL(blob);
        if (downloadBtn) {
            downloadBtn.href = downloadUrl;
            downloadBtn.download = 'ziprate.user.js';
        }

        // 2. Update customized Bookmarklet
        // Replaces the default `currentSpeed=3` parameter inside the minified block
        customizedBookmarklet = bookmarkletCode.replace('let currentSpeed=3,', `let currentSpeed=${prefSpeed},`);
    };

    if (prefSpeedSlider && prefSpeedDisplay) {
        prefSpeedSlider.addEventListener('input', (e) => {
            const speed = parseFloat(e.target.value);
            prefSpeedDisplay.innerText = `${speed.toFixed(1)}x`;
            
            const isHigh = speed > 4.0;
            if (isHigh) {
                prefSpeedDisplay.classList.add('high-speed');
            } else {
                prefSpeedDisplay.classList.remove('high-speed');
            }
            
            updateInstallers(speed);
        });
    }

    // Bookmarklet Copy Action
    if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(customizedBookmarklet).then(() => {
                showToast('⚡ Pre-configured Bookmarklet copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy: ', err);
                showToast('❌ Copy failed. Please copy manually.');
            });
        });
    }

    const showToast = (message) => {
        if (!toast) return;
        toast.innerText = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    // Initialize display and preconfigured installers
    updatePlaygroundSpeed(1.0);
    updateInstallers(3.0); // Default to 3.0x preconfiguration
});

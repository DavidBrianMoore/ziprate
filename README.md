# ⚡ ZipRate

**ZipRate** is a high-performance Userscript designed to take back control of your media playback. It combines extreme speed control (up to 16x) with a "Stealth Mode" that tricks websites into thinking you are always active and focused on the page.

## ✨ Features

- **Stealth Mode:** Overrides the Page Visibility API and Focus events. Websites will believe you are always looking at the tab, preventing auto-pausing or quality drops when you switch tabs.
- **Smart-Play:** Automatically starts the "primary" video/audio on the page when you first interact, while intelligently ignoring hidden previews or background ads to avoid overlapping audio.
- **Precision Speed Control:** Fine-tune your playback speed from 0.1x to 16x.
- **Premium UI:** A sleek, glassmorphic overlay that stays out of your way and pulses when you make changes.
- **Shadow DOM Support:** Recursively searches through modern web components to find hidden videos that other speed controllers miss.

## ⌨️ Controls

- **`G`**: Cycle common speeds forward (1x ➡️ 2x ➡️ 3x ➡️ 4x).
- **`F`**: Cycle common preset speeds backward / 1x lower (4x ➡️ 3x ➡️ 2x ➡️ 1x).
- **`D`**: Increase speed by **+0.1**.
- **`S`**: Decrease speed by **-0.1**.

## 🛠️ Installation & Setup

You can run ZipRate in one of two ways depending on your workflow:

### Option A: Persistent Userscript (Recommended)
This runs automatically on every website whenever a video or audio element is detected.

1. Install a Userscript manager like [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
2. Create a new script in the manager and paste the contents of [`ziprate.user.js`](https://github.com/DavidBrianMoore/ziprate/blob/main/ziprate.user.js).
3. Save the script and refresh any website playing media.

### Option B: On-Demand Bookmarklet (No Extension Required)
This runs only when clicked, making it highly portable. It includes an interactive overlay you click to gain page focus and bypass browser playback blocks.

1. Copy the minified bookmarklet code below:
    ```javascript
    javascript:(function(){Object.defineProperty(document,'hidden',{value:false,writable:false});Object.defineProperty(document,'visibilityState',{value:'visible',writable:false});document.hasFocus=()=>true;const block=e=>e.stopImmediatePropagation();window.addEventListener('visibilitychange',block,true);window.addEventListener('blur',block,true);if(window.__speedControllerActive)return;window.__speedControllerActive=true;let currentSpeed=3,activeMedia=new Set;const MAX_SPEED=16,MIN_SPEED=0.1;const overlay=document.createElement("div");overlay.style.cssText="position:fixed;top:10px;left:10px;padding:4px 8px;background:rgba(0,0,0,0.9);color:#00ffcc;font-family:sans-serif;font-size:11px;font-weight:bold;border-radius:6px;z-index:2147483647;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 16px rgba(0,0,0,0.6);border:1px solid #00ffcc;backdrop-filter:blur(10px);";overlay.innerText="🚀 Speed: 3.0x (Click to Play & Focus)";document.body.appendChild(overlay);overlay.onclick=()=>{window.focus();document.body.focus();overlay.style.pointerEvents="none";overlay.style.cursor="default";activeMedia.forEach(m=>{try{m.play()}catch(e){console.log("Playback failed:",e)}});updateUI()};const updateUI=()=>{overlay.innerText=`🚀 Speed: ${currentSpeed.toFixed(1)}x`;overlay.style.opacity="1";overlay.style.transform="scale(1.05)";overlay.style.borderColor=currentSpeed>4?"#ff3366":"#00ffcc";overlay.style.color=currentSpeed>4?"#ff3366":"#00ffcc";setTimeout(()=>overlay.style.transform="scale(1)",100);clearTimeout(window.__speedFadeTimeout);window.__speedFadeTimeout=setTimeout(()=>overlay.style.opacity="0",2000)};const applyTo=e=>{if(e.tagName==="VIDEO"||e.tagName==="AUDIO"){if(!activeMedia.has(e)){activeMedia.add(e);e.addEventListener("ratechange",()=>{if(e.playbackRate!==currentSpeed)e.playbackRate=currentSpeed});e.addEventListener("play",()=>e.playbackRate=currentSpeed)}e.playbackRate=currentSpeed}};const scan=(root=document)=>{root.querySelectorAll("video, audio").forEach(applyTo);root.querySelectorAll("*").forEach(e=>{if(e.shadowRoot)scan(e.shadowRoot)})};const handleKey=e=>{if(["INPUT","TEXTAREA"].includes(e.target.tagName)||e.target.isContentEditable)return;const key=e.key.toLowerCase();let changed=false;if(key==="g"){currentSpeed=currentSpeed<2?2:currentSpeed<3?3:currentSpeed<4?4:1;changed=true}else if(key==="f"){currentSpeed=currentSpeed>3?3:currentSpeed>2?2:currentSpeed>1?1:4;changed=true}else if(key==="d"){currentSpeed=Math.min(MAX_SPEED,currentSpeed+0.1);changed=true}else if(key==="s"){currentSpeed=Math.max(MIN_SPEED,currentSpeed-0.1);changed=true}if(changed){e.preventDefault();e.stopImmediatePropagation();activeMedia.forEach(m=>m.playbackRate=currentSpeed);updateUI()}};window.addEventListener("keydown",handleKey,true);new MutationObserver(muts=>{for(let m of muts)for(let n of m.addedNodes)if(n.nodeType===1){if(n.tagName==="VIDEO"||n.tagName==="AUDIO")applyTo(n);else scan(n)}}).observe(document.documentElement,{childList:true,subtree:true});scan();setInterval(()=>{activeMedia.forEach(m=>{if(m.playbackRate!==currentSpeed)m.playbackRate=currentSpeed})},400)})()
    ```
2. Create a new bookmark in your browser (e.g. named `⚡ ZipRate`).
3. Edit the URL/Location of the bookmark and paste the copied code.
4. Click this bookmark on any page with video or audio to activate speed control and Stealth Mode. Full-source is kept in [`ziprate.bookmarklet.js`](https://github.com/DavidBrianMoore/ziprate/blob/main/ziprate.bookmarklet.js).

## 📜 License

MIT License - Feel free to use and modify.

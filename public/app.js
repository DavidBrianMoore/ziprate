document.addEventListener('DOMContentLoaded', () => {
    // Bookmarklet code string
    const bookmarkletCode = `javascript:(function(){Object.defineProperty(document,'hidden',{value:false,writable:false});Object.defineProperty(document,'visibilityState',{value:'visible',writable:false});document.hasFocus=()=>true;const block=e=>e.stopImmediatePropagation();window.addEventListener('visibilitychange',block,true);window.addEventListener('blur',block,true);if(window.__speedControllerActive)return;window.__speedControllerActive=true;let currentSpeed=3,activeMedia=new Set;const MAX_SPEED=16,MIN_SPEED=0.1;const overlay=document.createElement("div");overlay.style.cssText="position:fixed;top:10px;left:10px;padding:4px 8px;background:rgba(0,0,0,0.9);color:#00ffcc;font-family:sans-serif;font-size:11px;font-weight:bold;border-radius:6px;z-index:2147483647;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 16px rgba(0,0,0,0.6);border:1px solid #00ffcc;backdrop-filter:blur(10px);";overlay.innerText="🚀 Speed: 3.0x (Click to Play & Focus)";document.body.appendChild(overlay);overlay.onclick=()=>{window.focus();document.body.focus();overlay.style.pointerEvents="none";overlay.style.cursor="default";activeMedia.forEach(m=>{try{m.play()}catch(e){console.log("Playback failed:",e)}});updateUI()};const updateUI=()=>{overlay.innerText=\`🚀 Speed: \${currentSpeed.toFixed(1)}x\`;overlay.style.opacity="1";overlay.style.transform="scale(1.05)";overlay.style.borderColor=currentSpeed>4?"#ff3366":"#00ffcc";overlay.style.color=currentSpeed>4?"#ff3366":"#00ffcc";setTimeout(()=>overlay.style.transform="scale(1)",100);clearTimeout(window.__speedFadeTimeout);window.__speedFadeTimeout=setTimeout(()=>overlay.style.opacity="0",2000)};const applyTo=e=>{if(e.tagName==="VIDEO"||e.tagName==="AUDIO"){if(!activeMedia.has(e)){activeMedia.add(e);e.addEventListener("ratechange",()=>{if(e.playbackRate!==currentSpeed)e.playbackRate=currentSpeed});e.addEventListener("play",()=>e.playbackRate=currentSpeed)}e.playbackRate=currentSpeed}};const scan=(root=document)=>{root.querySelectorAll("video, audio").forEach(applyTo);root.querySelectorAll("*").forEach(e=>{if(e.shadowRoot)scan(e.shadowRoot)})};const handleKey=e=>{if(["INPUT","TEXTAREA"].includes(e.target.tagName)||e.target.isContentEditable)return;const key=e.key.toLowerCase();let changed=false;if(key==="g"){currentSpeed=currentSpeed<2?2:currentSpeed<3?3:currentSpeed<4?4:1;changed=true}else if(key==="a"){currentSpeed=currentSpeed>3?3:currentSpeed>2?2:currentSpeed>1?1:4;changed=true}else if(key==="d"){currentSpeed=Math.min(MAX_SPEED,currentSpeed+0.1);changed=true}else if(key==="s"){currentSpeed=Math.max(MIN_SPEED,currentSpeed-0.1);changed=true}if(changed){e.preventDefault();e.stopImmediatePropagation();activeMedia.forEach(m=>m.playbackRate=currentSpeed);updateUI()}};window.addEventListener("keydown",handleKey,true);new MutationObserver(muts=>{for(let m of muts)for(let n of m.addedNodes)if(n.nodeType===1){if(n.tagName==="VIDEO"||n.tagName==="AUDIO")applyTo(n);else scan(n)}}).observe(document.documentElement,{childList:true,subtree:true});scan();setInterval(()=>{activeMedia.forEach(m=>{if(m.playbackRate!==currentSpeed)m.playbackRate=currentSpeed})},400)})()`;

    // Interactive Playground / Simulator Setup
    const video = document.getElementById('demo-video');
    const mockOverlay = document.getElementById('mock-overlay');
    const speedBar = document.getElementById('speed-bar');
    const speedText = document.getElementById('speed-text');
    
    let currentSpeed = 1.0;
    const MAX_SPEED = 16.0;
    const MIN_SPEED = 0.1;
    let fadeTimeout = null;

    // Synchronize video elements and slider displays
    const updatePlaygroundSpeed = (speed) => {
        currentSpeed = parseFloat(speed);
        if (video) {
            video.playbackRate = currentSpeed;
        }

        // Update display text and colors
        speedText.innerText = `${currentSpeed.toFixed(1)}x`;
        mockOverlay.innerText = `🚀 Speed: ${currentSpeed.toFixed(1)}x`;
        
        const isHigh = currentSpeed > 4.0;
        const color = isHigh ? '#ff3366' : '#00ffcc';
        
        speedText.style.color = color;
        speedBar.style.backgroundColor = color;

        if (isHigh) {
            mockOverlay.classList.add('high-speed');
        } else {
            mockOverlay.classList.remove('high-speed');
        }

        // Calculate progress percentage for speed bar
        // Scale 0.1x to 16x as 0% to 100%
        const percent = ((currentSpeed - MIN_SPEED) / (MAX_SPEED - MIN_SPEED)) * 100;
        speedBar.style.width = `${percent}%`;

        // Pulse mock speed overlay (matches top-left display behavior!)
        mockOverlay.classList.add('visible');
        mockOverlay.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            mockOverlay.style.transform = 'scale(1)';
        }, 100);

        clearTimeout(fadeTimeout);
        fadeTimeout = setTimeout(() => {
            mockOverlay.classList.remove('visible');
        }, 2000); // Fades out exactly after 2 seconds
    };

    // Listen to mock video playground focus and keyboard shortcuts
    const playgroundContainer = document.getElementById('playground-card');
    
    window.addEventListener('keydown', (e) => {
        // Only trigger if focus isn't in forms or inputs
        if (["INPUT", "TEXTAREA"].includes(e.target.tagName) || e.target.isContentEditable) return;
        
        const key = e.key.toLowerCase();
        let changed = false;
        let newSpeed = currentSpeed;

        if (key === 'g') {
            newSpeed = currentSpeed < 2 ? 2 : currentSpeed < 3 ? 3 : currentSpeed < 4 ? 4 : 1;
            changed = true;
        } else if (key === 'a') {
            newSpeed = currentSpeed > 3 ? 3 : currentSpeed > 2 ? 2 : currentSpeed > 1 ? 1 : 4;
            changed = true;
        } else if (key === 'd') {
            newSpeed = Math.min(MAX_SPEED, currentSpeed + 0.1);
            changed = true;
        } else if (key === 's') {
            newSpeed = Math.max(MIN_SPEED, currentSpeed - 0.1);
            changed = true;
        }

        if (changed) {
            e.preventDefault();
            updatePlaygroundSpeed(newSpeed);
        }
    });

    // Bookmarklet Copy Action
    const copyBtn = document.getElementById('copy-bookmarklet');
    const toast = document.getElementById('toast');

    if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(bookmarkletCode).then(() => {
                showToast('⚡ Bookmarklet code copied to clipboard!');
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

    // Initialize display
    updatePlaygroundSpeed(1.0);
});

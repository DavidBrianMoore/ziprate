javascript:(function(){
    /* 1. STEALTH MODE */
    try {
        Object.defineProperty(document, 'hidden', { value: false, writable: false });
        Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: false });
        document.hasFocus = () => true;
        const block = e => e.stopImmediatePropagation();
        window.addEventListener('visibilitychange', block, true);
        window.addEventListener('blur', block, true);
    } catch(e) { console.log("ZipRate: Stealth Mode Error", e); }

    if (window.__speedControllerActive) return;
    window.__speedControllerActive = true;

    let currentSpeed = 3.0;
    let activeMedia = new Set();
    const MAX_SPEED = 16.0;
    const MIN_SPEED = 0.1;

    const logSpeed = () => {
        console.log(`⚡ ZipRate Speed: ${currentSpeed.toFixed(1)}x`);
    };

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

    const handleKey = e => {
        if (["INPUT", "TEXTAREA"].includes(e.target.tagName) || e.target.isContentEditable) return;
        
        const key = e.key.toLowerCase();
        let changed = false;
        
        if (key === "g") {
            currentSpeed = currentSpeed < 2 ? 2 : currentSpeed < 3 ? 3 : currentSpeed < 4 ? 4 : 1;
            changed = true;
        } else if (key === "a") {
            currentSpeed = currentSpeed > 3 ? 3 : currentSpeed > 2 ? 2 : currentSpeed > 1 ? 1 : 4;
            changed = true;
        } else if (key === "d") {
            currentSpeed = Math.min(MAX_SPEED, currentSpeed + 0.1);
            changed = true;
        } else if (key === "s") {
            currentSpeed = Math.max(MIN_SPEED, currentSpeed - 0.1);
            changed = true;
        }
        
        if (changed) {
            e.preventDefault();
            e.stopImmediatePropagation();
            activeMedia.forEach(m => m.playbackRate = currentSpeed);
            logSpeed();
        }
    };

    window.addEventListener("keydown", handleKey, true);

    new MutationObserver(muts => {
        for (let m of muts) {
            for (let n of m.addedNodes) {
                if (n.nodeType === 1) {
                    if (n.tagName === "VIDEO" || n.tagName === "AUDIO") applyTo(n);
                    else scan(n);
                }
            }
        }
    }).observe(document.documentElement, { childList: true, subtree: true });

    scan();

    setInterval(() => {
        activeMedia.forEach(m => { if (m.playbackRate !== currentSpeed) m.playbackRate = currentSpeed; });
    }, 400);
})();

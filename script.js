document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const messageList = document.getElementById('message-list');
    const appContainer = document.getElementById('app-container');
    const fixingOverlay = document.getElementById('fixing-overlay');
    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('start-demo-btn');
    const fixBtn = document.getElementById('fix-btn');

    let hasCrashed = false;

    function addMessage(text, isUser = false, isError = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isUser ? 'user' : 'ai'}`;

        const bubble = document.createElement('div');
        bubble.className = `bubble ${isError ? 'error-bubble' : ''}`;
        bubble.textContent = text;

        msgDiv.appendChild(bubble);
        messageList.appendChild(msgDiv);
        messageList.scrollTop = messageList.scrollHeight;
        return msgDiv;
    }

    function addLoading() {
        if (document.getElementById('loading-bubble')) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = 'message ai';
        msgDiv.id = 'loading-bubble';

        const bubble = document.createElement('div');
        bubble.className = 'bubble';

        const dots = document.createElement('div');
        dots.className = 'typing-dots';
        dots.innerHTML = '<span></span><span></span><span></span>';

        bubble.appendChild(dots);
        msgDiv.appendChild(bubble);
        messageList.appendChild(msgDiv);
        messageList.scrollTop = messageList.scrollHeight;
        return msgDiv;
    }

    function removeLoading() {
        const loading = document.getElementById('loading-bubble');
        if (loading) loading.remove();
    }

    function triggerFreeze() {
        if (hasCrashed) return;
        hasCrashed = true;

        const loading = document.getElementById('loading-bubble');
        if (loading) {
            loading.classList.add('paused');
        }

        input.disabled = true;
        sendBtn.disabled = true;
        appContainer.style.cursor = 'not-allowed';
    }

    function runScenario() {
        // T+1s: Auto send "HI"
        setTimeout(() => {
            addMessage("HI", true);

            // T+2s: AI Loading
            setTimeout(() => {
                addLoading();

                // T+5s: Timeout Error
                setTimeout(() => {
                    removeLoading();
                    addMessage('Error 504: Request timed out.', false, true);

                    // T+10s: Show Fix Button (Manual Trigger, 5s after error)
                    setTimeout(() => {
                        if (fixBtn) fixBtn.classList.remove('hidden');
                    }, 5000);

                }, 3000);
            }, 1000);
        }, 1000);
    }

    // Connect Start Button
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            startScreen.classList.add('hidden');
            runScenario();
        });
    }

    // Connect Fix Button
    if (fixBtn) {
        fixBtn.addEventListener('click', () => {
            fixBtn.classList.add('hidden');

            // Start Fixing Sequence
            fixingOverlay.classList.remove('hidden');

            // T+4s (relative to click): Fixing Done & New Session
            setTimeout(() => {
                fixingOverlay.classList.add('hidden');
                messageList.innerHTML = ''; // Clear chat

                // T+5s: User sends "HI" again
                setTimeout(() => {
                    addMessage("HI", true);

                    // T+6s: AI Loading
                    setTimeout(() => {
                        addLoading();

                        // T+9s: FREEZE
                        setTimeout(() => {
                            triggerFreeze();
                        }, 3000);

                    }, 1000);
                }, 1000);

            }, 4000); // Fixing duration
        });
    }
});

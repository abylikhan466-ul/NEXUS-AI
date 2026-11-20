
const ChatEngine = {
    conversations: [],
    currentChatId: null,
    messages: [],
    isTyping: false,

    init() {
        this.conversations = NEXUS_STORAGE.get(
            "nexus_conversations",
            []
        );

        if (!Array.isArray(this.conversations)) {
            this.conversations = [];
        }

        this.bindEvents();

        if (this.conversations.length > 0) {
            this.openChat(this.conversations[0].id);
        } else {
            this.renderMessages();
            this.renderHistory();
        }
    },

    save() {
        NEXUS_STORAGE.save(
            "nexus_conversations",
            this.conversations
        );
    },

    bindEvents() {
        const sendBtn = document.getElementById("sendBtn");
        const input = document.getElementById("userInput");
        const history = document.getElementById("chatHistory");

        sendBtn.addEventListener("click", () => {
            this.send();
        });

        input.addEventListener("keydown", event => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                this.send();
            }
        });

        history.addEventListener("click", event => {
            const item = event.target.closest("[data-chat-id]");

            if (item) {
                this.openChat(item.dataset.chatId);
                closeSidebar();
            }
        });
    },

    newChat() {
        this.currentChatId = null;
        this.messages = [];
        this.isTyping = false;

        document.getElementById("userInput").value = "";

        this.hideTyping();
        this.renderMessages();
        this.renderHistory();

        document.getElementById("userInput").focus();
        closeSidebar();
    },

    createChat() {
        const chat = {
            id: Date.now().toString() +
                Math.random().toString(36).slice(2, 7),
            title: "Жаңа чат",
            messages: [],
            date: new Date().toISOString()
        };

        this.conversations.unshift(chat);
        this.currentChatId = chat.id;
        this.messages = chat.messages;

        this.save();
        this.renderHistory();

        return chat;
    },

    openChat(id) {
        const chat = this.conversations.find(
            item => item.id === id
        );

        if (!chat) return;

        this.currentChatId = id;
        this.messages = chat.messages || [];
        this.isTyping = false;

        this.hideTyping();
        this.renderMessages();
        this.renderHistory();
    },

    async send() {
        const input = document.getElementById("userInput");
        const text = input.value.trim();

        if (!text || this.isTyping) return;

        let chat = this.getCurrentChat();

        if (!chat) {
            chat = this.createChat();
        }

        const chatId = chat.id;

        input.value = "";
        input.style.height = "auto";

        chat.messages.push({
            role: "user",
            text: text
        });

        if (chat.messages.length === 1) {
            chat.title = text.length > 30
                ? text.slice(0, 30) + "..."
                : text;
        }

        this.messages = chat.messages;

        this.save();
        this.renderMessages();
        this.renderHistory();

        this.isTyping = true;
        this.showTyping();

        try {
            const history = chat.messages.slice(0, -1);

            const answer = await NEXUS_AI.respond(
                text,
                history
            );

            chat.messages.push({
                role: "assistant",
                text: answer
            });

            this.save();

        } catch (error) {
            console.error("NEXUS AI қатесі:", error);

            chat.messages.push({
                role: "assistant",
                text: "Қате: " + (error.message || "Белгісіз қате")
            });

            this.save();

        } finally {
            if (this.currentChatId === chatId) {
                this.messages = chat.messages;
                this.hideTyping();
                this.renderMessages();
            }

            this.isTyping = false;
        }
    },

    getCurrentChat() {
        return this.conversations.find(
            item => item.id === this.currentChatId
        );
    },

    renderMessages() {
        const container = document.getElementById("messages");
        const welcome = document.getElementById("welcome");

        container.innerHTML = "";

        welcome.style.display =
            this.messages.length === 0 ? "block" : "none";

        this.messages.forEach(message => {
            const wrapper = document.createElement("div");
            wrapper.className = "message " + message.role;

            const content = document.createElement("div");
            content.className = "message-content";
            content.textContent = message.text;

            wrapper.appendChild(content);
            container.appendChild(wrapper);
        });

        this.scrollToBottom();
    },

    showTyping() {
        this.hideTyping();

        const wrapper = document.createElement("div");
        wrapper.id = "typingIndicator";
        wrapper.className = "message assistant";

        const content = document.createElement("div");
        content.className = "message-content";
        content.textContent = "NEXUS AI жауап дайындап жатыр...";

        wrapper.appendChild(content);

        document.getElementById("messages").appendChild(wrapper);
        this.scrollToBottom();
    },

    hideTyping() {
        const typing = document.getElementById("typingIndicator");

        if (typing) {
            typing.remove();
        }
    },

    renderHistory() {
        const history = document.getElementById("chatHistory");
        history.innerHTML = "";

        if (this.conversations.length === 0) {
            const empty = document.createElement("p");
            empty.className = "empty-history";
            empty.textContent = "Әзірге чат жоқ";
            history.appendChild(empty);
            return;
        }

        this.conversations.forEach(chat => {
            const item = document.createElement("button");

            item.className = "history-item" +
                (chat.id === this.currentChatId ? " active" : "");

            item.dataset.chatId = chat.id;
            item.textContent = chat.title || "Жаңа чат";

            history.appendChild(item);
        });
    },

    scrollToBottom() {
        const area = document.getElementById("chatArea");

        requestAnimationFrame(() => {
            area.scrollTop = area.scrollHeight;
        });
    }
};

ChatEngine.init();

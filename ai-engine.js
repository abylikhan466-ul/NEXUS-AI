
const NEXUS_AI = {
    initialized: false,

    API_URL: "https:/nexus-ai-server.abylikhan466.workers.dev/chat",

    init() {
        this.initialized = true;
        console.log("NEXUS AI Engine дайын");
    },

    async respond(message, history = []) {
        const messages = [
            ...history.map(item => ({
                role: item.role,
                content: item.text
            })),
            {
                role: "user",
                content: message
            }
        ];

        const response = await fetch(this.API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: messages
            })
        });

        let data;

        try {
            data = await response.json();
        } catch {
            throw new Error("Сервер JSON жауабын қайтармады");
        }

        if (!response.ok) {
            throw new Error(
                data.error || "HTTP қатесі: " + response.status
            );
        }

        const answer =
            data.choices?.[0]?.message?.content ||
            data.reply ||
            data.answer;

        if (!answer) {
            throw new Error("AI жауабы бос");
        }

        return answer;
    }
};

NEXUS_AI.init();

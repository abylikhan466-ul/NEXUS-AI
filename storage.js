
const NEXUS_STORAGE = {
    save(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error("Сақтау қатесі:", error);
            return false;
        }
    },

    get(key, fallback = null) {
        try {
            const value = localStorage.getItem(key);
            return value !== null ? JSON.parse(value) : fallback;
        } catch (error) {
            console.error("Оқу қатесі:", error);
            return fallback;
        }
    },

    remove(key) {
        localStorage.removeItem(key);
    }
};

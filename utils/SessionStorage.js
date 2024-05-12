// SessionStorage.js

class SessionStorage {
    constructor() {
        this.storage = {};
    }

    setUserSession(sessionId, userId) {
        this.storage[sessionId] = { userId };
    }

    getUserSession(sessionId) {
        return this.storage[sessionId];
    }

    clearUserSession(sessionId) {
        delete this.storage[sessionId];
    }
}

module.exports = new SessionStorage(); // Export as a singleton

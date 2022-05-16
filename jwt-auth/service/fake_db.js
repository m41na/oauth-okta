const users = [
    {
        id: 1,
        username: 'john',
        password: 'john_123',
        isAdmin: true,
        refreshToken: null,
        refreshTokenSecret: null,
        accessTokenSecret: null,
    },
    {
        id: 2,
        username: 'jane',
        password: 'jane_456',
        isAdmin: false,
        refreshToken: null,
        refreshTokenSecret: null,
        accessTokenSecret: null,
    }
]

function AccessKeys() {

    this.accessTokens = [];

    this.add = (id, accessToken, accessTokenSecret, refreshToken, refreshTokenSecret) => {
        this.accessTokens.push(accessToken);
        const user = users.find(u => u.id == id);
        if (user) {
            user.refreshToken = refreshToken;
            user.accessTokenSecret = accessTokenSecret;
            user.refreshTokenSecret = refreshTokenSecret;
        }
    }

    this.remove = (key) => {
        const idx = this.accessTokens.indexOf(key);
        if (idx > -1) {
            let removed = this.accessTokens.splice(idx, 1);
            const userIdx = users.findIndex(u => u.accessToken === removed[0]);
            removed = users.splice(userIdx, 1);
            return removed.length === 1;
        }
    }

    this.indexOf = (key) => {
        return this.accessTokens.findIndex(key);
    }
}

module.exports = {
    users,
    accessKeys: new AccessKeys()
}
const fs = require('fs/promises');

class Io {
    #dir
    constructor(dir) {
        this.#dir = dir;
    }

    async write(data) {
        await fs.writeFile(this.#dir, JSON.stringify(data, null, 2), 'utf8');
    }

    async read() {
        const data = await fs.readFile(this.#dir, 'utf8');
        const result = data ? JSON.parse(data) : []
        return result
    }
}

module.exports = Io;
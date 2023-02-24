import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {

    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf8')
            .then(data => this.#database = JSON.parse(data))
            .catch(() => {
                this.#persist()
            })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table, search) {
        let data = this.#database[table] ?? []

        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].includes(value)
                })
            })
        }

        return data

    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist()

        return data
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
        }

        this.#persist()

    }

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            const row = this.#database[table][rowIndex]
            this.#database[table][rowIndex] = { id, completed_at: data.completed_at ?? row.completed_at, created_at: row.created_at, updated_at: new Date(), title: data.title ?? row.title, description: data.description ?? row.description }
            this.#persist()
        }

    }

}
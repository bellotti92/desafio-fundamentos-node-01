import { parse } from "csv-parse";
import fs from 'node:fs'

const csvPath = new URL('./tasks.csv', import.meta.url)

const startProcess = async () => {

    const parser = fs.createReadStream(csvPath).pipe(parse({
        delimiter: ",",
        skipEmptyLines: true,
        fromLine: 2
    }))

    parser.on('error', (err) => {
        console.log(err)
    })

    for await (const data of parser) {

        const [title, description] = data

        await fetch("http://localhost:8080/tasks", {
            method: "POST",
            body: JSON.stringify({ title, description })
        })

    }

}

startProcess()
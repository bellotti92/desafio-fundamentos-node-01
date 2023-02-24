import { Database } from "./database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
    {
        method: "GET",
        path: buildRoutePath("/tasks"),
        handler: (req, res) => {
            const { filter } = req.query
            const decoded = decodeURIComponent(filter)
            const filterCriteria = filter ? {
                title: decoded,
                description: decoded
            } : null

            const tasks = database.select('tasks', filterCriteria)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: "POST",
        path: buildRoutePath("/tasks"),
        handler: (req, res) => {

            if (!req.body)
                return res.writeHead(400).end(JSON.stringify('title and description fields are required.'))

            const { title, description } = req.body

            if (!title)
                return res.writeHead(400).end(JSON.stringify('title field is required.'))
            if (!description)
                return res.writeHead(400).end(JSON.stringify('description field is required.'))

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date()
            }

            database.insert('tasks', task)

            return res
                .writeHead(201)
                .end(JSON.stringify('Task createad.'))
        }
    },
    {
        method: "DELETE",
        path: buildRoutePath("/tasks/:id"),
        handler: (req, res) => {
            const { id } = req.params

            const [task] = database.select('tasks', { id })
            if (!task)
                return res.writeHead(404).end(JSON.stringify('Task not found.'))
            database.delete('tasks', id)
            res.writeHead(204).end()
        }
    },
    {
        method: "PUT",
        path: buildRoutePath("/tasks/:id"),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body
            const [task] = database.select('tasks', { id })
            if (!task)
                return res.writeHead(404).end(JSON.stringify('Task not found.'))
            database.update('tasks', id, { title, description })
            res.writeHead(204).end(JSON.stringify('Task updated.'))
        }
    },
    {
        method: "PATCH",
        path: buildRoutePath("/tasks/:id/complete"),
        handler: (req, res) => {
            const { id } = req.params
            const [task] = database.select('tasks', { id })

            if (!task)
                return res.writeHead(404).end(JSON.stringify('Task not found.'))

            if (task.completed_at)
                return res.writeHead(204).end(JSON.stringify('Task already completed.'))

            database.update('tasks', id, { completed_at: new Date() })
            res.writeHead(204).end(JSON.stringify('Task completed.'))
        }
    }
]
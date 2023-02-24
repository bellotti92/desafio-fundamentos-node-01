//middlewares -> interceptadores ( executam antes das requisições de fato. No exemplo, trata o body recebendo os dados via stream )

export async function json(req, res) {
    const buffers = []

    for await (const chunk of req) {
        buffers.push(chunk)
    }

    try {
        req.body = JSON.parse(Buffer.concat(buffers).toString())
    } catch {
        req.body = null
    }

    res.setHeader('Content-type', 'application/json; charset=windows-1252')

}

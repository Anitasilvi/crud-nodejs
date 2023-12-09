const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'nodejs-crud'
})

app.get('', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT * from task', (err, rows) => {
            connection.release()
            if(!err){
                res.send(rows)
            }else{
                console.log(err)
            }
        })
    })
})

app.get('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT * from task WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release()
            if(!err){
                res.send(rows)
            }else{
                console.log(err)
            }
        })
    })
})

app.delete('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('DELETE from task WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release()
            if(!err){
                res.send(`Task with the record id: ${[req.params.id]} has been removed`)
            }else{
                console.log(err)
            }
        })
    })
})

app.post('', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const params = req.body

        connection.query('INSERT INTO task SET ?', params, (err, rows) => {
            connection.release()
            if(!err){
                res.send(`Task with the name: ${params.name} has been added`)
            }else{
                console.log(err)
            }
        })
        console.log(req.err)
    })
})

app.put('', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const {id, name, tagline, description, image} = req.body

        connection.query('UPDATE task SET name = ?, tagline = ?, description = ?, image = ? WHERE id = ?', [name, tagline, description, image, id], (err, rows) => {
            connection.release()
            if(!err){
                res.send(`Task with the name: ${name} has been added`)
            }else{
                console.log(err)
            }
        })
        console.log(req.body)
    })
})

app.listen(port, () => console.log(`Listen on port ${port}`))
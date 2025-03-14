import mysql from 'mysql'
import cors from 'cors'
import express from 'express'
import multer from 'multer'

import { PORT, SALT_ROUNDS, SECRET_JWT_KEY } from './config.js'
import bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())
const storage = multer.memoryStorage()
const upload = multer({ storage })

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'php_login_database'
})

// Login de usuario

app.post('/login', async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  try {
    db.query(
      'SELECT * FROM users WHERE email = ?', [email],
      (err, result) => {
        if (result.length === 0) {
          console.log(err)
          return res.status(404).json({ error: 'Usuario no encontrado' })
        } else {
          const isMatch = bcrypt.compareSync(password, result[0].password)
          if (isMatch) {
            const token = jwt.sign({ id: result[0].id, email: result[0].email, username: result[0].user, admin: result[0].admin }, SECRET_JWT_KEY, {
              expiresIn: '10h'
            })
            res.cookie('access_token', token, {
              httpOnly: false,
              secure: false,
              maxAge: 10000 * 60 * 60
            }).send({ success: true })
          } else {
            console.log('Contraseña incorrecta')
            res.send({ success: false })
          }
        }
      }
    )
  } catch (error) {
    res.status(401).send(error.message)
  }
})

// Cerrar sesion

app.post('/logout', (req, res) => {
  res.clearCookie('access_token')
  res.send({ success: true })
})

// Obtener Sesion

app.get('/getCookie', (req, res) => {
  const token = req.cookies.access_token

  try {
    const data = jwt.verify(token, SECRET_JWT_KEY)
    res.send(data)
  } catch (error) {
    res.send(error)
  }
})

// app.get('/protected', (req, res) => {
//   const token = req.cookies.access_token

//   try {
//     data = jwt.verify(token, SECRET_JWT_KEY)
//   } catch (error) {
//     res.status(401).send('Access not authorized')
//   }
// })

// Registrar usuario

app.post('/register', (req, res) => {
  const { user, email, password } = req.body.formData
  const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS)
  try {
    db.query(
      'SELECT email FROM users WHERE email = ?',
      [email],
      (err, result) => {
        if (result.length === 0) {
          db.query(
            'INSERT INTO users(user, email, password) VALUES(?, ?, ?)',
            [user, email, hashedPassword],
            (err, result) => {
              if (err) {
                console.log(err, 'bacano')
                res.send({ success: false })
              } else {
                const token = jwt.sign({ id: result.insertId, email: req.body.formData.email, username: req.body.formData.user }, SECRET_JWT_KEY, {
                  expiresIn: '10h'
                })
                res.cookie('access_token', token, {
                  httpOnly: false,
                  secure: false
                }).send({ success: true })
              }
            })
        } else {
          console.log(err)
          res.send({ success: false })
        }
      }
    )
  } catch (error) {
    console.log(error)
  }
})

// Obtener las publicaciones de la BD

app.get('/publicaciones', (req, res) => {
  db.query(
    'SELECT u.user, u.avatar, p.* FROM publicaciones p INNER JOIN users u ON p.user_id = u.id ORDER BY id DESC',
    (err, result) => {
      if (err) {
        console.log(err)
        res.status(500).send({ success: false, message: 'Error al recuperar las publicaciones' })
      } else {
        // Convertir las imágenes a base64
        result = result.map(post => {
          if (post.image) {
            post.avatar = post.avatar.toString('base64')
            post.image = post.image.toString('base64')
          }
          return post
        })
        res.send({ success: true, result })
      }
    }
  )
})

// Crear Publicacion

app.post('/post/sendPost', upload.single('imagePreview'), (req, res) => {
  const userID = JSON.parse(req.body.sessionData).id
  const description = req.body.description
  const image = req.file ? req.file.buffer : ''

  db.query('INSERT INTO publicaciones (user_id, description, image) VALUES (?, ?, ?)',
    [userID, description, image],
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send({ result, success: true, description })
      }
    }
  )
})

// Eliminar Publicacion

app.post('/post/deletePost', (req, res) => {
  const postID = req.body.id
  try {
    db.query('DELETE FROM publicaciones WHERE id = ?',
      [postID],
      (err, result) => {
        if (err) {
          console.log(err)
        } else {
          res.send(result)
        }
      }
    )
    db.query('DELETE FROM publicacion_interaccion WHERE publicacion = ?',
      [postID],
      (err, result) => {
        if (err) {
          console.log(err)
        } else {
          console.log(result)
        }
      }
    )
  } catch (error) {
    console.log('Error en la BD ', error)
  }
})

// Interaction

app.get('/interact/getInteractionLike', (req, res) => {
  const id = req.query.id
  const user = req.query.userID
  db.query('SELECT * FROM publicacion_interaccion WHERE publicacion = ? AND user = ? AND tipo = 1',
    [id, user],
    (err, result) => {
      if (result.length !== 0) {
        res.send({ success: true, result })
      } else {
        res.send({ success: false, err })
      }
    }
  )
})

app.post('/interact/like', (req, res) => {
  const id = req.body.id
  const like = req.body.like
  const user = req.body.userID
  try {
    db.query('SELECT * FROM publicacion_interaccion WHERE user = ? AND tipo = 1 AND publicacion = ?',
      [user, id],
      (err, result) => {
        if (result.length !== 0) {
          db.query('UPDATE publicacion_interaccion SET content = ? WHERE user = ? AND tipo = 1 AND publicacion = ?',
            [like, user, id],
            (err, result) => {
              if (err) {
                console.log(err)
              } else {
                console.log(result)
              }
            }
          )
        } else {
          console.log(err)
          db.query('INSERT INTO publicacion_interaccion (user, tipo, content, publicacion) VALUES (?, 1, 1, ?)',
            [user, id],
            (err, result) => {
              if (err) {
                console.log(err)
              } else {
                console.log(result)
              }
            }
          )
        }
      }
    )
    db.query('SELECT megusta FROM publicaciones WHERE id = ?',
      [id],
      (err, result) => {
        if (result.length !== 0) {
          const postLike = result[0].megusta + like
          db.query('UPDATE publicaciones SET megusta = ? WHERE id = ?',
            [postLike, id],
            (err, result) => {
              if (err) {
                console.log(err)
              } else {
                res.send({ postLike })
              }
            }
          )
        } else {
          console.log(err)
        }
      }
    )
  } catch (error) {
    console.log('error en la BD' + error)
  }
})

app.listen(PORT, () => {
  console.log('Corriendo en el puerto', PORT)
})

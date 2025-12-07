import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import cors from 'cors'


import { registerValidator, loginValidator, postCreateValidator } from './validation.js'
import checkAuth from './utils/checkAuth.js'
import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'

mongoose
    .connect('mongodb+srv://admin:wwwwww@cluster0.wxjo6hs.mongodb.net/blog?appName=Cluster0',)
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB error: ', err))

const app = express();

app.use(cors())


app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, 'uploads'),
  filename: (_, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage })

app.use(express.json());
 
app.post('/auth/register', upload.single('avatar'), registerValidator, UserController.register)
app.post('/auth/login', loginValidator, UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    }) 
})

app.get('/posts',  PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, upload.single('image'), postCreateValidator, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidator, PostController.update)

app.post('/posts/:id/like', checkAuth, PostController.likePost)


app.listen(4444, (err) => {
    if (err){
        return console.log(err)
    }

    console.log('Server OK')
});
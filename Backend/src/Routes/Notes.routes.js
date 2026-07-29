import express from 'express'
import {createnote,  Deleteall,  deletenotes,  Dislike,  getnote,  getsavenotes,  like, notesave, publicnotes, publicsearch, updatenote, username, usernotes, usersearch } from '../Controllers/Notes.controles.js'

import verifyToken from '../Middlewares/jwt.js'
const router = express.Router()

router.post("/post", verifyToken, createnote);
router.get("/usernote", verifyToken, usernotes);
router.get("/getusername", verifyToken, username);

// router.post('/post',verifyToken,createnote)
router.get('/savenote',verifyToken,getsavenotes)
router.post('/like/:id',verifyToken,like)
router.post('/Dislike/:id',verifyToken,Dislike)
router.post('/save/:id',verifyToken,notesave)
router.put('/update/:id',updatenote)
// router.get('/usernote', verifyToken,usernotes )
router.get('/publicnotes',publicnotes )
router.delete('/delete/:id', verifyToken,deletenotes)
router.delete('/delete-all', verifyToken,Deleteall)
router.get("/publicsearch", publicsearch)
router.get("/usersearch", verifyToken,usersearch)
// router.get('/getusername',verifyToken,username)
router.get('/:id',getnote)

export default router
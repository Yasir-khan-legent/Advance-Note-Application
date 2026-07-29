import Users from "../Models/Auth.model.js"
import Notes from "../Models/Note.model.js"

async function createnote(req, res) {
    try {
        const { title, note, status, tag, isprivate } = req.body
        const userid = req.user.id
        const Note = await Notes.create({
            title,
            note,
            tag,
            status,
            isprivate,
            Createdby: userid

        })
        res.status(200).json({
            message: "Note Created Sucssesfully",
            userid: userid
        })

    } catch (error) {
        res.json({
            message: "Create Note m error agya h",
            error: error.message
        })
    }
}



async function like(req, res) {
    try {
        const id = req.user.id
        const note = await Notes.findById(req.params.id)
        if (!note) {
            return res.json({ message: "Note Not Found" })
        }

         if (note.dislike.includes(id)) {
      note.dislike.pull(id);
    }

        if (note.likes.includes(id)) {
            note.likes.pull(id)
            await note.save()
            return res.json({ message: "Unliked" })
        } else {
            note.likes.push(id)
            await note.save()
            return res.json({
                message: "Liked Note"
            })
        }


    } catch (error) {
        res.json({
            message: "Likes Route m Error h ",
            error: error.message
        })
    }

}
async function Dislike(req, res) {
    try {
        const id = req.user.id
        const note = await Notes.findById(req.params.id)
        if (!note) {
            return res.json({ message: "Note Not Found" })
        }
          if (note.likes.includes(id)) {
      note.likes.pull(id);
    }

        if (note.dislike.includes(id)) {
            note.dislike.pull(id)
            await note.save()
            return res.json({ message: "Disliked" })
        } else {
            note.dislike.push(id)
            await note.save()
            return res.json({
                message: "Dislike pull"
            })
        }


    } catch (error) {
        res.json({
            message: "Likes Route m Error h ",
            error: error.message
        })
    }

}

async function notesave(req, res) {
    try {
        const userid = req.user.id
        const noteid = req.params.id
        const user = await Users.findById(userid)

        if (!user) {
            return res.json({ message: "user Not Found" })
        }

        if (user.savenotes.includes(noteid)) {
            user.savenotes.pull(noteid)
            await user.save()
            return res.json({ message: "Unsaved" })
        } else {
            user.savenotes.push(noteid)
            await user.save()
            return res.json({
                message: "save Note"
            })
        }


    } catch (error) {
        res.json({
            message: "Save Notes m Error h  ",
            error: error.message
        })
    }
}
async function getsavenotes(req, res) {
    try {
        const user = await Users.findById(req.user.id).populate({
            path: 'savenotes',
            populate: {
                path: 'Createdby',
                select: 'name'
            }
        });

        res.json(user.savenotes)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


async function usernotes(req, res) {
    try {
        const userid = req.user.id
        const notes = await Notes.find({ Createdby: userid })
        res.json(notes)
    } catch (error) {
        res.json({
            message: "User Notes m Error H ",
            error: error.message
        })
    }
}


async function publicnotes(req, res) {
    try {
        const notes = await Notes.find({ isprivate: false }).populate('Createdby', 'name')
        res.json(notes)
    } catch (error) {
        res.json({
            message: "Public Notes M error H ",
            error: error.message
        })
    }
}

async function deletenotes(req, res) {
    try {
        await Notes.findByIdAndDelete(req.params.id);
        res.json({ message: "Note Deleted Successfully." });

    } catch (error) {
        res.json({
            message: "Error agya h Delete Notes m ",
            error: error.message
        })
    }
}

async function Deleteall(req, res) {
    try {
        const userid = req.user.id
        await Notes.deleteMany({ Createdby: userid });
        res.json({ message: "All notes deleted successfully." });
    } catch (err) {
        res.json({ error: err.message });
    }
}



async function updatenote(req, res) {
    try {
        const id = req.params.id
        const { title, note, status, isprivate, tag } = req.body
        const updatedata = await Notes.findByIdAndUpdate(
            id,
            { title, note, status, isprivate, tag },
            { new: true }
        );

        res.json(updatedata);


    } catch (error) {
        console.log(error)
    }
}
async function getnote(req, res) {
    try {
        const id = req.params.id

        const note = await Notes.findById(id).populate('Createdby', 'name')
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.json(note);



    } catch (error) {
        console.log(error)
    }
}

async function publicsearch(req, res) {
    try {

        const query = req.query.query
        if (!query) {
            const notes = await Notes.find({ isprivate: false })
            res.json(notes)
        } else {
            const result = await Notes.find({
                $or: [{ title: { $regex: query, $options: "i" } },
                { note: { $regex: query, $options: "i" } }]
            })
            res.json(result)
        }

    } catch (error) {
        res.json({
            message: "Error agya h Public Search m",
            error: error.message
        })
    }
}


async function usersearch(req, res) {
    try {
        const userid = req.user.id
        const query = req.query.query
        if (!query) {
            const notes = await Notes.find({ Createdby: userid })
            res.json(notes)
        } else {
            const result = await Notes.find({
                $or: [{ title: { $regex: query, $options: "i" } },
                { note: { $regex: query, $options: "i" } }]
            })
            res.json(result)
        }

    } catch (error) {
        res.json({
            message: "Error agya h Public Search m",
            error: error.message
        })
    }
}

async function username(req, res) {
    try {
        const userid = req.user.id
        console.log(userid)
        const user = await Users.findById(userid);

        res.json({
            name: user.name,
            id: user._id,
            email: user.email,
            savenotes: user.savenotes

        });
    } catch (error) {
        console.log("error agya h ", error)
    }
}
async function delteaccount(req, res) {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        await Notes.deleteMany({ Createdby: userId });
        const user = await Users.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await Users.findByIdAndDelete(userId);

        res.status(200).json({ message: "Your account has been deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong while deleting the account",
            error: error.message
        });
    }
}


export { Dislike, delteaccount, getsavenotes, getnote, username, createnote, like, notesave, updatenote, deletenotes, Deleteall, publicnotes, usernotes, publicsearch, usersearch }


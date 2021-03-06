const express = require("express");
const path = require("path");
const fs = require("fs");
const data = require("./db/db.json")

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", function(req, res) {
    
    res.sendFile(path.join(__dirname, "public/" + "index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/" + "notes.html"));
});

app.get("/api/notes", function(req, res) {
    
    res.json(data);
});

//POST `/api/notes` - Should recieve a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.

app.post("/api/notes", function(req, res) {
    const newNote = req.body;
    let id = function(){
        if(!data.length) {
            id = 1;
        } else {
            id = data[data.length-1].id + 1;        
        }
        return id;
    }
    newNote.id = id();
   
    data.push(newNote);
    
    
    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(data), "utf8", function(err) {
        if (err) return (err);
    })

    res.json(newNote);
});

//DELETE `/api/notes/:id` - Should recieve a query paramter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.
app.delete("/api/notes/:id", function(req, res) {
    
    let idDeleteRequest = parseInt(req.params.id);
    
        for (let i = 0; i < data.length; i++) {
            
            if (idDeleteRequest === data[i].id) {
                const newData = data.splice(i, 1);
                
                fs.writeFile("./db/db.json", JSON.stringify(newData), "utf8", function (err) {
                    if (err) return (err)
                })                
            }
        }
    res.json(data);
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
"use strict"

// Total amount of notes and current note
let amountOfNotes = 0;
let currentNote = null;
// Flag to see if some note is currently being changed
let isNoteChanging = false;


document.addEventListener("DOMContentLoaded", loadContents);
// Loads all notes from localStorage
function loadContents() {
    const keys = Object.keys(localStorage);
    // If the localStorage is empty
    if (keys.length == 0) {
        currentNote = "Welcome";
        addNewNote("Welcome");
        localStorage.setItem(currentNote, "Welcome to my note taking web page!");
        return;
    }
    
    // Loading content of the first note and setting is as a current
    loadNoteContent(keys[0]);
    currentNote = keys[0];
    // Adding the rest of notes and loading content
    for (let key of keys) {
        addNewNote(key, localStorage.getItem(key));
    }
}


// Sets current note
function chooseNote(note) {
    // If currently changing another note
    if (isNoteChanging) {
        highlightSaveBtn();
        return;
    }
    currentNote = note.innerText;
    // loading note content
    loadNoteContent(note.innerText);
}


// Loads content of note
function loadNoteContent(note) {
    // Getting title and content elements
    let noteWindow = document.getElementsByClassName("note-window")[0];
    noteWindow.style.opacity = 1;
    let title = noteWindow.getElementsByTagName("h2")[0];
    let content = noteWindow.getElementsByClassName("note-content")[0];

    // Changing title and content
    title.innerText = note;
    content.innerText = localStorage.getItem(note);
    // Resizing height of note window
    noteWindow.style.height = content.offsetHeight + 84 + "px";
}


// Creates Add new button
function createAddBnt() {
    // Creating new "Add new" button
    let newAddBtn = document.createElement("li");
    newAddBtn.setAttribute("id", "add-new");
    newAddBtn.setAttribute("onclick", "addNew()");
    newAddBtn.classList.add("note");
    newAddBtn.innerHTML = '<img width="30" src="sources/plus-icon.svg"></img><span>Add new</span>';
    const noteList = document.getElementsByClassName("note-list")[0];
    noteList.append(newAddBtn);
}


// Creates new note
function addNewNote(title, content) {
    // Creating new note element
    let newNote = document.createElement("li");
    newNote.classList.add("note");
    newNote.setAttribute("onclick", "chooseNote(this)");
    newNote.innerHTML = title;
    const noteList = document.getElementsByClassName("note-list")[0];
    // Removing current "Add new" button
    document.getElementById("add-new").remove();
    // Adding new note
    noteList.append(newNote);
    localStorage.setItem(title, content ? content : "Type your text here");
    amountOfNotes++;
    createAddBnt();
}


// Creates input field to enter title of note
function addNew() {
    // If currently changing another note
    if (isNoteChanging) {
        highlightSaveBtn();
        return;
    }

    // Removing target element
    let addNewBtn = document.getElementById("add-new");
    addNewBtn.style.padding = "5px";
    addNewBtn.innerHTML = "";
    // Adding input
    let inputTitle = document.createElement("input");
    addNewBtn.append(inputTitle);
    inputTitle.placeholder = "Title";
    inputTitle.focus();
    // Saving new note
    inputTitle.addEventListener("keydown", function(event){
        if (event.code == "Enter" && inputTitle.value.trim()) {
            inputTitle.onblur = false;
            if (!Object.keys(localStorage).includes(inputTitle.value)) {
                addNewNote(inputTitle.value);
            } else {
                alert(`Note "${inputTitle.value}" already exists`);
            }
        }
    });
    
    inputTitle.onblur = function(event) {
        document.getElementById("add-new").remove();
        createAddBnt();
    };
}


// Saves content from textarea to new p block
function saveText() {
    // Note is not changing anymore
    isNoteChanging = false;

    // Getting textarea content
    const textarea = document.getElementsByClassName("editor")[0];
    let content = textarea.value;

    // Creating p with textarea content
    let block = document.createElement("p");
    block.setAttribute("onclick", "swapToTextArea()");
    block.classList.add("note-content");
    block.innerText = content;
    // replacing textarea with p
    let noteWindow = textarea.parentElement;
    noteWindow.replaceChild(block, textarea);
    // Hding SAVE button
    let saveBtn = document.getElementsByClassName("save-btn")[0];
    saveBtn.style.opacity = 0;

    let currentNoteName = noteWindow.getElementsByTagName("h2")[0].innerHTML;
    // Saving current content
    localStorage.setItem(currentNoteName, content);
}


// Resizes textarea
function resizeTextArea(textarea) {
    textarea.oninput = textarea.onfocus = function() {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
        textarea.parentElement.style.height = textarea.scrollHeight + 54 + "px";
    };
    textarea.addEventListener("keydown", function (event) {
        if (event.code == 8 || event.code == 46) {
          setTimeout(() => textarea.parentElement.style.height = textarea.scrollHeight + 54 + "px", 0);
        }
    });
}


// Replaces p block with textarea
function swapToTextArea() {
    // Note is being changed right now
    isNoteChanging = true;

    const block = document.getElementsByClassName("note-content")[0];
    const blockContent = block.innerText;
    // Creating textarea
    let textarea = document.createElement("textarea");
    textarea.value = blockContent;
    textarea.classList.add("editor");

    // Resizing textarea and updating sidebar height
    resizeTextArea(textarea);

    // Replacing block with textarea
    block.parentElement.replaceChild(textarea, block);
    textarea.focus();
    // Making SAVE buttin visible
    let saveBtn = document.getElementsByClassName("save-btn")[0];
    saveBtn.style.opacity = 1;
}


// Highlighting save bytton
function highlightSaveBtn() {
    let saveBtn = document.getElementsByClassName("save-btn")[0];
    saveBtn.classList.add("highlighted");
    setTimeout(() => saveBtn.classList.remove("highlighted"), 1000);
}


// Deleting current note
function deleteNote() {
    if (!confirm("Are you sure?")) {
        return;
    }
    
    // If there is only one note
    if (amountOfNotes <= 1) {
        let noteWindow = document.getElementsByClassName("note-window")[0];
        noteWindow.style.opacity = 0;
        document.getElementsByClassName("note")[0].remove();
        localStorage.removeItem(currentNote);
        return;
    }
    
    // Deleting note from localStorage
    localStorage.removeItem(currentNote);
    amountOfNotes--;
    // Removing note from sidebar
    for (let note of document.getElementsByClassName("note")) {
        if (note.innerText == currentNote) {
            note.remove();
        }
    }
    // choosing first note
    chooseNote(document.getElementsByClassName("note")[0]);
}

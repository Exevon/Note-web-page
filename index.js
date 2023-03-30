"use strict"

// Hashmap that will store contents of all notes
let notesContents = new Map();
notesContents.set("Welcome", "This is welcome-note. Hope you will enjoy!");
let currentNote = "Welcome";

// Loads content of note
function loadNoteContent(note) {
    // Getting title and content elements
    let noteWindow = document.getElementsByClassName("note-window")[0];
    let title = noteWindow.getElementsByTagName("h2")[0];
    let content = noteWindow.getElementsByClassName("note-content")[0];

    // Changing title and content
    title.innerText = note;
    if (notesContents.has(note)) content.innerText = notesContents.get(note);
    else content.innerText = "Type your text here";
    // Resizing height of note window
    noteWindow.style.height = content.offsetHeight + 84 + "px";
}


// Sets current note
function chooseNote(note) {
    currentNote = note.innerText;
    // loading note content
    loadNoteContent(note.innerText);
}


// Creates Add new button
function createAddBnt() {
    // Creating new "Add new" button
    let newAddBtn = document.createElement("li");
    newAddBtn.setAttribute("id", "add-new");
    newAddBtn.setAttribute("onclick", "addNew()");
    newAddBtn.classList.add("note");
    newAddBtn.innerHTML = '<img width="30" src="sources/icons8-plus-48.svg"></img><span>Add new</span>';
    const noteList = document.getElementsByClassName("note-list")[0];
    noteList.append(newAddBtn);
}


// Creates new note
function addNewNote(title) {
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
    createAddBnt();
}


// Creates input field to enter title of note
function addNew() {
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
            addNewNote(inputTitle.value);
        }
    });
    
    inputTitle.onblur = function(event) {
        document.getElementById("add-new").remove();
        createAddBnt();
    };
}


// Saves content from textarea to new p block
function saveText() {
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
    notesContents.set(currentNoteName, content);
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
    const block = document.getElementsByClassName("note-content")[0];
    const blockContent = block.innerText;
    // Creating textarea
    let textarea = document.createElement("textarea");
    textarea.value = blockContent;
    // textarea.setAttribute("onblur", "swapToBlock");
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

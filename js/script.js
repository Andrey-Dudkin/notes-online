const userInterface = document.querySelector(".user_interface");
const form = document.querySelector("#form");
const noteInput = document.querySelector("#note_input");
const noteList = document.querySelector(".notes_list");
let notes = [];
if(localStorage.getItem("notes")){
    notes = JSON.parse(localStorage.getItem("notes"))
};
notes.forEach(note => {
    const cssClass = note.statusNote ? "note_text note_status" : "note_text note_active"
    const noteHTML = `
            <li id="${note.idNote}" class="note">
            <span class="${cssClass}">${note.textNote}</span>
            <div class="buttons">
                <button class="edit button_note" data-action="edit">
                    <img src="./icons/icon-edit.svg" alt="Редактировать" width="20" height="20" class="icon_edit">
                </button>
                <button class="status button_note" data-action="status">
                    <img src="./icons/icon-done.svg" alt="Выполненно" width="20" height="20" class="icon_status">
                </button>
                <button class="delete button_note" data-action="delete">
                    <img src="./icons/icon-delete.svg" alt="Удалить" width="20" height="20" class="icon_delete">
                </button>
            </div>
        </li>
    `;
    noteList.insertAdjacentHTML("beforeend", noteHTML);
});
let validation = new JustValidate("#form",{
    errorLabelStyle: {
        color: "var(--error-color)"
    }
});
validation.addField("#note_input",[
    {
        rule: "required",
        errorMessage: "Введите текст заметки"
    },
    {
        rule: "minLength",
        value: 1,
        // errorMessage: "Минимум  символа"
    },
])
.onSuccess(() => {
    addNote()
});
noteList.addEventListener("click", deleteNote);
noteList.addEventListener("click", doneNote);
noteList.addEventListener("click", editNote);

function addNote () {
    const noteText = noteInput.value;
    const newNote = {
        idNote: Date.now(),
        textNote: noteText,
        statusNote: false
    };

    const cssClass = newNote.statusNote ? "note_text note_status" : "note_text note_active"
    const noteHTML = `
            <li id="${newNote.idNote}" class="note">
            <span class="${cssClass}">${newNote.textNote}</span>
            <div class="buttons">
                <button class="edit button_note" data-action="edit">
                    <img src="./icons/icon-edit.svg" alt="Редактировать" width="20" height="20" class="icon_edit">
                </button>
                <button class="status button_note" data-action="status">
                    <img src="./icons/icon-done.svg" alt="Выполненно" width="20" height="20" class="icon_status">
                </button>
                <button class="delete button_note" data-action="delete">
                    <img src="./icons/icon-delete.svg" alt="Удалить" width="20" height="20" class="icon_delete">
                </button>
            </div>
        </li>
    `;
    notes.push(newNote)
    saveInLocalStorage()
    noteList.insertAdjacentHTML("beforeend", noteHTML);
    noteInput.value = "";
    noteInput.focus();
};
function deleteNote (e) {
    if(e.target.dataset.action === "delete"){
        const parentElem = e.target.closest("li");
        const id = Number(parentElem.id);
        const index = notes.findIndex((note) => {
            if(note.idNote === id){
                return true
            }
        })
        notes.splice(index,1)
        saveInLocalStorage()
        parentElem.remove()
        
    }
};
function doneNote (e) {
    if(e.target.dataset.action === "status"){
        const parentElem = e.target.closest("li");
        const id = Number(parentElem.id);
        const note = notes.find((note) => {
            if(note.idNote === id){
                return true
            }
        })
        note.statusNote = !note.statusNote
        const titleNote = parentElem.querySelector(".note_text");
        titleNote.classList.toggle("note_status");
        titleNote.classList.toggle("note_active");
    }
    saveInLocalStorage()
}
function editNote (e) {
    if(e.target.dataset.action === "edit"){
        const note = e.target.closest(".note");
        const editNoteHtml = `
            <div class="box_edit_note">
                <input type="text" class="edit_input">
                <button class="btn_save_note">Сохранить</button>
            </div>
            `
            note.insertAdjacentHTML("beforeend",editNoteHtml)
            const boxEditNote = document.querySelector(".box_edit_note");
            const buttonSveNote = document.querySelector(".btn_save_note");
            const inputEditNote = document.querySelector(".edit_input");
            const noteText = note.querySelector(".note_text")
            const buttonsNote = note.querySelectorAll(".button_note")
            buttonsNote.forEach((buttonNote) => {
                buttonNote.setAttribute('disabled', '');
                buttonNote.style.cursor = "auto"
            })
            inputEditNote.value = noteText.innerText;
            const noteId = Number(note.id);
            const filterNote = notes.find(function(note){
                if(note.idNote === noteId){
                    return true;
                };
            });
            buttonSveNote.addEventListener("click",function(){
                if(inputEditNote.value.trim() === ""){
                    inputEditNote.style.borderColor = "var(--error-color)"
                }else{
                    noteText.innerText = inputEditNote.value;
                    boxEditNote.remove();
                    filterNote.textNote = inputEditNote.value;
                    saveInLocalStorage();
                    buttonsNote.forEach((buttonNote) => {
                        buttonNote.removeAttribute('disabled');;
                        buttonNote.style.cursor = "pointer"
                    })
                }
            });
    }
}
function saveInLocalStorage () {
  localStorage.setItem("notes",JSON.stringify(notes));  
}
const SelectStatusNote = document.querySelector(".filter_note");
SelectStatusNote.addEventListener("change", () => {
    const noteElements = document.querySelectorAll(".note");
    noteElements.forEach((noteElem) => {
        noteElem.style.display = "none";
    })
     if(SelectStatusNote.value === "Все"){
        const note = document.querySelectorAll(".note");
        note.forEach((elem) => {
            elem.style.display = "flex";
        })
     }
     if(SelectStatusNote.value === "Активные"){
        const noteActive = document.querySelectorAll(".note_active");
        noteActive.forEach((elem) => {
            const note = elem.closest(".note")
            note.style.display = "flex";
        })
     }
     if(SelectStatusNote.value === "Выполнные"){
        const noteStatus = document.querySelectorAll(".note_status");
        noteStatus.forEach((elem) => {
            const note = elem.closest(".note")
            note.style.display = "flex";
        })
     }
})
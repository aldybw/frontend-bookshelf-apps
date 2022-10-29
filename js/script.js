const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const textTitle = document.getElementById("inputBookTitle").value;
  const textAuthor = document.getElementById("inputBookAuthor").value;
  const textYear = document.getElementById("inputBookYear").value;

  const generatedID = generateId();
  const isCompletedResult = isInputBookCompletedChecked();
  const bookObject = generateBookObject(
    generatedID,
    textTitle,
    textAuthor,
    textYear,
    isCompletedResult
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function isInputBookCompletedChecked() {
  let checkedResult = false;

  checkedCondition =
    document.getElementById("inputBookIsComplete").checked === true;
  if (checkedCondition) {
    checkedResult = true;
    return checkedResult;
  }
  return false;
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById(
    "incompleteBookshelfList"
  );
  uncompletedBOOKList.innerHTML = "";

  const completedBOOKList = document.getElementById("completeBookshelfList");
  completedBOOKList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) uncompletedBOOKList.append(bookElement);
    else completedBOOKList.append(bookElement);
  }
});

function makeBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis: ${bookObject.author}`;

  const textYear = document.createElement("h3");
  textYear.innerText = `Tahun: ${bookObject.year}`;

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");

  const article = document.createElement("article");
  article.classList.add("book_item");
  article.append(textTitle, textAuthor, textYear, buttonContainer);
  article.setAttribute("id", "book-" + bookObject.id);

  if (bookObject.isCompleted) {
    const buttonUnfinishCheck = document.createElement("button");
    buttonUnfinishCheck.classList.add("green");
    buttonUnfinishCheck.innerText = "Belum selesai di Baca";

    buttonUnfinishCheck.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });

    const buttonDeleteBook = document.createElement("button");
    buttonDeleteBook.classList.add("red");
    buttonDeleteBook.innerText = "Hapus buku";

    buttonDeleteBook.addEventListener("click", function () {
      isUserWantToDelete(bookObject.id);
    });

    buttonContainer.append(buttonUnfinishCheck, buttonDeleteBook);
  } else {
    const buttonFinishCheck = document.createElement("button");
    buttonFinishCheck.classList.add("green");
    buttonFinishCheck.innerText = "Selesai dibaca";

    buttonFinishCheck.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
    });

    const buttonDeleteBook = document.createElement("button");
    buttonDeleteBook.classList.add("red");
    buttonDeleteBook.innerText = "Hapus buku";

    buttonDeleteBook.addEventListener("click", function () {
      isUserWantToDelete(bookObject.id);
    });

    buttonContainer.append(buttonFinishCheck, buttonDeleteBook);
  }

  return article;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function isUserWantToDelete(bookId) {
  let text = "Ingin menghapus buku?";
  let isConfirmChecked = confirm(text) == true;
  if (isConfirmChecked) {
    removeBookFromCompleted(bookId);
  } else {
    return alert("Tidak jadi hapus buku");
  }
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

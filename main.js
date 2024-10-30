// Do your work here...
console.log("Hello, world!");

// initialize localStorage jika belum ada
const initializeStorage = () => {
  if (!localStorage.getItem("books")) {
    localStorage.setItem("books", JSON.stringify([]));
  }
};

// Function mendapatkan semua buku
const getAllBooks = () => {
  return JSON.parse(localStorage.getItem("books")) || [];
};

// Function menyimpan buku
const saveBook = (books) => {
  localStorage.setItem("books", JSON.stringify(books));
};

// Function menambah buku baru
const addBook = (book) => {
  const books = getAllBooks();
  books.push(book);
  saveBook(books);
};

// Function menghapus buku
const deleteBook = (bookId) => {
  let books = getAllBooks();
  books = books.filter((book) => book.id !== bookId);
  saveBook(books);
};

// Function mengubah status buku
const toggleBookStatus = (bookId) => {
  const books = getAllBooks();
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    saveBook(books);
  }
};

// Function mencari buku
const searchBooks = (keyword) => {
  const books = getAllBooks();
  return books.filter((book) =>
    book.title.toLowerCase().includes(keyword.toLowerCase())
  );
};

// Function mengedit buku
const editBook = (bookId, updatedBook) => {
  const books = getAllBooks();
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex] = { ...books[bookIndex], ...updatedBook };
    saveBook(books);
  }
};

// Function merender buku ke rak yang sesuai
const renderBooks = (books) => {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  books.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
};

// Function membuat elemen buku
const createBookElement = (book) => {
  const bookItem = document.createElement("div");
  bookItem.setAttribute("data-bookid", book.id);
  bookItem.setAttribute("data-testid", "bookItem");

  bookItem.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">
          ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
        </button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

  // Event listener tombol-tombol
  const toggleButton = bookItem.querySelector(
    '[data-testid="bookItemIsCompleteButton"]'
  );
  const deleteButton = bookItem.querySelector(
    '[data-testid="bookItemDeleteButton"]'
  );
  const editButton = bookItem.querySelector(
    '[data-testid="bookItemEditButton"]'
  );

  toggleButton.onclick = () => {
    toggleBookStatus(book.id);
    renderBooks(getAllBooks());
  };

  deleteButton.onclick = () => {
    if (confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      deleteBook(book.id);
      renderBooks(getAllBooks());
    }
  };

  editButton.onclick = () => {
    showEditForm(book);
  };

  return bookItem;
};

// Function menampilkan form edit
const showEditForm = (book) => {
  const bookForm = document.getElementById("bookForm");
  const submitButton = document.getElementById("bookFormSubmit");
  const headerTitle = document.querySelector("main section h2");

  document.getElementById("bookFormTitle").value = book.title;
  document.getElementById("bookFormAuthor").value = book.author;
  document.getElementById("bookFormYear").value = book.year;
  document.getElementById("bookFormIsComplete").checked = book.isComplete;

  submitButton.textContent = "Edit Buku";
  bookForm.dataset.editing = book.id;
  headerTitle.textContent = "Edit Buku";

  // Scroll to fokus ke edit buku
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  document.getElementById("bookFormTitle").focus();
};

// Event listener saat dokumen dimuat
document.addEventListener("DOMContentLoaded", () => {
  initializeStorage();
  renderBooks(getAllBooks());

  // Handle submit form buku
  const bookForm = document.getElementById("bookForm");
  const headerTitle = document.querySelector("main section h2");
  bookForm.onsubmit = (e) => {
    e.preventDefault();

    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = parseInt(document.getElementById("bookFormYear").value);
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    if (bookForm.dataset.editing) {
      // Mode edit
      editBook(bookForm.dataset.editing, { title, author, year, isComplete });
      delete bookForm.dataset.editing;
      document.getElementById("bookFormSubmit").textContent =
        "Masukkan Buku ke rak";

      headerTitle.textContent = "Tambah Buku Baru";
      alert("Buku berhasil diedit dan diperbarui!");
    } else {
      // Mode tambah baru
      const newBook = {
        id: String(new Date().getTime()),
        title,
        author,
        year,
        isComplete,
      };
      addBook(newBook);
    }

    bookForm.reset();
    renderBooks(getAllBooks());
  };

  // Handle pencarian buku
  const searchForm = document.getElementById("searchBook");
  searchForm.onsubmit = (e) => {
    e.preventDefault();
    const keyword = document.getElementById("searchBookTitle").value;
    const filteredBooks = searchBooks(keyword);
    renderBooks(filteredBooks);
  };
});

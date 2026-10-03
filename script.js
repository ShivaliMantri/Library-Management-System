/* ==========================================
   LIBRARY MANAGEMENT SYSTEM
========================================== */


/* ==========================================
   BOOK DATA
========================================== */

let books =
    JSON.parse(
        localStorage.getItem("libraryBooks")
    ) || [

        {
            id: "B001",
            title: "The Alchemist",
            author: "Paulo Coelho",
            quantity: 5,
            available: 5
        },

        {
            id: "B002",
            title: "Atomic Habits",
            author: "James Clear",
            quantity: 4,
            available: 4
        },

        {
            id: "B003",
            title: "Clean Code",
            author: "Robert C. Martin",
            quantity: 3,
            available: 3
        },

        {
            id: "B004",
            title: "The Psychology of Money",
            author: "Morgan Housel",
            quantity: 6,
            available: 6
        }

    ];


/* ==========================================
   EDIT INDEX
========================================== */

let editIndex = -1;


/* ==========================================
   SAVE DATA
========================================== */

function saveBooks() {

    localStorage.setItem(
        "libraryBooks",
        JSON.stringify(books)
    );

}


/* ==========================================
   DISPLAY ALL BOOKS
========================================== */

function displayBooks(bookList = books) {

    const tableBody =
        document.getElementById(
            "bookTableBody"
        );


    tableBody.innerHTML = "";


    if (bookList.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="7"
                    style="text-align:center;">

                    No books found.

                </td>

            </tr>

        `;

        updateStatistics();

        displayAvailableBooks();

        return;
    }


    bookList.forEach(function(book) {

        const index =
            books.indexOf(book);


        let status = "";


        if (book.available === 0) {

            status =
                `<span style="color:#ff5555;">
                    Not Available
                 </span>`;

        }

        else {

            status =
                `<span style="color:#2196f3;">
                    Available
                 </span>`;

        }


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${book.id}
            </td>

            <td>
                ${book.title}
            </td>

            <td>
                ${book.author}
            </td>

            <td>
                ${book.quantity}
            </td>

            <td>
                ${book.available}
            </td>

            <td>
                ${status}
            </td>

            <td>

                <button
                    class="action-button update-button"
                    onclick="editBook(${index})">

                    Update

                </button>


                <button
                    class="action-button delete-button"
                    onclick="deleteBook(${index})">

                    Delete

                </button>


                <button
                    class="action-button issue-button"
                    onclick="issueBook(${index})">

                    Issue

                </button>


                <button
                    class="action-button return-button"
                    onclick="returnBook(${index})">

                    Return

                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });


    updateStatistics();

    displayAvailableBooks();

}


/* ==========================================
   ADD / INSERT / UPDATE BOOK
========================================== */

document
    .getElementById("bookForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const id =
                document
                    .getElementById("bookId")
                    .value
                    .trim();


            const title =
                document
                    .getElementById("bookTitle")
                    .value
                    .trim();


            const author =
                document
                    .getElementById("author")
                    .value
                    .trim();


            const quantity =
                parseInt(
                    document
                        .getElementById("quantity")
                        .value
                );


            /* ==========================
               UPDATE BOOK
            ========================== */

            if (editIndex !== -1) {


                const issued =
                    books[editIndex].quantity -
                    books[editIndex].available;


                if (quantity < issued) {

                    alert(
                        "Quantity cannot be less than issued books."
                    );

                    return;

                }


                books[editIndex].id =
                    id;

                books[editIndex].title =
                    title;

                books[editIndex].author =
                    author;

                books[editIndex].quantity =
                    quantity;

                books[editIndex].available =
                    quantity - issued;


                alert(
                    "Book updated successfully!"
                );


                editIndex = -1;


                document
                    .getElementById(
                        "submitButton"
                    )
                    .textContent =
                    "+ Add Book";

            }


            /* ==========================
               INSERT NEW BOOK
            ========================== */

            else {


                const alreadyExists =
                    books.some(
                        function(book) {

                            return book.id === id;

                        }
                    );


                if (alreadyExists) {

                    alert(
                        "Book ID already exists!"
                    );

                    return;

                }


                const newBook = {

                    id: id,

                    title: title,

                    author: author,

                    quantity: quantity,

                    available: quantity

                };


                books.push(newBook);


                alert(
                    "New book added successfully!"
                );

            }


            saveBooks();

            displayBooks();

            clearForm();

        }
    );


/* ==========================================
   DELETE BOOK
========================================== */

function deleteBook(index) {


    const book =
        books[index];


    const confirmation =
        confirm(
            `Are you sure you want to delete "${book.title}"?`
        );


    if (!confirmation) {

        return;

    }


    books.splice(index, 1);


    saveBooks();

    displayBooks();


    alert(
        "Book deleted successfully!"
    );

}


/* ==========================================
   UPDATE BOOK
========================================== */

function editBook(index) {


    const book =
        books[index];


    document
        .getElementById("bookId")
        .value =
        book.id;


    document
        .getElementById("bookTitle")
        .value =
        book.title;


    document
        .getElementById("author")
        .value =
        book.author;


    document
        .getElementById("quantity")
        .value =
        book.quantity;


    editIndex = index;


    document
        .getElementById(
            "submitButton"
        )
        .textContent =
        "Update Book";


    document
        .getElementById("newBooks")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* ==========================================
   ISSUE BOOK
========================================== */

function issueBook(index) {


    if (
        books[index].available <= 0
    ) {

        alert(
            "This book is currently unavailable."
        );

        return;

    }


    books[index].available--;


    saveBooks();

    displayBooks();


    alert(
        "Book issued successfully!"
    );

}


/* ==========================================
   RETURN BOOK
========================================== */

function returnBook(index) {


    if (
        books[index].available >=
        books[index].quantity
    ) {

        alert(
            "All copies of this book are already available."
        );

        return;

    }


    books[index].available++;


    saveBooks();

    displayBooks();


    alert(
        "Book returned successfully!"
    );

}


/* ==========================================
   SEARCH BOOKS
========================================== */

function searchBooks() {


    const searchText =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .toLowerCase()
            .trim();


    const filteredBooks =
        books.filter(
            function(book) {


                return (

                    book.id
                        .toLowerCase()
                        .includes(
                            searchText
                        )

                    ||

                    book.title
                        .toLowerCase()
                        .includes(
                            searchText
                        )

                    ||

                    book.author
                        .toLowerCase()
                        .includes(
                            searchText
                        )

                );

            }
        );


    displayBooks(
        filteredBooks
    );

}


/* ==========================================
   CLEAR FORM
========================================== */

function clearForm() {


    document
        .getElementById(
            "bookForm"
        )
        .reset();


    editIndex = -1;


    document
        .getElementById(
            "submitButton"
        )
        .textContent =
        "+ Add Book";

}


/* ==========================================
   UPDATE DASHBOARD
========================================== */

function updateStatistics() {


    let total = 0;

    let available = 0;


    books.forEach(
        function(book) {

            total +=
                book.quantity;

            available +=
                book.available;

        }
    );


    const issued =
        total - available;


    document
        .getElementById(
            "totalBooks"
        )
        .textContent =
        total;


    document
        .getElementById(
            "availableBooks"
        )
        .textContent =
        available;


    document
        .getElementById(
            "issuedBooks"
        )
        .textContent =
        issued;


    document
        .getElementById(
            "bookTitles"
        )
        .textContent =
        books.length;

}


/* ==========================================
   DISPLAY AVAILABLE BOOK CARDS
========================================== */

function displayAvailableBooks() {


    const container =
        document.getElementById(
            "availableBookCards"
        );


    container.innerHTML = "";


    const availableBooks =
        books.filter(
            function(book) {

                return book.available > 0;

            }
        );


    if (
        availableBooks.length === 0
    ) {

        container.innerHTML = `

            <div class="book-card">

                <h3>
                    No Books Available
                </h3>

                <p>
                    Currently there are no
                    available books.
                </p>

            </div>

        `;

        return;

    }


    availableBooks.forEach(
        function(book) {


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "book-card";


            card.innerHTML = `

                <h3>
                    ${book.title}
                </h3>

                <p>
                    Author:
                    ${book.author}
                </p>

                <p>
                    Book ID:
                    ${book.id}
                </p>

                <span
                    class="available-badge">

                    ✓
                    ${book.available}
                    copies available

                </span>

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* ==========================================
   INITIAL LOAD
========================================== */

displayBooks();
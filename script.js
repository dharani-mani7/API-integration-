async function fetchBooks() {
    const query = document.getElementById("search")?.value.trim() || "bestsellers";
    const category = document.getElementById("category")?.value || "all";
    const loader = document.getElementById("loader");
    const bookList = document.getElementById("book-list");
    if (!bookList || !loader) {
        console.error("Error: Required HTML elements not found.");
        return;
    }
    loader.style.display = "block";
    bookList.innerHTML = "<p>Fetching books...</p>";
    let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;
    const API_KEY = "";
    if (API_KEY) url += `&key=${API_KEY}`;
    if (category !== "all") {
        url += `+subject:${encodeURIComponent(category)}`;
    }
    console.log("Fetching from URL:", url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API Response Data:", data); 
        if (!data.items || data.items.length === 0) {
            bookList.innerHTML = "<p>No results found.</p>";
            return;
        }
        displayBooks(data.items);
    } catch (error) {
        console.error("Error fetching books:", error);
        bookList.innerHTML = "<p>Error fetching books. Please try again.</p>";
    } finally {
        loader.style.display = "none";
    }
}
function displayBooks(books) {
    const bookList = document.getElementById("book-list");
    if (!bookList) {
        console.error("Error: book-list element not found.");
        return;
    }
    bookList.innerHTML = ""; 
    books.forEach((book, index) => {
        const bookInfo = book.volumeInfo;
        const bookItem = document.createElement("div");
        bookItem.classList.add("book");

        bookItem.innerHTML = `
            <img src="${bookInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}" alt="${bookInfo.title}">
            <h3>${bookInfo.title}</h3>
            <p>Author: ${bookInfo.authors?.join(", ") || "Unknown"}</p>
        `;
        bookList.appendChild(bookItem);
        setTimeout(() => {
            bookItem.classList.add("show");
        }, index * 100);
    });
}
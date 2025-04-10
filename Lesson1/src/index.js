/**
 
// Cách import cũ
const http = require("http");

// Tạo server
// req: request
// res: response: status, data

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello world");
});

const PORT = 3000;

// Bắt đầu lắng nghe trên cổng 3000 gồm PORT và hàm callback
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
 */

const fs = require("fs");
const path = require("path");
const http = require("http");
const { log } = require("console");
const PORT = 3000;

const dataFilePath = path.join(__dirname, "data.json");
const authorFilePath = path.join(__dirname, "author.json");
const bookFilePath = path.join(__dirname, "book.json");
const logPath = path.join(__dirname, "log.json");

//Helper function to read data from file
const readDataFromFile = (path) => {
  const data = fs.readFileSync(path, "utf-8");
  return JSON.parse(data);
};

const writeDataToFile = (data, path) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

// Helper function to write log action
const writeLogToFile = (action, name) => {
  const listlog = readDataFromFile(logPath);
  const time = new Date().toISOString();
  const log = `[${time}] ${action} : ${name} `;
  listlog.push(log);
  writeDataToFile(listlog, logPath);
};

const server = http.createServer((req, res) => {
  const { method, url } = req;
  let body = "";
  // /users
  if (url.startsWith("/users")) {
    req.on("data", (data) => {
      body += data.toString();
    });

    req.on("end", () => {
      if (method === "GET") {
        const users = readDataFromFile();
        //JSON.stringify : trả ra giá trị json
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(users));
        console.log(dataFilePath);
      }

      if (method === "POST") {
        const users = readDataFromFile();
        const newUser = JSON.parse(body);
        newUser.id = users.length ? users[users.length - 1].id + 1 : 1;
        users.push(newUser);
        writeDataToFile(users);
        writeLogToFile(method, newUser);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newUser));
      }

      if (method === "PUT") {
      }

      if (method === "DELETE") {
      }
    });
  }

  // Author
  else if (url.startsWith("/author")) {
    req.on("data", (data) => {
      body += data.toString();
    });

    req.on("end", () => {
      if (method === "GET") {
        const authors = readDataFromFile(authorFilePath);
        writeLogToFile(method, "AUTHOR");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(authors));
      }
      if (method === "POST") {
        const authors = readDataFromFile(authorFilePath);
        const newAuthor = JSON.parse(body);
        newAuthor.id = authors.length ? authors[authors.length - 1].id + 1 : 1;
        authors.push(newAuthor);
        writeDataToFile(authors, authorFilePath);
        writeLogToFile(method, "AUTHOR");
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newAuthor));
      }
      if (method === "PUT") {
        const authors = readDataFromFile(authorFilePath);
        const authorId = parseInt(url.split("/").pop());
        const updateAuthor = JSON.parse(body);
        const authorIndex = authors.findIndex(
          (author) => author.id === authorId
        );

        if (authorIndex !== -1) {
          authors[authorIndex] = { id: authorId, ...updateAuthor };
          writeDataToFile(authors, authorFilePath);
          writeLogToFile(method, "AUTHOR");
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify(authors[authorIndex]));
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Author not found" }));
        }
      }
      if (method === "DELETE") {
        const authors = readDataFromFile(authorFilePath);
        const authorId = parseInt(url.split("/").pop());
        const filterAuthor = authors.filter((author) => author.id !== authorId);
        if (authors.length !== filterAuthor.length) {
          writeDataToFile(filterAuthor, authorFilePath);
          writeLogToFile(method, "AUTHOR");
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end();
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Author not found" }));
        }
      }
    });
  }

  // Books
  else if (url.startsWith("/book")) {
    req.on("data", (data) => {
      body += data.toString();
    });

    req.on("end", () => {
      if (method === "GET") {
        const books = readDataFromFile(bookFilePath);
        writeLogToFile(method, "BOOK");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(books));
      }

      if (method === "POST") {
        const books = readDataFromFile(bookFilePath);
        const newBook = JSON.parse(body);
        const authorId = newBook.authorId;
        const authors = readDataFromFile(authorFilePath);
        const existingAuthor = authors.findIndex(
          (author) => author.id === authorId
        );
        if (existingAuthor === -1) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Author not found" }));
          return;
        }
        newBook.id = books.length ? books[books.length - 1].id + 1 : 1;
        books.push(newBook);
        writeDataToFile(books, bookFilePath);
        writeLogToFile(method, "BOOK");
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newBook));
      }
      if (method === "PUT") {
        const authors = readDataFromFile(authorFilePath);
        const books = readDataFromFile(bookFilePath);
        const bookId = parseInt(url.split("/").pop());
        const updateBook = JSON.parse(body);
        const authorId = updateBook.authorId;
        const bookIndex = books.findIndex((book) => book.id === bookId);
        if (bookIndex !== -1) {
          const exitingAuthor = authors.findIndex(
            (author) => author.id === authorId
          );
          if (exitingAuthor === -1) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Author not found" }));
            return;
          }
          books[bookIndex] = { id: bookId, ...updateBook };
          writeDataToFile(books, bookFilePath);
          writeLogToFile(method, "BOOK");
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify(books[bookIndex]));
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Author not found" }));
        }
      }
      if (method === "DELETE") {
        const books = readDataFromFile(bookFilePath);
        const bookId = parseInt(url.split("/").pop());
        const filterBook = books.filter((book) => book.id !== bookId);
        if (books.length !== filterBook.length) {
          writeDataToFile(filterBook, bookFilePath);
          writeLogToFile(method, "BOOK");
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end();
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Book not found" }));
        }
      }
    });
  }

  // Search book
  else if (url.startsWith("/search/book")) {
    req.on("data", (data) => {
      body += data.toString();
    });

    req.on("end", () => {
      if (method === "GET") {
        const data = JSON.parse(body);
        const name = data.name;
        console.log(name);

        const books = readDataFromFile(bookFilePath);
        const authors = readDataFromFile(authorFilePath);
        const filterByBook = books.filter((book) => book.name === name);
        const filterByAuthor = authors.filter((author) => author.name === name);
        if (filterByBook.length > 0) {
          writeLogToFile(method, "SEARCH BY BOOK");
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(filterByBook));
          return;
        }
        if (filterByAuthor.length > 0) {
          writeLogToFile(method, "SEARCH BY AUTHOR");
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(filterByAuthor));
          return;
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Not found" }));
        }
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

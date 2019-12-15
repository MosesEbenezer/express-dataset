const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./event.db');

const createTables = () => {
  db.run(`CREATE TABLE IF NOT EXISTS Actor (
    actor_id INTEGER NOT NULL PRIMARY KEY,
    login TEXT NOT NULL,
    avatar_url TEXT NOT NULL
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS Repo (
    repo_id INTEGER NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    url  TEXT NOT NULL
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS Event (
    id INTEGER NOT NULL PRIMARY KEY,
    type TEXT NOT NULL,
    actor_id  INTEGER NOT NULL,
    repo_id  INTEGER NOT NULL,
    created_at TEXT NOT NULL
    )`);
};

module.exports = {
  init: createTables,
  db: db
};

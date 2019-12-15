/* Load db & db configuration */
const db = require('./config').db;

/* Load bluebird Promise */
const Promise = require('bluebird');

/**
 * DAOs Methods
 */
class Dao {
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  }
}

module.exports = Dao;

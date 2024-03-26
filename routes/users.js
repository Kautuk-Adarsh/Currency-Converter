

const bcrypt = require('bcrypt');

function createUser(connection, username, password, callback) {
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      callback(err);
      return;
    }
    const user = { username, password: hash };
    connection.query('INSERT INTO users SET ?', user, (err, result) => {
      if (err) {
        callback(err);
      } else {
        callback(null, result);
      }
    });
  });
}

function loginUser(connection, username, password, callback) {
  connection.query('SELECT * FROM users WHERE username = ?',[username],(err, results) => {
      if (err) {
        callback(err);
        return;
      }
      if (results.length === 0) {
        callback(null, null);
        return;
      }
      const user = results[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          callback(err);
          return;
        }
        if (result) {
          callback(null, user);
        } else {
          callback(null, null);
        }
      });
    }
  );
}

function generateApiKey(connection, username, callback) {
  const apiKey = Math.random().toString(36).substring(2);
  connection.query('UPDATE users SET api_key = ? WHERE username = ?',[apiKey, username],(err, result) => {
      if (err) {
        callback(err);
      } else {
        callback(null, apiKey);
      }
    }
  );
}

module.exports = { createUser, loginUser, generateApiKey };

const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");

function initialize(passport) {
  const authenticateUser = (username, password, done) => {
    pool.query(
      `SELECT * FROM users WHERE username = $1`,
      [username],
      (err, results) => {
        if (err) return done(err);

        if (results.rows.length > 0) {
          const user = results.rows[0];

          bcrypt.compare(password, user.password_hash, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Incorrect password" });
            }
          });
        } else {
          return done(null, false, { message: "No user with that username" });
        }
      }
    );
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password" },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => done(null, user.user_id));

  passport.deserializeUser((id, done) => {
    pool.query(
      `SELECT u.*, d.department_name 
     FROM users u 
     LEFT JOIN departments d ON u.department_id = d.department_id 
     WHERE u.user_id = $1`,
      [id],
      (err, results) => {
        if (err) return done(err);

        if (results.rows.length > 0) {
          const user = results.rows[0];
          // Добавляем поле department для удобства
          user.department = user.department_name;
          return done(null, user);
        } else {
          return done(null, false);
        }
      }
    );
  });
}

module.exports = initialize;

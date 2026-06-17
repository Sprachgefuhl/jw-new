const pool = require('../config/postgres');
const crypto = require('crypto');

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function getSubscriberByEmail(email) {
  const query = `
    SELECT *
    FROM subscribers
    WHERE email = $1
    LIMIT 1;
  `;

  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
}

async function getSubscriberByToken(token) {
  const query = `
    SELECT *
    FROM subscribers
    WHERE unsubscribe_token = $1
    LIMIT 1;
  `;

  const result = await pool.query(query, [token]);
  return result.rows[0] || null;
}

async function getAllSubscribers() {
  const result = await pool.query(`
    SELECT *
    FROM subscribers
  `);

  return result.rows;
}

async function createSubscriber(email) {
  const query = `
    INSERT INTO subscribers (email, unsubscribe_token)
    VALUES ($1, $2)
    ON CONFLICT (email)
    DO UPDATE SET email = EXCLUDED.email
    RETURNING *;
  `;

  const token = generateToken();
  const result = await pool.query(query, [email, token]);
  return result.rows[0];
}

async function deleteSubscriber(token) {
  const query = `
    DELETE FROM subscribers
    WHERE unsubscribe_token = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [token]);
  return result.rows[0] || null;
}

module.exports = { getSubscriberByEmail, getAllSubscribers, createSubscriber, deleteSubscriber };
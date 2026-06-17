const pool = require("../config/postgres");

async function getState() {
  const result = await pool.query(
    `SELECT id, last_updated, hash FROM state`
  );

  return result.rows[0] || null;
}

async function updateState(hash) {
	const result = await pool.query(`
		INSERT INTO state (id, hash, last_updated)
		VALUES ($1, $2, NOW())
		ON CONFLICT (id)
		DO UPDATE SET
			hash = EXCLUDED.hash,
			last_updated = NOW()
		RETURNING *`,
	[1, hash]);
	return result.rows[0];
}

module.exports = { getState, updateState };
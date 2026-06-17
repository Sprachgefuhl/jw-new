const supabase = require("../config/postgres");

async function getState() {
  const { data, error } = await supabase
    .from('state')
    .select('*')
		.single();

  if (error) throw error;
  return data;
}

async function updateState(hash) {
	const { data, error } = await supabase
		.from('state')
		.update({
			hash: hash,
		})
		.eq('id', 1)
		.select('*')
		.single();

	if (error) throw error;
  return data;
}

module.exports = { getState, updateState };
const supabase = require("../config/postgres");

async function getState() {
  const { data, error } = await supabase
    .from('state')
    .select('*')
		.single();

  if (error) throw error;
	return JSON.parse(data.content);
}

async function updateState(newState) {
	const { data, error } = await supabase
		.from('state')
		.update({
			content: JSON.stringify({ articles: newState.articles, videos: newState.videos }),
			last_updated: new Date()
		})
		.eq('id', 1)
		.select('*')
		.single();

	if (error) throw error;
  return data;
}

async function getLastUpdated() {
  const { data, error } = await supabase
    .from('state')
    .select('*')
		.single();

  if (error) throw error;
	return data.last_updated;
}

module.exports = { getState, updateState, getLastUpdated };
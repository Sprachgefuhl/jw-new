const supabase = require("../config/postgres");

async function getState(langRef) {
  const { data, error } = await supabase
    .from('state')
    .select('*')
		.eq('lang', langRef)
		.single();

  if (error) throw error;
	return JSON.parse(data.content);
}

async function updateState(articles, videos, langRef) {
	const { data, error } = await supabase
		.from('state')
		.update({
			content: JSON.stringify({ articles: articles, videos: videos }),
			last_updated: new Date()
		})
		.eq('lang', langRef)
		.select('*')
		.single();

	if (error) throw error;
  return data;
}

async function getLastUpdated() {
  const { data, error } = await supabase
    .from('state')
    .select('*')
		.eq('lang', 'E')
		.single();

  if (error) throw error;
	return data.last_updated;
}

module.exports = { getState, updateState, getLastUpdated };
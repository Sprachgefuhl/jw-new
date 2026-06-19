const supabase = require('../config/postgres');
const crypto = require('crypto');

async function getSubByEmail(email) {
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function getSubByToken(token) {
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .eq('unsubscribe_token', token)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function getAllSubs() {
  const { data, error } = await supabase
    .from('subscribers')
    .select('*');

  if (error) throw error;
  return data;
}

async function createSub(email) {
  const token = generateToken();

  const { data, error } = await supabase
    .from('subscribers')
    .insert([{
      email: email,
      unsubscribe_token: token
    }])
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  console.log(`👤 ${email} has subscribed!`);
  return data;
}

async function deleteSub(token) {
  const { data, error } = await supabase
    .from('subscribers')
    .delete('*')
    .eq('unsubscribe_token', token)
    .select('*')
    .maybeSingle();

  if (error) throw new Error(error.message);
  console.log(`🥹 ${data.email} has unsubscribed`);
  return data;
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

module.exports = { getSubByEmail, getAllSubs, createSub, deleteSub };
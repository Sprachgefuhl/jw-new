async function notify(message) {
  console.log('CHANGE DETECTED:');
  console.log(message);

  // later: email / discord / telegram
}

module.exports = { notify };
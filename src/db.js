const { Level } = require('level');
const path = require('path');

const dbPath = path.join(__dirname, '../database');
const db = new Level(dbPath, { valueEncoding: 'json' });
const side_nodes = db.sublevel('side_nodes', { valueEncoding: 'json' });

module.exports = {
  base: db,
  side_nodes
};

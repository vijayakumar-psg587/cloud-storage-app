const {Passthrough} = require('stream');
const fs = require('fs');
const path = require('path');
const rr =  fs.createReadStream(path.resolve(__dirname, './tests/cloud-storage/sample-read.txt'));
const wr = fs.createWriteStream(path.resolve(__dirname, './tests/cloud-storage/sample-write.txt'));
module.exports = jest.genMockFromModule('pump');

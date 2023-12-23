const fsPromises = require('fs/promises');

(async () => {
  try {
    const fileName = 'file-promise.txt'
    await fsPromises.appendFile(fileName, 'First line added!', 'utf-8');
    await fsPromises.appendFile(fileName, '\nSecond line appended.', 'utf-8');
    console.log('Added 2 lines to file.');
  } catch(err) {
    console.log('Error appending data to file', err);
  }
})();
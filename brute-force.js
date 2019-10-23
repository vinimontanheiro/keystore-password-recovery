const fs = require('fs');
const { exec } = require('child_process');

const dictionaryPath = './src/dictionary';
const resultPath = './result.txt';
const keystorePath = process.argv.slice(2);

const printError = (message) =>{
  console.log('\x1b[1m \x1b[31m', `${message}`);
};

const printInfo = (message) =>{
  console.log('\x1b[1m \x1b[34m',`${message}`);
};

const printWarn = (message) =>{
  console.log('\x1b[1m \x1b[33m',`${message}`);
};

const printSuccess = (message) =>{
  console.log('\x1b[1m \x1b[32m',`${message}`);
};

const showError = () =>{
  printError(`ERROR >> Keystore path not found!! >> ${JSON.stringify(keystorePath)}`);
  printWarn(`Please run: 'node brute-force.js your-keystore-path'`);
};

const writeResult = (result) =>{
  printSuccess(result);
  fs.writeFile(resultPath, result, function(err) {
    if(err) {
        return console.error(err);
    }
    printSuccess("The password was save in result.txt! :D");
  }); 
}

const run = () => {
  const readline = require('readline').createInterface({
    input: require('fs').createReadStream(dictionaryPath)
  });

  readline.on('line', (line) => {
    printInfo(`Trying word >> ${line}`);
    exec(`cd src/lib & keytool -list -keystore ${keystorePath} -storepass ${line}`, (err) => {
      if (!err) {
        readline.close();
        const result = `Keystore password is ${line}`;
        writeResult(result);
      }
    });
  });
};

if (keystorePath && !!keystorePath.length){
  const keystore = keystorePath[0];
  fs.access(keystore, fs.F_OK, (err) => {
    if (err) {
      showError();
      return
    }
    run(keystore);
  });
 }else{
    showError();
 }







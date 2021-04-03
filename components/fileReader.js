const path = require("path");
const fs = require("fs");

module.exports = async function returnFiles(directory, dirname) {
  let fileRead = new Promise((suc, err) => {
    new Promise((suc) => {
      fs.readdir(path.join(dirname, directory), function (err, files) {
        if (err) {
          return console.log(err);
        }
        new Promise((suc, er) => {
          let counter = 0;
          let data = [];
          let recursiveFunction = function () {
            data[files[counter]] = [];
            fs.readdir(
              path.join(dirname, path.join(directory, files[counter])),
              async function (err, insidefiles) {
                if (err) return console.log(err);
                insidefiles.forEach((index) => {
                  let fileStats = fs.statSync(
                    path.join(dirname, `${directory}${files[counter]}/${index}`)
                  );
                  data.push({
                    source: `${directory}${files[counter]}/${index}`,
                    name: index,
                    size:
                      Math.round(
                        (fileStats.size / (1024 * 1024) + Number.EPSILON) * 100
                      ) / 100,
                    path: files[counter],
                  });
                });
                counter++;
                if (counter === files.length) suc(data);
                else recursiveFunction();
              }
            );
          };
          recursiveFunction();
        }).then((val) => suc(val));
      });
    }).then((v) => suc(v));
  });
  return fileRead;
};

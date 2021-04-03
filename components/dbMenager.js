require("colors");
// const serverMenager = require("./components/simpleExpress");
const path = require("path");
const DATABASE = require("nedb");
const dbStore = new DATABASE({
  filename: path.join(__dirname, "..", "database", "playlista.db"),
  autoload: true,
});

const DBSchema = {
  songs: [],
};

module.exports = {
  readDB() {
    // odczytuję z bazy
    let czytanko = new Promise((suc, err) => {
      dbStore.findOne({}, function (e, docs) {
        suc(docs);
      });
    });
    return czytanko;
  },
  saveInDb() {
    console.log("Pasta la vista 11");
    this.readDB().then((v) => {
      console.log("Pasta la vista");
      console.log(v);
    });
  },
  removeFromDb() {},
};
autoload: true;

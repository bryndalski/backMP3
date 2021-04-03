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
  //zapisuje w bazie
  saveInDb(value) {
    let toReturn = new Promise((suc, er) => {
      this.readDB().then((v) => {
        if (v == null)
          this.createDB().then((newIndex) => {
            this.updateDb(newIndex._id, value).then((v) => suc(v));
          });
        else this.updateDb(v._id, value).then((v) => suc(v));
      });
    });
    dbStore.persistence.compactDatafile();
    return toReturn;
  },

  updateDb: (dbID, value) =>
    new Promise((suc) =>
      dbStore.update(
        { _id: dbID },
        { $push: { songs: value } },
        {},
        function () {
          dbStore.persistence.compactDatafile();

          suc();
        }
      )
    ),
  //usuwanie z bazy
  removeInDb(value) {
    let toReturn = new Promise((suc, er) => {
      this.readDB().then((v) => {
        this.removeFromDb(v._id, value).then((v) => suc(v));
      });
    });
    dbStore.persistence.compactDatafile();
    return toReturn;
  },

  removeFromDb: (dbID, value) =>
    new Promise((suc) =>
      dbStore.update(
        { _id: dbID },
        { $pull: { songs: value } },
        {},
        function (e) {
          dbStore.persistence.compactDatafile();
          suc();
        }
      )
    ),

  createDB() {
    let toReturn = new Promise((suc, err) => {
      dbStore.insert(DBSchema, function (e, doc) {
        suc(doc);
      });
    });
    return toReturn;
  },
};
autoload: true;

require("colors");
const serverMenager = require("./components/simpleExpress");
const fs = require("fs");
const http = require("http");
const path = require("path");
const qs = require("querystring");
const fileReader = require("./components/fileReader");
const dbMenager = require("./components/dbMenager");
const formidable = require("formidable");
const PORT = process.env.PORT || 3000;
const server = http.createServer(function (req, res) {
  switch (req.method) {
    case "GET":
      switch (req.url) {
        case "/admin": {
          serverMenager.fileSend(res, "admin/admin.html");
          break;
        }
        case "/getCovers": {
          fileReader("/music/covers/", __dirname).then((v) =>
            serverMenager.sendJSON(res, v)
          );
          break;
        }
        case "/getPlayList": {
          dbMenager.readDB().then((v) => {
            if (v == null || v.songs.length == 0)
              serverMenager.sendJSON(res, {
                status: "error",
              });
            else serverMenager.sendJSON(res, v.songs);
          });
          break;
        }
        case "/server.js":
        case "/components/dbMenager.js":
        case "/components/fileReader.js":
        case "/components/simpleExpress.js":
        case "/database/playlista.db":
          res.writeHead(404, {
            "Content-Type": "text/html",
          });
          res.write("<h1>błąd 404 - nie ma pliku!<h1>");
          res.end();
          break;
        default:
          serverMenager.fileSend(
            res,
            req.url.substring(1),
            serverMenager.extDetector(req.url)
          );
          break;
      }

      break;
    case "POST":
      console.log(req.url);
      switch (req.url) {
        case "/getMusic":
          serverMenager.postHadler(req).then((svrResponse) => {
            fileReader("/music/tracks/", __dirname).then((v) => {
              let resp = [];
              v.forEach((element) => {
                if (element.path == svrResponse.path) resp.push(element);
              });
              if (resp.length != 0) serverMenager.sendJSON(res, resp);
              else
                serverMenager.sendJSON(res, {
                  status: "error",
                  message: "empty directiory",
                });
            });
          });
          break;
        case "/addToPlayList": {
          serverMenager.postHadler(req).then((svrResponse) => {
            dbMenager.saveInDb(svrResponse).then((v) => {
              serverMenager.sendJSON(res, {
                status: "sucess",
                message: `do playlisty dodano utwór ${svrResponse.name}`,
              });
            });
          });
          break;
        }
        case "/removeFromPlayList": {
          serverMenager.postHadler(req).then((svrResponse) => {
            dbMenager.removeInDb(svrResponse).then((v) => {
              serverMenager.sendJSON(res, {
                status: "sucess",
                message: `z playlisty usunięto ${svrResponse.name}`,
              });
            });
          });
          break;
        }
        case "/upload": {
          let form = formidable({});
          form.keepExtensions = true;
          form.keepFilenames = true;
          form.multiples = true;
          let checkForCOver = true;
          let folderName = new Date().getTime().toString();
          console.log(folderName);
          form.on("fileBegin", function (name, file) {
            switch (file.type) {
              case "image/jpeg":
              case "image/png":
              case "image/jpg":
                checkForCOver = false;

                if (
                  !fs.existsSync(
                    path.join(__dirname, "music", "covers", folderName)
                  )
                ) {
                  fs.mkdirSync(
                    path.join(__dirname, "/music/covers/", folderName)
                  );
                }
                file.path = path.join(
                  __dirname,
                  "/music/covers/",
                  folderName,
                  file.name
                );
                break;
              default:
                if (
                  !fs.existsSync(
                    path.join(__dirname + "/music/tracks/", folderName)
                  )
                ) {
                  fs.mkdirSync(
                    path.join(__dirname + "/music/tracks/", folderName)
                  );
                }
                file.path = path.join(
                  __dirname + "/music/tracks/",
                  folderName,
                  file.name
                );
                break;
            }
          });
          form.parse(req, function (err, fields, files) {});
          form.on("end", () => {
            console.log("zakończono upload");
            if (checkForCOver) {
              if (
                !fs.existsSync(
                  path.join(__dirname, "music", "covers", folderName)
                )
              ) {
                fs.mkdirSync(
                  path.join(__dirname, "/music/covers/", folderName)
                );
              }
              let inStr = fs.createReadStream(
                path.join(__dirname, "/music", "cover.jpg")
              );
              let outStr = fs.createWriteStream(
                path.join(__dirname, "music", "covers", folderName, "cover.jpg")
              );
              inStr.pipe(outStr);
            }
          });
          break;
        }
        default:
          break;
      }
      break;
    case "OPTIONS": {
      res.writeHead(204, serverMenager.universalHeader);
      res.end();
      break;
    }
  }
});

server.listen(PORT, function () {
  console.log(`serwer startuje na porcie ${PORT}`.rainbow);
});

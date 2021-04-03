require("colors");
const serverMenager = require("./components/simpleExpress");
const fs = require("fs");
const http = require("http");
const path = require("path");
const qs = require("querystring");
const fileReader = require("./components/fileReader");
const dbMenager = require("./components/dbMenager");
const PORT = process.env.PORT || 5500;
const server = http.createServer(function (req, res) {
  switch (req.method) {
    case "GET":
      console.log(req.url);
      switch (req.url) {
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
  console.log("serwer startuje na porcie 5500".rainbow);
});

// const http = require('http')
const fs = require("fs");
const { type } = require("os");
require("colors");

const contentType = {
  html: "text/html",
  plain: "text/plain",
  css: "text/css",
  json: "application/json",
  xml: "text/xml",
  mp4: "video/mp4",
  jpeg: "image/jpeg",
  png: "image/png",
  js: "application/javascript",
  mpeg: "audio/mpeg",
  mp3: "audio / mpeg3",
  ico: "image/ico",
  svg: "image/svg+xml",
};

module.exports = {
  universalHeader: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Request-Method": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    "Access-Control-Max-Age": 2592000, // 30 days
    "Access-Control-Allow-Headers": "*",
  },
  extDetector: (url) => {
    let extenction = url.split(".").pop();
    if (extenction !== undefined) return contentType[extenction];
    else return undefined;
  },
  fileSend: (res, filePath, Ctype) => {
    let sciezka = filePath;
    sciezka = filePath.replace(/%20/g, " ");
    fs.readFile(sciezka, function (error, data) {
      if (error) {
        res.writeHead(404, {
          "Content-Type": "text/html",
        });
        res.write("<h1>błąd 404 - nie ma pliku!<h1>");
        res.end();
      } else {
        if (Ctype == contentType.mpeg || Ctype == contentType.mp3) {
          let fileStat = fs.statSync(sciezka);
          res.writeHead(200, {
            "Content-Type": Ctype == undefined ? contentType.html : Ctype,
            "Content-Length": fileStat.size,
            "Accept-Ranges": "bytes",
          });
        } else
          res.writeHead(200, {
            "Content-Type": Ctype == undefined ? contentType.html : Ctype,
          });
        res.write(data);
        res.end();
      }
    });
  },
  sendJSON(res, data) {
    console.log(data);
    res.writeHead(200, {
      "Content-Type": contentType.json,
      Accept: "application/xhtml+xml",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      ...this.universalHeader,
    });
    res.end(JSON.stringify(data));
  },
  postHadler(req) {
    let data = new Promise((sucess, err) => {
      let allData = "";
      req.on("data", (data) => (allData += data));
      req.on("end", () => {
        sucess(JSON.parse(allData));
      });
    });
    return data;
  },
};

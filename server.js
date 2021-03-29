require("colors")
const serverMenager = require('./components/simpleExpress')
const fs = require('fs')
const http = require("http");
const path = require('path');
const qs = require("querystring")
const fileReader = require('./components/fileReader')



const PORT = process.env.PORT || 5500
const server = http.createServer(function (req, res) {
    console.log(req.method)
    switch (req.method) {
        case "GET":
            console.log(req.url);
            switch (req.url) {
                case "/getCovers": {
                    console.log("YY COVERS ?")
                    fileReader("/music/covers/", __dirname).then((v) => serverMenager.sendJSON(res, v))
                    break
                }
                default:
                    serverMenager.fileSend(res, req.url.substring(1), serverMenager.extDetector(req.url))
                    break
            }
            break
        case "POST":
            switch (req.url) {
                case "/getMusic":
                    console.log("hi");
                    serverMenager.postHadler(req).then(svrResponse => {
                        // let folderek = v.path
                        fileReader("/music/tracks/", __dirname).then((v) => {
                            let resp = []
                            v.forEach(element => {
                                if (element.path == svrResponse.path)
                                    resp.push(element)
                                console.log(element)
                            })
                            console.log(resp);
                            if (resp.length != 0)
                                serverMenager.sendJSON(res, resp)
                            else
                                serverMenager.sendJSON(res, {
                                    status: "error",
                                    message: "empty directiory"
                                })

                        })
                    })
                    break;

                default:
                    break;
            }
            break
        case "OPTIONS": {
            res.writeHead(204, serverMenager.universalHeader)
            res.end()
            break
        }
    }
})




server.listen(PORT, function () {
    console.log("serwer startuje na porcie 5500".rainbow)
});
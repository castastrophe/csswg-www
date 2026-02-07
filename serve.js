import express from 'express';
import { static as staticMiddleware } from 'express';
import fp from 'find-free-port';
const app = express()
const port = 3000
import { existsSync } from 'fs';

/*********************/
/* CONFIG            */
/*********************/
const siteRoot = '_site';
const availableLangs = ['fr', 'de', 'en'];
const defaultLang = 'en';


app.use(function (req, res, next) {

    var language = req.acceptsLanguages(availableLangs);

    var newUrl = req.originalUrl + '.' + language + '.html';
    var newPath = (__dirname + '/' + siteRoot + newUrl);

    var indexUrl = req.originalUrl + 'index.' + language + '.html';
    var indexPath = (__dirname + '/' + siteRoot + indexUrl);

    var defaultUrl = req.originalUrl + '.' + defaultLang + '.html';
    var defaultPath = (__dirname + '/' + siteRoot + defaultUrl);

    if (existsSync(newPath)) {
        req.url = newUrl;
    } else if (existsSync(indexPath)) {
        req.url = indexUrl;
    } else if (existsSync(defaultPath)) {
        req.url = defaultUrl;
    }
    next();
});

app.use(staticMiddleware(siteRoot));


fp(port, function (err, freePort) {
    app.listen(freePort, () => console.log(`Listening on port ${freePort}!`))
});


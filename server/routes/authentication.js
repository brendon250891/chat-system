const { ModuleResolutionKind } = require("typescript");
module.exports = (app, path) => {
    app.post('/register', (request, response) => {
        console.log(request.body);
    });
}
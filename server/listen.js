module.exports = {
    listen: (http, PORT) => {
        http.listen(PORT, () => {
            let date = new Date();
            console.log(`Server started on port: ${PORT} at ${date.getHours()}:${date.getMinutes()}`);
        });
    }
}
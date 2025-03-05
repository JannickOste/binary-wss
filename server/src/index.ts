import Server from "./Server";

(async() => {
    console.log("Starting server...");  
    const server = new Server(8080);
    console.log("Server started!");
})();
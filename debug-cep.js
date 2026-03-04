const http = require("http");
http.get("http://localhost:8088/json", (res) => {
    let rawData = "";
    res.on("data", (chunk) => { rawData += chunk; });
    res.on("end", () => { console.log(rawData); });
}).on("error", (e) => {
    console.error(`Error: ${e.message}`);
});

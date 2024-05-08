const fs = require("fs");

const writeAndDownloadData = (filePath, data, res) => {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFile(filePath, jsonData, "utf8", (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      res.status(500).send("Error creating data!"); // Send error response
    } else {
      console.log("Data written to file successfully!");
      const fileStream = fs.createReadStream(filePath);
      res.setHeader("Content-Type", "text/plain"); // Set content type for plain text
      res.setHeader("Content-Disposition", 'attachment; filename="data.txt"'); // Set attachment for download
      fileStream.pipe(res); // Stream the file content to the response
      fileStream.on("end", () => {
        fs.unlink(filePath, (unlinkErr) => {
          // Delete temporary file after download
          if (unlinkErr) {
            console.error("Error deleting temporary file:", unlinkErr);
          }
        });
      });
    }
  });
};

module.exports = writeAndDownloadData;

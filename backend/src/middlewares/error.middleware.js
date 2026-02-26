function errorHandler(err, req, res, next) {
  console.error(err.message);

  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "Uploaded file exceeds 5MB limit" });
    }
    return res.status(400).json({ error: err.message || "File upload error" });
  }

  if (err.details && Array.isArray(err.details)) {
    return res
      .status(400)
      .json({ error: err.details[0].message }); 
     
  }
  res
    .status(err.statusCode || 500)
    .json({ error: err.message || "server error" });
}

module.exports = errorHandler;

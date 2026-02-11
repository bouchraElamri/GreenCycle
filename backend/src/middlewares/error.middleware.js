function errorHandler(err, req, res, next) {
  console.error(err.message);
  if (err.details && Array.isArray(err.details)) {
    return res
      .status(400)
      .json({ error: err.details[0].message }); 
     
  }
  res
    .status(err.statusCode || 500)
    .json({ error: err.message || "Erreur serveur" });
}

module.exports = errorHandler;
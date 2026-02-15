const isAvailable = (req, res, next) => {
	const originalJson = res.json.bind(res);

	res.json = (data) => {
		try {
			// Handle arrays of products (Mongoose docs or plain objects)
			if (Array.isArray(data)) {
				const filtered = data.filter((item) => {
					if (!item) return false;
					// item may be a Mongoose document with _doc
					const doc = item._doc ? item._doc : item;
					// treat missing isAvailable as true
					return doc.isAvailable !== false;
				});
				return originalJson(filtered);
			}

			// Handle single product object
			if (data && typeof data === 'object') {
				const doc = data._doc ? data._doc : data;
				if (Object.prototype.hasOwnProperty.call(doc, 'isAvailable')) {
					if (doc.isAvailable === false) {
						return res.status(404).json({ message: 'Product not available' });
					}
				}
			}

			return originalJson(data);
		} catch (err) {
			// In case of any error, fall back to original behavior
			return originalJson(data);
		}
	};

	next();
};

module.exports = { isAvailable };
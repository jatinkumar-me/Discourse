import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
	try {
		const authHeader = req.headers["authorization"];
		const token = authHeader.split(" ")[1];
		if (!token)
			return res.status(401).json({ message: "Authorization denied!" });
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

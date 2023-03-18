import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
   try {
      const { firstName, lastName, email, password, location, occupation } =
         req.body;
		if (await User.exists({ email }))
			return res.status(500).json({ msg: "Email already used" });
         const salt = await bcrypt.genSalt();
         const hashedPassword = await bcrypt.hash(password, salt);
		const newUser = new User({
			firstName,
			lastName,
			email,
			password: hashedPassword,
			location,
			occupation,
		});
      
		const savedUser = await newUser.save();
      delete savedUser.password;
		res.status(201).json(savedUser);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ msg: "User doesn't exist" });
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return res.status(400).json({ msg: "Invalid password or username" });
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
		user.password = undefined;
		console.log(user);
		res.status(200).json({ token, user });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

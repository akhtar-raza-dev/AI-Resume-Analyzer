
const UserModel = require('../Models/user');

exports.register = async (req, res) => {
    try {
        const { name, email, photoUrl } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        let userExist = await UserModel.findOne({ email });

        if (!userExist) {
            const newUser = new UserModel({ name, email, photoUrl });
            await newUser.save();

            return res.status(200).json({
                message: "User Registered Successfully",
                user: newUser
            });
        }

        return res.status(200).json({
            message: "Welcome Back",
            user: userExist
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};
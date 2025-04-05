import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Read token from cookies

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = await jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded) {
      throw new Error();
    }

    req.user = decoded; // Attach the decoded user to the request

    next(); // Continue to the next middleware/route handler
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error Validating Token" });
  }
};

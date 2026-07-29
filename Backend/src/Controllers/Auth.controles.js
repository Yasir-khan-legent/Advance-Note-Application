import Users from "../Models/Auth.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookieParser from "cookie-parser";
import { generateAccess, generateRefresh } from "../../utils/GenrateToken.js";
const refreshSecret = process.env.REFRESH_SECRET;
const accessSecret = process.env.ACCESS_SECRET;

// const secretstring = process.env.SECRET_STRING;


export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.refreshToken) {
      user.refreshToken = [];
    }
    const refreshToken = generateRefresh(user);
    const accessToken = generateAccess(user);
    
    user.refreshToken.push({ token: refreshToken });
    // user.refreshToken.push(refreshToken);

    await user.save();

    res.cookie("refreshToken", refreshToken, {
        secure: true,        // 🔥 MUST be true in production (HTTPS)
  sameSite: "None", 
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.status(200).json({ token: accessToken, message: "login" });
  } catch (err) {
    console.log(err.message);

    return res.status(500);
  }
}
export async function signup(req, res) {
  const { name, email, password } = req.body;

  const hashPassword = await bcrypt.hash(password, 10);
  const existingUser = await Users.findOne({ email });
if (existingUser) {
  return res.status(400).json({ message: "Email already exists" });
}
  try {
    const user = await Users.create({
      email,
      name,
      password: hashPassword,
    });

//     const refreshToken = generateRefresh(user);
//     const accessToken = generateAccess(user);
//     user.refreshToken = [{ token: refreshToken }];
// await user.save();

//     res.cookie("refreshToken", refreshToken, {
//       secure: false,
//       httpOnly: true,
//       maxAge: 1000 * 60 * 60 * 24 * 7,
//     });
return res.status(201).json({
//   token: accessToken,
  message: "signup sucsses fully please login"
});
  } catch (err) {
    console.error(err.message);
    return res.status(500);
  }
}


export async function refreshToken(req, res) {
  const oldToken = req.cookies.refreshToken;
  if (!oldToken) {
    return res.status(404).json({
      message: "No token found",
    });
  }
  try {
    const decoded = jwt.verify(oldToken, process.env.REFRESH_SECRET);
    const user = await Users.findById(decoded.user);
    // approch number 1
    // if (!user || user.refreshToken !== oldToken) {
    //   return res.status(403).json({
    //     message: "user not found with this token.",
    //   });
    // }
    if (!user) {
      return res.status(403).json({
        message: "user not found with this token.",
      });
    }
    const existingToken = user.refreshToken.find((t) => t.token === oldToken);
    if (!existingToken) {
      // to prevent being heacked

      return res.status(403).json({
        message: "Refresh already used.",
      });
    }
    user.refreshToken = user.refreshToken.filter((t) => t.token !== oldToken);
    const refreshToken = generateRefresh(user);
    const accessToken = generateAccess(user);
    // approch number 1
    // user.refreshToken = refreshToken;

    user.refreshToken.push({ token: refreshToken });

    await user.save();

    res.cookie("refreshToken", refreshToken, {
   
        secure: true,        // 🔥 MUST be true in production (HTTPS)
  sameSite: "None", 
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res
      .status(200)
      .json({ token: accessToken, message: "send access token" });
  } catch (err) {
    console.error(err.message);
    return res.status(500);
  }
}


export async function logout(req, res) {
  const oldToken = req.cookies.refreshToken;
  console.log(oldToken)

  if (!oldToken) {
    return res.status(400).json({ message: "No token found" });
  }

  try {
    const decoded = jwt.verify(oldToken, process.env.REFRESH_SECRET);
    const user = await Users.findById(decoded.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.refreshToken = user.refreshToken.filter(
      (t) => t.token !== oldToken
    );

    await user.save();
    res.clearCookie("refreshToken");

    return res.status(200).json({ message: "User logout" });
  } catch (error) {
    console.error(error.message);
    return res.status(403).json({ message: "Invalid token" });
  }
}
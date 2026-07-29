import jwt from "jsonwebtoken";
// const refreshSecret = process.env.REFRESH_SECRET;
// const accessSecret = process.env.ACCESS_SECRET;

export function generateRefresh(user) {
  return jwt.sign({ user: user._id }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
}
export function generateAccess(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.ACCESS_SECRET, {
    expiresIn: "15min",
  });
}

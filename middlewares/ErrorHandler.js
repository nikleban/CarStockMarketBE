export default function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  const isAuthRoute =
    req.originalUrl.startsWith("/api/users") &&
    (req.originalUrl.includes("login") || req.originalUrl.includes("register"));

  let publicMessage = "Server error";

  if (err.isOperational && err.message) publicMessage = err.message;

  if (isAuthRoute) {
    if (statusCode === 400) publicMessage = "Invalid request";
    else if (statusCode === 401) publicMessage = "Invalid credentials";
    else if (statusCode === 409) publicMessage = "Unable to complete request";
    else publicMessage = "Unable to complete request";
  }

  if (!err.isOperational && err?.name) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({ ok: false, message: "Invalid data" });
    }
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ ok: false, message: "Conflict" });
    }
    if (err.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ ok: false, message: "Invalid reference" });
    }
  }

  return res.status(statusCode).json({
    ok: false,
    message: publicMessage,
  });
}
export const authRoles = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const { role } = req.user;
      // Check if the user's role matches any of the allowed roles
      if (!allowedRoles.includes(role)) {
        return res
          .status(403)
          .json({ error: "Access denied: Insufficient permissions" });
      }

      next(); // User has the correct role, proceed to the next middleware or handler
    } catch (error) {
      console.error("Error in authRoles middleware:", error);
      return res
        .status(500)
        .json({ error: "Error while checking permitted roles" });
    }
  };
};

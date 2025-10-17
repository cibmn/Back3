export const isAuth = (req, res, next) => {
  if (process.env.NODE_ENV === "test") {
    // asigna rol según lo que el test quiera simular
    const testRole = req.headers["x-test-role"]; // usa un header para diferenciar
    if (testRole === "admin") req.user = { id: "fakeAdminId", role: "admin" };
    else if (testRole === "user") req.user = { id: "fakeUserId", role: "user" };
    else req.user = { id: "fakeUserId", role: "user" }; // default
  } else {
    // tu lógica real de auth para producción
  }
  next();
};

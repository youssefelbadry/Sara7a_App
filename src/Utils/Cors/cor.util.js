export function corOptions() {
  const whiteList = ["http://localhost:4200", "http://localhost:5500"];
  const corsOptions = {
    origin: function (origin, cb) {
      if (!origin) {
        cb(null, true);
      } else if (whiteList.includes(origin)) {
        cb(null, true);
      } else {
        return next(new Error("Not allowed by cors"));
      }
    },
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
  };
  return corsOptions;
}

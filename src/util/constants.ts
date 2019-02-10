export const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

export const corsOptions = {
  origin: clientUrl,
  credentials: true
};

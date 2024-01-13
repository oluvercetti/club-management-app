export const env = {
    BASE_URL: process.env.BASE_URL || "http://localhost:3000/",
    PORT: process.env.PORT,
    MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING || "mongodb://127.0.0.1:27017/clubmanagement",
    TOKEN_SECRET_KEY: process.env.TOKEN_SECRET_KEY,
    EMAIL_ADDRESS_OWNER: process.env.EMAIL_ADDRESS_OWNER,
    EMAIL_ADDRESS_PW: process.env.EMAIL_ADDRESS_PW,

};
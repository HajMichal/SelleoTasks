-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phoneNumber" INTEGER,
    "firstName" TEXT,
    "lastName" TEXT,
    "shirtSize" TEXT,
    "preferredTechnology" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

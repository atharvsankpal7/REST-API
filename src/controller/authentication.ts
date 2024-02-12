import { createUser, getUserByEmail } from "DB/Schema/users";
import express from "express";
import {
    getEncryptedPassword,
    getRandomCryptoString,
} from "helpers/authenticationHelper";
export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select(
            "+authentication.salt +authentication.password"
        );

        if (!user) {
            return res.sendStatus(400);
        }

        const expectedHash = getEncryptedPassword(
            user.authentication.salt,
            password
        );

        if (user.authentication.password != expectedHash) {
            return res.sendStatus(403);
        }

        const salt = getRandomCryptoString();
        user.authentication.sessionToken = getEncryptedPassword(
            salt,
            user._id.toString()
        );

        await user.save();

        res.cookie("ANTONIO-AUTH", user.authentication.sessionToken, {
            domain: "localhost",
            path: "/",
        });

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
export const registerUser = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { email, password, username } = req.body;

        if (!email) {
            return res.send(400).send("Please provide email");
        }
        if (!password) {
            return res.send(400).send("Please provide password");
        }
        if (!username) {
            return res.send(400).send("Please provide username");
        }

        // if user already exist
        let user = await getUserByEmail(email);
        if (user) {
            return res.send(409).send("User with this email already exist");
        }

        const salt = getRandomCryptoString();
        user = await createUser({
            email,

            username,
            authentication: {
                password: getEncryptedPassword(salt, password),
                salt,
            },
        });

        return res.send(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.send(500).send("Internal server error");
    }
};

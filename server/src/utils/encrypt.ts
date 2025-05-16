import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export const hashPassword = async (plainPassword: string) => {
    try{
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(plainPassword, saltRound);
        return hashedPassword;
    } catch(error){
        console.error(error);
        throw error;
    }
}

export const verifyPassword = async (plainPassword: string, hashedPassword: string) => {
    try{
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch(error){
        console.error(error);
        throw error;
    }

}


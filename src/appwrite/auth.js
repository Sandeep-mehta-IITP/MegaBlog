import config from "../conf/config.js";
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    // jo bhi instance bnayenge , uske liye yeh authomatic define ho jayega
    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);
        this.account = new Account(this.client);
    }

    // account creation 
    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                //call another method
                return this.login({email, password});
              
            } else {
                return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    // user login 
    async login({email, password}) {
        try {
          return  await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    // user login h ya nhi find krna
    async getCurrentUser() {
        try {
           return await this.account.get(); 
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error);
            
        }

        return null;
    }

    // user logout 
    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);
            
        }
    }
}


const authService = new AuthService();

export default authService;
import { Account, Client, Databases } from "react-native-appwrite";
export const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!) // Your Appwrite Endpoint
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!); // Your project ID
    export const account = new Account(client);
    export const databases = new Databases(client);

    export const DATABASE_ID =process.env.EXPO_PUBLIC_DB_ID!;
    export const HABITS_COLLECTION_ID = process.env.EXPO_PUBLIC_HABITS_COLLECTION_ID!;
   export const HABITS_COMPLETION_COLLECTION_ID = process.env.EXPO_PUBLIC_HABITS_COMPLETION_COLLECTION_ID!;
export interface RealTimeResponse {
  events: string[];
  payload: any;
}

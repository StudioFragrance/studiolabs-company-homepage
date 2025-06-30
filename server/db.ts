import "reflect-metadata";
import { AppDataSource } from "../ormconfig";

// re-export for consistency
export { AppDataSource };

export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Database connection established");
    }
  } catch (error) {
    console.error("Error during database initialization:", error);
    throw error;
  }
};


import { SequelizeTimestamps } from "./Sequelize";

/** A seeded Permission in the system */
export interface Permission extends SequelizeTimestamps {
    id: string;
    name: string;
    description: string;
  }

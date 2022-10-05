/** Sequelize will automatically apply createdAt and updatedAt timestamps to objects when they are created or updated. Some items will be soft deleted and have a "deletedAt" property.  */
export interface SequelizeTimestamps {
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

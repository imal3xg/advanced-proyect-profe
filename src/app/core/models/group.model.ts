// src/app/core/group.model.ts
import { Model } from "./base.model";

// Define the Group interface, matching the JSON structure
export interface Group extends Model {
    name: string;             // Name of the group
    country?: string;
    picture?:string;
    personas?: string[];        // Array of person IDs, optional
}

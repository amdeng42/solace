import { InferSelectModel } from "drizzle-orm";
import { advocates } from "@/db/schema";

type AdvocateBase = InferSelectModel<typeof advocates>;

export type Advocate = Omit<AdvocateBase, "specialties"> & {
  specialties: string[];
};

export type PaginatedResponse = {
  data: Advocate[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export type SearchMetadata = {
  specialties: string[];
  cities: string[];
};
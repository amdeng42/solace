import isNaN from "lodash/isNaN";
import toNumber from "lodash/toNumber";
import { ilike, or, sql, count} from "drizzle-orm";
import db from "@/db";
import { advocates } from "@/db/schema";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search")?.toLowerCase();
  const specialty = searchParams.get("specialty");
  const city = searchParams.get("city");

  // pagination parameters
  const page = Math.max(1, toNumber(searchParams.get("page") || "1"));
  const pageSize = Math.max(1, toNumber(searchParams.get("pageSize") || "10"));
  const offset = (page - 1) * pageSize;

  // query buiilder
  const conditions = [];
  const baseQuery = db.select().from(advocates);
  const baseQueryCount = db.select({ count: count() }).from(advocates);

  if (search) {

    // search all string fields
    conditions.push(
      or(
        ilike(advocates.firstName, `%${search}%`),
        ilike(advocates.lastName, `%${search}%`),
        ilike(advocates.city, `%${search}%`),
        ilike(advocates.degree, `%${search}%`)
      )
    );
  
    // specialties requires special handling
    conditions.push(
      sql`${advocates.specialties}::text ILIKE ${`%${search}%`}`
    );

    const searchNumber = toNumber(search)

    // phoneNumber requires special handling
    if (!isNaN(searchNumber) && search.length >= 3) { // we should have at least 3 digits before we can search (arbitrary limit)
      conditions.push(
        sql`${advocates.phoneNumber}::text ILIKE ${`%${search}%`}`
      );
    }
  
    // yearsOfExperience requires special handling.
    if (!isNaN(searchNumber) && searchNumber > 0 && searchNumber < 100) { // set arbitrary limits
      conditions.push(
        sql`${advocates.yearsOfExperience} = ${searchNumber}`
      );
    }
  } else if (specialty || city) {
    // if no search term, we can use the other filters directly
    if (specialty) {
      conditions.push(
        sql`${advocates.specialties}::text ILIKE ${`%${specialty}%`}`
      );
    }
    if (city) {
      conditions.push(
        ilike(advocates.city, `%${city}%`)
      );
    }
  }

  const queryCount = conditions.length? baseQueryCount.where(or(...conditions)) : baseQueryCount;

  // execute count query first to get total results
  const [countResult] = await queryCount;
  const totalItems = Number(countResult?.count || 0);
  const totalPages = Math.ceil(totalItems / pageSize);

  // apply pagination to the main query
  const queryBuilder = conditions.length? baseQuery.where(or(...conditions)) : baseQuery;
  const query = queryBuilder
    .limit(pageSize)
    .offset(offset)
    .orderBy(advocates.lastName, advocates.firstName); // sort by last name, then first name


  const data = await query;
  return Response.json({
    data,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
}
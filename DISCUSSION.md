# Instructions
1. npm i
2. make up
3. make migrate
4. npm run dev
5. make loaddata

# Improvements

1. Specialties and cities returned by the metadata endpoint should be stored in the database.

2. Additional fields should be added to the advanced search, and the query should be changed from OR to AND.

3. The advanced search should use multiselect fields instead of dropdowns to allow the user to select multiple values for each field.

4. Surface fetch errors should be displayed to the user via a toast message.

5. Discuss the use case for storing specialties as a JSON field instead of a separate table in the DB.
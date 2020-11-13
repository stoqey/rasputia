// Import the Google Cloud client library using default credentials
import { BigQuery } from "@google-cloud/bigquery";
import { log } from "../logs";

/**
 * QueryData
 * @param query e.g `SELECT name
 * FROM \`bigquery-public-data.usa_names.usa_1910_2013\`
 * WHERE state = 'TX'
 * LIMIT 100`;
 * @param options see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
 */
export const queryData = async (
  query: string,
  options?: any,
): Promise<any[]> => {
  // Queries the U.S. given names dataset for the state of Texas.

  const bigquery = new BigQuery();

  try {
    //
    const allOptions = {
      ...options,
      query,
    };

    if (!allOptions.location) {
      // Location must match that of the dataset(s) referenced in the query.
      allOptions.location = "US";
    }

    // Run the query as a job
    const [job] = await bigquery.createQueryJob(allOptions);
    log(`Job ${job.id} started.`);

    // Wait for the query to finish
    const [rows] = await job.getQueryResults();

    // Print the results
    log("Rows: => ", rows.length);

    return rows;
  } catch (error) {
    log("error querying data", error);
    return [];
  }
};

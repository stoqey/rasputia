import { BigQuery } from "@google-cloud/bigquery";
import { log } from "../logs";

/**
 *
 * @param datasetId
 * @param location - e.g "US" Specify the geographic location where the dataset should reside
 * @param options
 */
export const createDataset = async (
  datasetId = "my_new_dataset",
  location: string = "US",
  options?: any,
): Promise<any | null> => {
  const bigquery = new BigQuery();

  try {
    // Create a new dataset
    const [dataset] = await bigquery.createDataset(datasetId, {
      ...options,
      location,
    });

    log(`Dataset ${dataset.id} created.`);

    return dataset;
  } catch (error) {
    log("error creating the dataset", error);
    return null;
  }
};

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

/**
 * Delete a dataset
 * @param datasetId
 */
export const deleteDataset = async (datasetId: string): Promise<boolean> => {
  const bigquery = new BigQuery();

  try {
    // Create a reference to the existing dataset
    const dataset = bigquery.dataset(datasetId);

    // Delete the dataset and its contents
    await dataset.delete({ force: true });
    log(`Dataset ${dataset.id} deleted.`);

    return true;
  } catch (error) {
    log("error deleting the dataset", error);
    return false;
  }
};

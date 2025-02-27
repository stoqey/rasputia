import { BigQuery } from "@google-cloud/bigquery";
import { isEmpty } from "lodash";
import { log } from "../logs";

/**
 * https://cloud.google.com/bigquery/docs/schemas#standard_sql_data_types
 */
export interface Field {
  name: string; // "Name";
  type:
    | "INT64"
    | "FLOAT64"
    | "NUMERIC"
    | "BOOL"
    | "STRING"
    | "BYTES"
    | "DATE"
    | "DATETIME"
    | "TIME"
    | "TIMESTAMP"
    | "STRUCT"
    | "GEOGRAPHY";
  mode?: string; // 'REQUIRED'
}

/**
 * Create a table in a dataset
 * @param datasetId
 * @param tableId
 * @param schema Field[]
 *
 * e.g
 * const datasetId = "my_dataset";
 * const tableId = "my_table";
 * const schema = 'Name:string, Age:integer, Weight:float, IsMagic:boolean';
 *
 * or
 *
 * schema = [
 *    {name: 'Name', type: 'STRING', mode: 'REQUIRED'},
 *    {name: 'Age', type: 'INTEGER'},
 *    {name: 'Weight', type: 'FLOAT'},
 *    {name: 'IsMagic', type: 'BOOLEAN'},
 * ]
 *
 * For all options, see https://cloud.google.com/bigquery/docs/reference/v2/tables#resource
 */
export const createTable = async (
  datasetId: string,
  tableId: string,
  schema: Field[] | string,
  options?: any,
): Promise<boolean | any> => {
  const bigquery = new BigQuery();

  const appliedOptions = {
    ...options,
    schema,
  };

  if (isEmpty(appliedOptions.location)) {
    appliedOptions.location = "US"; // default to  US
  }

  try {
    // Create a new table in the dataset
    const [table] = await bigquery
      .dataset(datasetId)
      .createTable(tableId, appliedOptions);
    return table;
  } catch (error) {
    log("error creating table", error);
    return null;
  }
};

/**
 * Delete a table
 * @param datasetId
 * @param tableId
 */
export const deleteTable = async (
  datasetId: string,
  tableId: string,
): Promise<boolean> => {
  const bigquery = new BigQuery();

  try {
    // Create a reference to the existing dataset
    await bigquery
      .dataset(datasetId)
      .table(tableId)
      .delete({ ignoreNotFound: true });

    log(`Table ${tableId} deleted.`);

    return true;
  } catch (error) {
    log("error table the dataset", error);
    return false;
  }
};

/**
 * Insert row into a table
 * @param datasetId
 * @param tableId
 * @param rows - an array of rows
 */
export const tableInsert = async (
  datasetId: string,
  tableId: string,
  rows: any[],
): Promise<boolean> => {
  const bigquery = new BigQuery();

  try {
    // Create a reference to the existing dataset
    await bigquery.dataset(datasetId).table(tableId).insert(rows);

    log(`TABLE: ${rows.length} items inserted into table ${tableId}`);

    return true;
  } catch (error) {
    log("error inserting data into the table", error);
    return false;
  }
};

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

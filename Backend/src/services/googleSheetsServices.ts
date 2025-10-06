import { google } from "googleapis";
import { JWT } from "google-auth-library";
import fs from "fs";
import path from "path";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));

const client = new google.auth.JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: SCOPES,
});

const sheets = google.sheets({ version: "v4", auth: client });

// ✅ Fetch all rows from a sheet
export async function getSheetRows(sheetName: string) {
  try {
    await client.authorize();
    console.log(`Fetching data from sheet: ${sheetName}`);
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${sheetName}!A1:Z1000`,
    });
    const rows = res.data.values || [];
    console.log(`Successfully fetched ${rows.length} rows from ${sheetName}`);
    if (rows.length < 1) return [];
    const [header, ...data] = rows;
    return data.map((row) =>
      Object.fromEntries(header.map((h, i) => [h, row[i] ?? ""]))
    );
  } catch (error) {
    console.error(`Error fetching data from sheet ${sheetName}:`, error);
    throw new Error(`Failed to fetch data from Google Sheets: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// ✅ Append a single row
export async function appendSheetRow(sheetName: string, row: string[]) {
  await client.authorize();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${sheetName}!A1`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
}

// ✅ Update row (rowIndex includes header row)
export async function updateSheetRow(sheetName: string, rowIndex: number, row: string[]) {
  await client.authorize();
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${sheetName}!A${rowIndex + 1}`, // rowIndex=0 is header
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
}

// ✅ Delete row (rowIndex includes header row)
export async function deleteSheetRow(sheetName: string, rowIndex: number) {
  await client.authorize();
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: await getSheetId(sheetName),
              dimension: "ROWS",
              startIndex: rowIndex,     // includes header
              endIndex: rowIndex + 1,
            },
          },
        },
      ],
    },
  });
}

// Helper to get Google sheetId
async function getSheetId(sheetName: string): Promise<number> {
  await client.authorize();
  const res = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const sheet = res.data.sheets?.find(
    (s) => s.properties?.title === sheetName
  );
  if (!sheet) throw new Error(`Sheet '${sheetName}' not found`);
  return sheet.properties!.sheetId!;
}

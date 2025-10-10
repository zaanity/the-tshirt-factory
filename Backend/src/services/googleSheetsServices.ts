// Frontend: no — this is Backend/services/googleSheetsServices.ts
import { google } from "googleapis";
import { JWT } from "google-auth-library";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
if (!SHEET_ID) {
  throw new Error("Missing required env var: GOOGLE_SHEET_ID");
}

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

function getCredentialsFromEnv(): { client_email: string; private_key: string } {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error(
      "Missing GOOGLE_SERVICE_ACCOUNT_JSON environment variable. Set it to the service account JSON."
    );
  }

  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    // Some CI/UI copy/pastes replace newlines — try to unescape common newline escapes
    try {
      const maybeFixed = raw.replace(/\\n/g, "\n");
      parsed = JSON.parse(maybeFixed);
    } catch (err2) {
      console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:", err2);
      throw new Error("Invalid GOOGLE_SERVICE_ACCOUNT_JSON JSON format");
    }
  }

  if (!parsed.client_email || !parsed.private_key) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON is missing required fields (client_email/private_key)"
    );
  }

  return { client_email: parsed.client_email, private_key: parsed.private_key };
}

// Create a JWT client using credentials from env (no disk access)
function createJwtClient() {
  const creds = getCredentialsFromEnv();
  const client = new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: SCOPES,
  });
  return client;
}

const client = createJwtClient();
const sheets = google.sheets({ version: "v4", auth: client });

// ✅ Fetch all rows from a sheet
export async function getSheetRows(sheetName: string) {
  try {
    await client.authorize();
    console.log(`Fetching data from sheet: ${sheetName}`);
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID!,
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
    throw new Error(
      `Failed to fetch data from Google Sheets: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

// ✅ Append a single row
export async function appendSheetRow(sheetName: string, row: string[]) {
  await client.authorize();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID!,
    range: `${sheetName}!A1`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
}

// ✅ Update row (rowIndex includes header row)
export async function updateSheetRow(
  sheetName: string,
  rowIndex: number,
  row: string[]
) {
  await client.authorize();
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID!,
    range: `${sheetName}!A${rowIndex + 1}`, // rowIndex=0 is header
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
}

// ✅ Delete row (rowIndex includes header row)
export async function deleteSheetRow(sheetName: string, rowIndex: number) {
  await client.authorize();
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID!,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: await getSheetId(sheetName),
              dimension: "ROWS",
              startIndex: rowIndex, // includes header
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
  const res = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID! });
  const sheet = res.data.sheets?.find(
    (s) => s.properties?.title === sheetName
  );
  if (!sheet) throw new Error(`Sheet '${sheetName}' not found`);
  return sheet.properties!.sheetId!;
}

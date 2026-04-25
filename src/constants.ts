/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const ORDER_SET_VALIDATION = [
  "Missing_item_sent",
  "128_Pcs_Magnetic_Sticks",
  "100_Pcs_Magnetic_Sticks",
  "84_Pcs_Magnetic_Sticks",
  "64_Pcs_Magnetic_Sticks",
  "42_Pcs_Magnetic_Sticks",
  "36_Pcs_Magnetic_Sticks",
  "Tent_3ft",
  "Tent_Medium",
  "House_tent",
  "Castle_Tent",
  "34x10_Swimming_Pool",
  "45x10_Swimming_Pool",
  "120cm_Swimming_Pool",
  "120cm_Swimming_Pool_E",
  "150cm_Swimming_Pool",
  "210cm_Swimming_Pool",
  "TriCycle",
  "Tent3Feet_TriCycle_Helmet",
  "HouseTent_TriCycle_Helmet",
  "Intellegence_Book",
  "Intellegence_Book_Combo_5",
  "Intellegence_Book_Combo_4",
  "Intellegence_Book_Combo_3",
  "Education_Board",
  "Intellegence_Book_Combo_1",
  "Intellegence_Book_Combo_2",
  "Educational_Computer",
  "Flash_Card_Device",
  "208_pcs_Art_Set",
  "145_pcs_Briefcase_Art_Set",
  "Off_Road_NS_4WHL",
  "Off_Road_S_4WHL",
  "Off_Road_S_6WHL",
  "Police_Model_Car",
  "Drift_Race_Car",
  "RC_Stunt_Car",
  "Transparent_Gear_Train",
  "Stop_Motor_Bike_360",
  "CNG",
  "Motor_Vespa_Scooter",
  "Mini_Motor_Bike_Male",
  "Mini_Motor_Bike_Female",
  "3_in_1_Car_Combo",
  "Money_Box_Bank",
  "Smoke_Kitchen_Set",
  "Big_Kitchen_Set",
  "20Pcs_Ktichen_Set",
  "Dream_Kitchen_Set",
  "Aircraft_4_Axis",
  "40_Pcs_Special_wooden_toy_Set",
  "41_Pcs_wooden_toy_Set",
  "80_Pcs_wooden_toy_set",
  "60_Pcs_new_wooden_toy_set",
  "55_Pcs_wooden_toy_set",
  "47_Pcs_wooden_toy_set",
  "50_Pcs_wooden_toy_set",
  "51_Pcs_wooden_toy_set",
  "52_Pcs_big_wooden_toy_set",
  "52_Pcs_wooden_toy_set",
  "58_Pcs_wooden_toy_set",
  "60_Pcs_wooden_toy_set",
  "48_Pcs_wooden_toy_set",
  "49_Pcs_wooden_toy_set",
  "46_Pcs_wooden_toy_set",
  "40_Pcs_wooden_toy_set",
  "42_Pcs_wooden_toy_set",
  "21_Pcs_wooden_toy_set",
  "15_Pcs_wooden_toy_set",
  "15_Pcs_big_wooden_toy_set",
  "24_Pcs_wooden_toy_set",
  "16_Pcs_wooden_toy_set",
  "19_Pcs_wooden_toy_set",
  "20_Pcs_wooden_toy_set",
  "44_Pcs_wooden_toy_set",
  "50_Pcs_wooden_toy_set_other",
  "22_Pcs_wooden_toy_set_other",
  "35_Pcs_wooden_toy_set",
  "32_Pcs_wooden_toy_set",
  "36_Pcs_wooden_toy_set",
  "14_Pcs_wooden_toy_set",
  "16_Pcs_wooden_toy_set_2",
  "44_Pcs_wooden_toy_set_other",
  "Churidani",
  "Plastic_Ball",
  "Drawing_Tablet_8_inch",
  "Magic_Pen",
  "Other_item"
];

export const CSV_COLUMNS = [
  "Order Person",
  "Order Country",
  "Order Status",
  "Order ID",
  "Name",
  "Mobile Number",
  "Detail Address",
  "District",
  "Thana",
  "Order Set",
  "Note",
  "Sales Person",
  "QTY",
  "Total"
];

export const SYSTEM_PROMPT = `
You are an expert order processing system. Your task is to parse Bengali order texts and produce CSV-style rows in English.
Matching the following Google Sheets column order:
Order Person; Order Country; Order Status; Order ID; Name; Mobile Number; Detail Address; District; Thana; Order Set; Note; Sales Person; QTY; Total

Processing Rules:
1. ORDER PERSON: Extract the first field (usually sender number). Remove '+' sign. If a Facebook name, keep it.
2. ORDER COUNTRY: 
   - Based on phone code: +966 -> Saudi Arabia, +880 -> Bangladesh, +971 -> UAE, +973 -> Bahrain, +974 -> Qatar, +60 -> Malaysia, +65 -> Singapore, +968 -> Oman.
   - If no number/country name, return "Unknown".
3. ORDER STATUS: Always "Being Processed".
4. ORDER ID: Leave blank.
5. NAME: Extract customer name. Convert to Phonetic English (e.g., মোঃ সেকেন্দার -> "Md. Sekendar").
6. MOBILE NUMBER: Extract and place without spaces/special formatting.
7. DETAIL ADDRESS: Extract full address. Convert to structure: area/locality, Village: [village], Thana: [thana], Dist: [district]. Keep extra attributes like "beside mosque".
8. DISTRICT & THANA: Translate Bengali names to English names (e.g., ব্রাহ্মণবাড়িয়া -> Brahmanbaria).
9. ORDER SET: Must match EXACTLY one item from the VALID_ORDER_SETS list provided below.
10. NOTE: Mentions in order text in Phonetic English.
11. SALES PERSON: Extract from bracketed header like [Sales Person name]. Exclude prefixes like DT., ClickBD, BBS. Default to "Somair".
12. QTY: Default 1 unless stated.
13. TOTAL: Bill in digital English numerals (e.g., 1250).

VALID_ORDER_SETS:
${ORDER_SET_VALIDATION.join(", ")}

Mapping Intelligence:
- "ইন্টেলিজেন্স ২৫ ইন ১ বুক কম্ব" -> Intellegence_Book_Combo_3
- "ইন্টেলিজেন্স ২ ইন ১ বুক কম্ব" or "৭ ইন ১" -> Intellegence_Book_Combo_5
- 60 pcs Wooden Set (Price ~1250) -> 60_Pcs_new_wooden_toy_set
- 60 pcs Wooden Set (Price ~1390) -> 60_Pcs_wooden_toy_set
- 52 pcs Wooden Set (Price ~1250) -> 52_Pcs_big_wooden_toy_set
- 52 pcs Wooden Set (Price ~1050) -> 52_Pcs_wooden_toy_set

INPUT:
Bengali order text(s).

OUTPUT:
Return each order as a single CSV row separated by commas. Do not include a header row. Use quotes for address field if it contains commas.
`;

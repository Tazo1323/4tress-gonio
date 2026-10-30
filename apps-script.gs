/**
 * 4Tress Gonio — Google Sheets backend
 * 1) Extensions → Apps Script → paste this file → Save
 * 2) Run `setup` once (approve permissions)
 * 3) Deploy → New deployment → Web app · Execute as: Me · Who has access: Anyone → Deploy
 * 4) Copy the Web app URL into index.html → const SHEET_URL='...'
 */
const NOTIFY_EMAIL = ''; // optional: e-mail for new lead alerts

function setup() {
  const ss = SpreadsheetApp.getActive();
  let u = ss.getSheetByName('ბინები') || ss.insertSheet('ბინები');
  u.clear();
  u.appendRow(['ბინა','სართული','ტიპი','ფართი მ²','სტატუსი (free / reserved / sold)','ფასი $']);
  [['N1',1,'კუთხის',52.6,'free',117308],['N2',1,'სტუდიო',49.6,'free',86304],['N3',1,'სტუდიო',49.6,'free',108128],['N4',1,'კუთხის',52.6,'free',117308],['N5',2,'კუთხის',52.6,'free',118876],['N6',2,'სტუდიო',49.6,'free',87792],['N7',2,'სტუდიო',49.6,'free',109616],['N8',2,'კუთხის',52.6,'free',118876],['N9',3,'კუთხის',52.6,'free',120454],['N10',3,'სტუდიო',49.6,'free',89280],['N11',3,'სტუდიო',49.6,'free',111104],['N12',3,'კუთხის',52.6,'free',120454],['N13',4,'კუთხის',52.6,'free',122032],['N14',4,'სტუდიო',49.6,'free',90768],['N15',4,'სტუდიო',49.6,'free',112592],['N16',4,'კუთხის',52.6,'free',122032],['N17',5,'კუთხის',52.6,'free',123610],['N18',5,'სტუდიო',49.6,'free',114080],['N19',5,'სტუდიო',49.6,'free',114080],['N20',5,'კუთხის',52.6,'free',123610],['N21',6,'კუთხის',52.6,'free',125188],['N22',6,'სტუდიო',49.6,'free',115568],['N23',6,'სტუდიო',49.6,'free',115568],['N24',6,'კუთხის',52.6,'free',125188],['N25',7,'პენტჰაუსი',101.8,'free',274860],['N26',7,'პენტჰაუსი',101.8,'free',274860],['N27',8,'პენტჰაუსი',101.8,'free',274860],['N28',8,'პენტჰაუსი',101.8,'free',274860]].forEach(r => u.appendRow(r));
  u.setFrozenRows(1); u.getRange('A1:F1').setFontWeight('bold');
  u.getRange('E2:E29').setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['free','reserved','sold']).build());
  let s = ss.getSheetByName('პარამეტრები') || ss.insertSheet('პარამეტრები');
  s.clear();
  [['პარამეტრი','მნიშვნელობა','აღწერა'],
   ['offerOn',true,'50%-იანი შეთავაზება ჩართულია (TRUE/FALSE)'],
   ['offerLeft',4,'50%-იანი შეთავაზებიდან დარჩენილი ბინები'],
   ['offerTotal',4,'50%-იანი შეთავაზების ბინები სულ'],
   ['offerMonths',24,'50% — დარჩენილის განვადება, თვე'],
   ['downPct',30,'0% განვადება — პირველადი შენატანი %'],
   ['months',24,'0% განვადება — თვეები'],
   ['fullDiscount',0,'სრული გადახდის ფასდაკლება %']].forEach(r => s.appendRow(r));
  s.setFrozenRows(1); s.getRange('A1:C1').setFontWeight('bold');
  let l = ss.getSheetByName('ლიდები') || ss.insertSheet('ლიდები');
  if (l.getLastRow() === 0) { l.appendRow(['თარიღი','სახელი','ტელეფონი','წყარო','ბინა','გეგმა','თემა','კომენტარი','ენა']); l.setFrozenRows(1); l.getRange('A1:I1').setFontWeight('bold'); }
  const def = ss.getSheetByName('Sheet1') || ss.getSheetByName('ფურცელი1'); if (def && ss.getSheets().length > 3) ss.deleteSheet(def);
}

function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function state_() {
  const ss = SpreadsheetApp.getActive();
  const units = ss.getSheetByName('ბინები').getDataRange().getValues().slice(1).map(r => ({id: r[0], status: String(r[4]).trim() || 'free'}));
  const settings = {}; ss.getSheetByName('პარამეტრები').getDataRange().getValues().slice(1).forEach(r => settings[r[0]] = r[1]);
  return {units, settings};
}

function prices_() {
  const p = {}; SpreadsheetApp.getActive().getSheetByName('ბინები').getDataRange().getValues().slice(1).forEach(r => p[r[0]] = Number(r[5]));
  return p;
}

function doGet(e) { return json_(state_()); }

function doPost(e) {
  let d = {}; try { d = JSON.parse(e.postData.contents); } catch (err) {}
  const phone = String(d.phone || '').replace(/[^0-9+ ]/g, '').slice(0, 25);
  if (phone.replace(/\D/g, '').length < 9) return json_({ok: false});
  const clean = v => String(v || '').replace(/^[=+\-@]/, "'$&").slice(0, 500);
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    SpreadsheetApp.getActive().getSheetByName('ლიდები').appendRow([new Date(), clean(d.name), "'" + phone, clean(d.ctx), clean(d.unit), clean(d.plan), clean(d.topic), clean(d.msg), clean(d.lang)]);
  } finally { lock.releaseLock(); }
  if (NOTIFY_EMAIL) try { MailApp.sendEmail(NOTIFY_EMAIL, '4Tress Gonio — ახალი ლიდი: ' + phone, [d.name, phone, d.ctx, d.unit, d.plan, d.topic, d.msg].filter(Boolean).join('\n')); } catch (err) {}
  return json_({ok: true, prices: prices_()});
}

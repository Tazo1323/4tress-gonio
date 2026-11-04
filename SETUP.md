# 4Tress Gonio — საიტის გაშვება

## 1. Google Sheet (ლიდები, სტატუსები, ფასები)
1. შექმენით ახალი Google Sheet, მაგ. „4Tress Gonio — საიტი“.
2. **Extensions → Apps Script** → წაშალეთ რაც წერია → ჩასვით `apps-script.gs` ფაილის შიგთავსი → **Save**.
3. ზემოთ ფუნქციების სიაში აირჩიეთ `setup` → **Run** → დაადასტურეთ უფლებები (Advanced → Go to …).
   შეიქმნება ფურცლები: **ბინები**, **პარამეტრები**, **ლიდები**.
4. **Deploy → New deployment** → ტიპი **Web app** → Execute as: **Me** → Who has access: **Anyone** → **Deploy**.
5. დააკოპირეთ **Web app URL** (იწყება `https://script.google.com/macros/s/...`).
6. `index.html`-ში იპოვეთ `const SHEET_URL='';` და ჩასვით ბმული ბრჭყალებში.

### ყოველდღიური მართვა
- **ბინები** ფურცელში სტატუსი: `free` / `reserved` / `sold`, ფასი — სვეტი F. საიტი ცვლილებას გვერდის განახლებისას აჩვენებს.
- **პარამეტრები** — 50%-იანი შეთავაზება, დარჩენილი ბინები, პირველადი შენატანი %, თვეები.
- **ლიდები** — ყველა შეყვანილი ნომერი თარიღით, ბინით და გეგმით.
- ელფოსტის შეტყობინება: სკრიპტში `NOTIFY_EMAIL`-ში ჩაწერეთ მეილი და ხელახლა Deploy → Manage deployments → Edit → New version.

## 2. GitHub Pages
რეპოზიტორია → **Settings → Pages** → Source: *Deploy from a branch* → `main` / root → Save.
რამდენიმე წუთში საიტი გაიხსნება: `https://4tressgonio.ge/`

## 3. საკუთარი დომენი (არასავალდებულო)
1. Settings → Pages → Custom domain → მაგ. `4tressgonio.ge` → Save.
2. დომენის რეგისტრატორთან DNS:
   - `A` ჩანაწერები: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www` → `CNAME` → `<username>.github.io`
3. DNS-ის განახლების შემდეგ ჩართეთ **Enforce HTTPS**.

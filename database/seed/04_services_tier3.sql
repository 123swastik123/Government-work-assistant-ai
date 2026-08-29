-- ============================================================
-- Seed: Tier 3 Services (21–30)
-- All marked needs_verification.
-- ============================================================

-- 21. Khata Certificate / Khata Transfer (BBMP)
INSERT INTO services (slug,name,category,tier,state,description,short_description,eligibility_rules,questions,required_documents,official_fee,steps,official_url,official_url_label,what_happens_after,troubleshooting,source_notes,verification_status,keywords,active)
VALUES(
  'khata-certificate-transfer',
  '{"en":"Khata Certificate / Khata Transfer (BBMP)","hi":"खाता प्रमाणपत्र / खाता स्थानांतरण (BBMP)","kn":"ಖಾತಾ ಪ್ರಮಾಣಪತ್ರ / ಖಾತಾ ವರ್ಗಾವಣೆ (BBMP)"}',
  'property-land',3,'karnataka',
  '{"en":"Obtain a Khata Certificate or apply for Khata Transfer (ownership change) for BBMP properties in Bengaluru. Required for property tax payment, building plan approval, and property transactions.","hi":"बेंगलुरु में BBMP संपत्तियों के लिए खाता प्रमाणपत्र प्राप्त करें या खाता स्थानांतरण के लिए आवेदन करें।","kn":"ಬೆಂಗಳೂರಿನಲ್ಲಿ BBMP ಆಸ್ತಿಗಳಿಗೆ ಖಾತಾ ಪ್ರಮಾಣಪತ್ರ ಅಥವಾ ಖಾತಾ ವರ್ಗಾವಣೆಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ."}',
  '{"en":"Get your Khata certificate or transfer Khata for BBMP Bengaluru properties.","hi":"BBMP बेंगलुरु संपत्तियों के लिए खाता प्रमाणपत्र प्राप्त करें।","kn":"BBMP ಬೆಂಗಳೂರು ಆಸ್ತಿಗಳಿಗೆ ಖಾತಾ ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ."}',
  null,
  '[{"id":"service_type","type":"select","label":{"en":"What do you need?","hi":"आपको क्या चाहिए?","kn":"ನಿಮಗೆ ಏನು ಬೇಕು?"},"options":[{"value":"extract","label":{"en":"Khata Extract (Certificate)","hi":"खाता निकालना (प्रमाणपत्र)","kn":"ಖಾತಾ ಉತ್ಧರಣ (ಪ್ರಮಾಣಪತ್ರ)"}},{"value":"transfer","label":{"en":"Khata Transfer (new owner)","hi":"खाता स्थानांतरण (नया मालिक)","kn":"ಖಾತಾ ವರ್ಗಾವಣೆ (ಹೊಸ ಮಾಲೀಕ)"}}],"required":true,"eligibility_relevant":false}]',
  '[{"id":"sale_deed","name":{"en":"Registered Sale Deed / Conveyance Deed","hi":"पंजीकृत बिक्री विलेख","kn":"ನೋಂದಾಯಿತ ಮಾರಾಟ ಪತ್ರ"},"status":"required"},{"id":"property_tax_receipts","name":{"en":"Property Tax paid receipts (latest)","hi":"संपत्ति कर का भुगतान रसीद (नवीनतम)","kn":"ಇತ್ತೀಚಿನ ಆಸ್ತಿ ತೆರಿಗೆ ಪಾವತಿ ರಶೀದಿ"},"status":"required"},{"id":"encumbrance_cert","name":{"en":"Encumbrance Certificate","hi":"भार प्रमाणपत्र","kn":"ಅಡಮಾನ ಪ್ರಮಾಣಪತ್ರ"},"status":"optional"},{"id":"aadhaar","name":{"en":"Aadhaar of applicant","hi":"आवेदक का आधार","kn":"ಅರ್ಜಿದಾರರ ಆಧಾರ್"},"status":"required"}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"Fee varies. Check BBMP Seva Sindhu or BBMP portal for current Khata fees.","hi":"शुल्क भिन्न होता है।","kn":"ಶುಲ್ಕ ಬೇರೆಯಾಗಿರುತ್ತದೆ."},"varies_by":"service_type"}',
  '[{"step_number":1,"title":{"en":"Apply on BBMP portal or Seva Sindhu"},"description":{"en":"Visit bbmptax.karnataka.gov.in or sevasindhu.karnataka.gov.in for Khata services."},"is_online":true,"is_offline":true},{"step_number":2,"title":{"en":"Submit property documents"},"description":{"en":"Upload sale deed, tax receipts, and Aadhaar."},"is_online":true,"is_offline":true},{"step_number":3,"title":{"en":"Pay fee and submit"},"description":{"en":"Pay the applicable fee. Await verification and certificate issue."},"is_online":true,"is_offline":true}]',
  'https://bbmptax.karnataka.gov.in',
  '{"en":"BBMP Property Portal","hi":"BBMP संपत्ति पोर्टल","kn":"BBMP ಆಸ್ತಿ ಪೋರ್ಟಲ್"}',
  '{"en":"After verification, Khata is issued or transferred. Updated Khata extract can be downloaded.","hi":"सत्यापन के बाद, खाता जारी या स्थानांतरित किया जाता है।","kn":"ಪರಿಶೀಲನೆಯ ನಂತರ ಖಾತಾ ನೀಡಲಾಗುತ್ತದೆ ಅಥವಾ ವರ್ಗಾಯಿಸಲಾಗುತ್ತದೆ."}',
  '[{"problem":{"en":"Property has outstanding dues or disputes"},"solution":{"en":"Clear all pending property tax dues before applying for Khata. Disputed property Khata transfers are legal matters — consult a property lawyer."},"defer_to_official":true}]',
  'Source: bbmptax.karnataka.gov.in — needs human verification.',
  'needs_verification',
  ARRAY['khata','khata certificate','khata transfer','bbmp khata','property khata','bbmp bangalore'],
  true
);

-- 22. Property Tax Payment (BBMP)
INSERT INTO services (slug,name,category,tier,state,description,short_description,eligibility_rules,questions,required_documents,official_fee,steps,official_url,official_url_label,what_happens_after,troubleshooting,source_notes,verification_status,keywords,active)
VALUES(
  'property-tax-bbmp',
  '{"en":"Property Tax Payment (BBMP)","hi":"संपत्ति कर भुगतान (BBMP)","kn":"ಆಸ್ತಿ ತೆರಿಗೆ ಪಾವತಿ (BBMP)"}',
  'tax-finance',3,'karnataka',
  '{"en":"Pay your annual property tax for BBMP (Bruhat Bengaluru Mahanagara Palike) properties in Bengaluru online or in person.","hi":"बेंगलुरु में BBMP संपत्तियों के लिए वार्षिक संपत्ति कर ऑनलाइन या व्यक्तिगत रूप से चुकाएं।","kn":"ಬೆಂಗಳೂರಿನಲ್ಲಿ BBMP ಆಸ್ತಿಗಳಿಗಾಗಿ ವಾರ್ಷಿಕ ಆಸ್ತಿ ತೆರಿಗೆ ಆನ್‌ಲೈನ್ ಅಥವಾ ಸ್ವಯಂ ಪಾವತಿಸಿ."}',
  '{"en":"Pay your BBMP property tax online.","hi":"BBMP संपत्ति कर ऑनलाइन चुकाएं।","kn":"BBMP ಆಸ್ತಿ ತೆರಿಗೆ ಆನ್‌ಲೈನ್ ಪಾವತಿಸಿ."}',
  null,
  '[{"id":"has_pid","type":"boolean","label":{"en":"Do you know your BBMP Property Identification Number (PID / Application Number)?","hi":"क्या आप अपना BBMP PID / आवेदन नंबर जानते हैं?","kn":"ನಿಮ್ಮ BBMP PID / ಅರ್ಜಿ ಸಂಖ್ಯೆ ತಿಳಿದಿದೆಯೇ?"},"required":true,"eligibility_relevant":false}]',
  '[{"id":"pid_or_doc","name":{"en":"Property PID number / previous tax receipt / Khata number","hi":"संपत्ति PID नंबर / पिछली कर रसीद / खाता नंबर","kn":"ಆಸ್ತಿ PID ಸಂಖ್ಯೆ / ಹಿಂದಿನ ತೆರಿಗೆ ರಶೀದಿ / ಖಾತಾ ಸಂಖ್ಯೆ"},"status":"required"}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"Tax amount varies by property type, size, location, and usage. Early payment rebates may apply. Check bbmptax.karnataka.gov.in for your specific property.","hi":"कर राशि संपत्ति प्रकार, आकार, स्थान और उपयोग के अनुसार भिन्न होती है।","kn":"ತೆರಿಗೆ ಮೊತ್ತ ಆಸ್ತಿ ಪ್ರಕಾರ, ಗಾತ್ರ, ಸ್ಥಳ ಮತ್ತು ಬಳಕೆಯ ಆಧಾರದ ಮೇಲೆ ಬೇರೆಯಾಗಿರುತ್ತದೆ."},"varies_by":null}',
  '[{"step_number":1,"title":{"en":"Visit BBMP Tax Portal"},"description":{"en":"Go to bbmptax.karnataka.gov.in and click ''Pay Property Tax''."},"is_online":true,"is_offline":false},{"step_number":2,"title":{"en":"Search for your property"},"description":{"en":"Enter your Application Number, PID, or Owner Name to find your property."},"is_online":true,"is_offline":false},{"step_number":3,"title":{"en":"Review and pay the due amount"},"description":{"en":"Review the tax amount calculated. Pay online via the portal."},"is_online":true,"is_offline":false},{"step_number":4,"title":{"en":"Download the receipt"},"description":{"en":"After payment, download the official payment receipt. Keep it safe."},"is_online":true,"is_offline":false}]',
  'https://bbmptax.karnataka.gov.in',
  '{"en":"BBMP Property Tax Portal","hi":"BBMP संपत्ति कर पोर्टल","kn":"BBMP ಆಸ್ತಿ ತೆರಿಗೆ ಪೋರ್ಟಲ್"}',
  '{"en":"Payment is recorded immediately. Download and save the payment receipt. It is required for Khata transfer, property sale, and other purposes.","hi":"भुगतान तुरंत दर्ज किया जाता है।","kn":"ಪಾವತಿ ತಕ್ಷಣ ದಾಖಲಾಗುತ್ತದೆ."}',
  '[{"problem":{"en":"Property not found on portal"},"solution":{"en":"Try searching by owner name or ward number. If still not found, visit your nearest BBMP ARO (Assistant Revenue Officer) office."},"defer_to_official":false}]',
  'Source: bbmptax.karnataka.gov.in — needs human verification.',
  'needs_verification',
  ARRAY['property tax','bbmp tax','property tax payment','house tax','bangalore property tax'],
  true
);

-- 23. Encumbrance Certificate (EC)
INSERT INTO services (slug,name,category,tier,state,description,short_description,eligibility_rules,questions,required_documents,official_fee,steps,official_url,official_url_label,what_happens_after,troubleshooting,source_notes,verification_status,keywords,active)
VALUES(
  'encumbrance-certificate',
  '{"en":"Encumbrance Certificate (EC)","hi":"भार प्रमाणपत्र (EC)","kn":"ಅಡಮಾನ ಪ್ರಮಾಣಪತ್ರ (EC)"}',
  'property-land',3,'karnataka',
  '{"en":"Obtain an Encumbrance Certificate from Karnataka Sub-Registrar Office to verify if a property is free of legal dues, mortgages, or encumbrances.","hi":"कर्नाटक उप-रजिस्ट्रार कार्यालय से भार प्रमाणपत्र प्राप्त करें।","kn":"ಆಸ್ತಿ ಕಾನೂನು ಬಾಕಿ, ಅಡಮಾನಗಳಿಂದ ಮುಕ್ತವಾಗಿದೆಯೇ ಎಂದು ಪರಿಶೀಲಿಸಲು ಕರ್ನಾಟಕ ಉಪ-ರಿಜಿಸ್ಟ್ರಾರ್ ಕಚೇರಿಯಿಂದ ಅಡಮಾನ ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ."}',
  '{"en":"Verify a property is free of loans or legal encumbrances.","hi":"संपत्ति कानूनी भार से मुक्त है या नहीं, इसे सत्यापित करें।","kn":"ಆಸ್ತಿ ಸಾಲ ಅಥವಾ ಕಾನೂನು ಅಡಮಾನದಿಂದ ಮುಕ್ತವಾಗಿದೆಯೇ ಎಂದು ಪರಿಶೀಲಿಸಿ."}',
  null,
  '[{"id":"period_years","type":"select","label":{"en":"For how many years do you need the EC?","hi":"आपको कितने वर्षों के लिए EC चाहिए?","kn":"ನಿಮಗೆ ಎಷ್ಟು ವರ್ಷಗಳ EC ಬೇಕು?"},"options":[{"value":"1","label":{"en":"1 year","hi":"1 साल","kn":"1 ವರ್ಷ"}},{"value":"5","label":{"en":"5 years","hi":"5 साल","kn":"5 ವರ್ಷ"}},{"value":"10","label":{"en":"10 years","hi":"10 साल","kn":"10 ವರ್ಷ"}},{"value":"30","label":{"en":"30 years","hi":"30 साल","kn":"30 ವರ್ಷ"}}],"required":true,"eligibility_relevant":false}]',
  '[{"id":"property_details","name":{"en":"Property details: Survey number / Plot number / Registration details","hi":"संपत्ति विवरण: सर्वे नंबर / प्लॉट नंबर / पंजीकरण विवरण","kn":"ಆಸ್ತಿ ವಿವರಗಳು: ಸರ್ವೇ ನಂಬರ್ / ಪ್ಲಾಟ್ ನಂಬರ್ / ನೋಂದಣಿ ವಿವರ"},"status":"required"},{"id":"applicant_id","name":{"en":"Applicant ID (Aadhaar)","hi":"आवेदक आईडी (आधार)","kn":"ಅರ್ಜಿದಾರ ಗುರುತು (ಆಧಾರ್)"},"status":"required"}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"Fee varies by number of years. Check Kaveri Online portal for current EC fee.","hi":"शुल्क वर्षों की संख्या के अनुसार भिन्न होता है।","kn":"ಶುಲ್ಕ ವರ್ಷಗಳ ಸಂಖ್ಯೆಯ ಆಧಾರದ ಮೇಲೆ ಬೇರೆಯಾಗಿರುತ್ತದೆ."},"varies_by":"period_years"}',
  '[{"step_number":1,"title":{"en":"Visit Kaveri Online portal"},"description":{"en":"Go to kaverionline.karnataka.gov.in and log in or register."},"is_online":true,"is_offline":false},{"step_number":2,"title":{"en":"Select EC application"},"description":{"en":"Choose Encumbrance Certificate application and enter property details."},"is_online":true,"is_offline":false},{"step_number":3,"title":{"en":"Specify period and pay"},"description":{"en":"Select the period for which EC is needed. Pay the fee online."},"is_online":true,"is_offline":false},{"step_number":4,"title":{"en":"Download EC"},"description":{"en":"EC is generated and available for download."},"is_online":true,"is_offline":false}]',
  'https://kaverionline.karnataka.gov.in',
  '{"en":"Kaveri Online — Karnataka Registration Portal","hi":"कावेरी ऑनलाइन — कर्नाटक पंजीकरण पोर्टल","kn":"ಕಾವೇರಿ ಆನ್‌ಲೈನ್ — ಕರ್ನಾಟಕ ನೋಂದಣಿ ಪೋರ್ಟಲ್"}',
  '{"en":"EC is generated online after fee payment. Download the digitally signed EC from the portal.","hi":"शुल्क भुगतान के बाद EC ऑनलाइन उत्पन्न होता है।","kn":"ಶುಲ್ಕ ಪಾವತಿ ನಂತರ EC ಆನ್‌ಲೈನ್ ಉತ್ಪಾದಿಸಲಾಗುತ್ತದೆ."}',
  '[]',
  'Source: kaverionline.karnataka.gov.in — needs human verification.',
  'needs_verification',
  ARRAY['encumbrance certificate','ec','property encumbrance','kaveri online','bhara certificate','adaman certificate'],
  true
);

-- 24. RTC / Pahani (Land Record)
INSERT INTO services (slug,name,category,tier,state,description,short_description,eligibility_rules,questions,required_documents,official_fee,steps,official_url,official_url_label,what_happens_after,troubleshooting,source_notes,verification_status,keywords,active)
VALUES(
  'rtc-pahani',
  '{"en":"RTC / Pahani (Land Record)","hi":"आरटीसी / पहाणी (भूमि अभिलेख)","kn":"ಆರ್‌ಟಿಸಿ / ಪಹಾಣಿ (ಭೂ ದಾಖಲೆ)"}',
  'property-land',3,'karnataka',
  '{"en":"Obtain a Record of Rights, Tenancy and Crops (RTC / Pahani) document from the Karnataka Revenue Department. Used as proof of land ownership, agricultural income, and for various government applications.","hi":"कर्नाटक राजस्व विभाग से भूमि स्वामित्व, कृषि आय के प्रमाण के लिए आरटीसी / पहाणी दस्तावेज़ प्राप्त करें।","kn":"ಭೂ ಮಾಲೀಕತ್ವ, ಕೃಷಿ ಆದಾಯ ಪ್ರಮಾಣಕ್ಕಾಗಿ ಕರ್ನಾಟಕ ಕಂದಾಯ ಇಲಾಖೆಯಿಂದ RTC / ಪಹಾಣಿ ದಾಖಲೆ ಪಡೆಯಿರಿ."}',
  '{"en":"Get your land record (RTC / Pahani) online.","hi":"ऑनलाइन भूमि अभिलेख (आरटीसी / पहाणी) प्राप्त करें।","kn":"ಆನ್‌ಲೈನ್ ಭೂ ದಾಖಲೆ (RTC / ಪಹಾಣಿ) ಪಡೆಯಿರಿ."}',
  null,
  '[{"id":"has_survey_number","type":"boolean","label":{"en":"Do you know your land survey number?","hi":"क्या आप अपना भूमि सर्वे नंबर जानते हैं?","kn":"ನಿಮ್ಮ ಭೂಮಿ ಸರ್ವೇ ನಂಬರ್ ತಿಳಿದಿದೆಯೇ?"},"required":true,"eligibility_relevant":false}]',
  '[{"id":"survey_number","name":{"en":"Survey Number / Hissa Number / Owner name","hi":"सर्वे नंबर / हिस्सा नंबर / मालिक का नाम","kn":"ಸರ್ವೇ ನಂಬರ್ / ಹಿಸ್ಸಾ ನಂಬರ್ / ಮಾಲೀಕರ ಹೆಸರು"},"status":"required"}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"Nominal fee for certified RTC. View-only RTC is often available free. Check Bhoomi portal for current fee.","hi":"प्रमाणित आरटीसी के लिए मामूली शुल्क।","kn":"ಪ್ರಮಾಣಿತ RTC ಗಾಗಿ ಸಾಮಾನ್ಯ ಶುಲ್ಕ."},"varies_by":null}',
  '[{"step_number":1,"title":{"en":"Visit Bhoomi Online portal"},"description":{"en":"Go to bhoomi.karnataka.gov.in."},"is_online":true,"is_offline":false},{"step_number":2,"title":{"en":"Search for your land record"},"description":{"en":"Enter district, taluk, hobli, village, survey number, or owner name."},"is_online":true,"is_offline":false},{"step_number":3,"title":{"en":"View or download RTC"},"description":{"en":"For certified copy, pay the fee. Download or collect at Nadakacheri."},"is_online":true,"is_offline":true}]',
  'https://bhoomi.karnataka.gov.in',
  '{"en":"Bhoomi — Karnataka Land Records Portal","hi":"भूमि — कर्नाटक भूमि अभिलेख पोर्टल","kn":"ಭೂಮಿ — ಕರ್ನಾಟಕ ಭೂ ದಾಖಲೆ ಪೋರ್ಟಲ್"}',
  '{"en":"RTC is available for download online. Certified copies can be collected from Nadakacheri.","hi":"आरटीसी ऑनलाइन डाउनलोड के लिए उपलब्ध है।","kn":"RTC ಆನ್‌ಲೈನ್ ಡೌನ್‌ಲೋಡ್‌ಗೆ ಲಭ್ಯವಿದೆ."}',
  '[]',
  'Source: bhoomi.karnataka.gov.in — needs human verification.',
  'needs_verification',
  ARRAY['rtc','pahani','land record','bhoomi','record of rights','survey number','khata','agricultural land'],
  true
);

-- 25. Vehicle RC — New Registration
INSERT INTO services (slug,name,category,tier,state,description,short_description,eligibility_rules,questions,required_documents,official_fee,steps,official_url,official_url_label,what_happens_after,troubleshooting,source_notes,verification_status,keywords,active)
VALUES(
  'vehicle-rc-new',
  '{"en":"Vehicle RC — New Registration","hi":"वाहन RC — नया पंजीकरण","kn":"ವಾಹನ RC — ಹೊಸ ನೋಂದಣಿ"}',
  'driving-transport',3,'karnataka',
  '{"en":"Register a new vehicle and obtain a Registration Certificate (RC) in Karnataka through the Vahan Parivahan portal.","hi":"वाहन परिवहन पोर्टल के माध्यम से कर्नाटक में नया वाहन पंजीकृत करें और पंजीकरण प्रमाणपत्र (RC) प्राप्त करें।","kn":"ವಾಹನ ಪರಿವಹನ ಪೋರ್ಟಲ್ ಮೂಲಕ ಕರ್ನಾಟಕದಲ್ಲಿ ಹೊಸ ವಾಹನ ನೋಂದಾಯಿಸಿ ಮತ್ತು ನೋಂದಣಿ ಪ್ರಮಾಣಪತ್ರ (RC) ಪಡೆಯಿರಿ."}',
  '{"en":"Register your new vehicle and get your RC.","hi":"नए वाहन को रजिस्टर करें और RC प्राप्त करें।","kn":"ಹೊಸ ವಾಹನ ನೋಂದಾಯಿಸಿ ಮತ್ತು RC ಪಡೆಯಿರಿ."}',
  null,
  '[{"id":"vehicle_type","type":"select","label":{"en":"What type of vehicle?","hi":"वाहन का प्रकार?","kn":"ವಾಹನದ ಪ್ರಕಾರ?"},"options":[{"value":"2w","label":{"en":"Two-wheeler","hi":"दोपहिया","kn":"ದ್ವಿಚಕ್ರ ವಾಹನ"}},{"value":"4w_personal","label":{"en":"Four-wheeler (personal)","hi":"चार पहिया (व्यक्तिगत)","kn":"ನಾಲ್ಕು ಚಕ್ರ (ವೈಯಕ್ತಿಕ)"}},{"value":"commercial","label":{"en":"Commercial vehicle","hi":"वाणिज्यिक वाहन","kn":"ವಾಣಿಜ್ಯ ವಾಹನ"}}],"required":true,"eligibility_relevant":false}]',
  '[{"id":"invoice","name":{"en":"Vehicle purchase invoice / Bill of sale","hi":"वाहन खरीद चालान / बिक्री बिल","kn":"ವಾಹನ ಖರೀದಿ ಇನ್‌ವಾಯ್ಸ್ / ಮಾರಾಟ ಬಿಲ್"},"status":"required"},{"id":"insurance","name":{"en":"Vehicle Insurance Certificate","hi":"वाहन बीमा प्रमाण पत्र","kn":"ವಾಹನ ವಿಮೆ ಪ್ರಮಾಣಪತ್ರ"},"status":"required"},{"id":"pollution","name":{"en":"Pollution Under Control (PUC) Certificate","hi":"प्रदूषण नियंत्रण (PUC) प्रमाण पत्र","kn":"ಮಾಲಿನ್ಯ ನಿಯಂತ್ರಣ (PUC) ಪ್ರಮಾಣಪತ್ರ"},"status":"required"},{"id":"id_proof","name":{"en":"Owner ID and Address Proof (Aadhaar)","hi":"मालिक की आईडी और पते का प्रमाण","kn":"ಮಾಲೀಕರ ಗುರುತು ಮತ್ತು ವಿಳಾಸ ಪುರಾವೆ"},"status":"required"}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"Registration fee, road tax, and other charges apply. Varies by vehicle type and engine capacity. Check Vahan portal or your dealer.","hi":"पंजीकरण शुल्क, सड़क कर और अन्य शुल्क लागू होते हैं।","kn":"ನೋಂದಣಿ ಶುಲ್ಕ, ರಸ್ತೆ ತೆರಿಗೆ ಮತ್ತು ಇತರ ಶುಲ್ಕಗಳು ಅನ್ವಯಿಸುತ್ತವೆ."},"varies_by":"vehicle_type"}',
  '[{"step_number":1,"title":{"en":"Dealer typically handles new vehicle registration"},"description":{"en":"For new vehicles purchased from a dealer, the dealer usually initiates the registration process on the Vahan portal on your behalf."},"is_online":false,"is_offline":true},{"step_number":2,"title":{"en":"Visit vahan.parivahan.gov.in if self-registering"},"description":{"en":"If not handled by dealer, apply on the Vahan Parivahan portal."},"is_online":true,"is_offline":false},{"step_number":3,"title":{"en":"Submit documents and pay fees"},"description":{"en":"Submit all required documents, pay registration fee and road tax."},"is_online":true,"is_offline":true},{"step_number":4,"title":{"en":"Receive RC"},"description":{"en":"Temporary registration is issued first. Permanent RC (smart card) is dispatched within the prescribed period."},"is_online":false,"is_offline":true}]',
  'https://vahan.parivahan.gov.in',
  '{"en":"Vahan Parivahan — Vehicle Registration Portal","hi":"वाहन परिवहन — वाहन पंजीकरण पोर्टल","kn":"ವಾಹನ ಪರಿವಹನ — ವಾಹನ ನೋಂದಣಿ ಪೋರ್ಟಲ್"}',
  '{"en":"After submission, a temporary RC is issued. The permanent smart card RC is dispatched to your address within the prescribed period.","hi":"सबमिशन के बाद, एक अस्थायी RC जारी की जाती है।","kn":"ಸಲ್ಲಿಕೆಯ ನಂತರ ತಾತ್ಕಾಲಿಕ RC ನೀಡಲಾಗುತ್ತದೆ."}',
  '[]',
  'Source: vahan.parivahan.gov.in — needs human verification.',
  'needs_verification',
  ARRAY['vehicle registration','rc','vehicle rc','new vehicle','car registration','bike registration','vahan'],
  true
);

-- 26. Vehicle RC — Ownership Transfer
INSERT INTO services (slug,name,category,tier,state,description,short_description,eligibility_rules,questions,required_documents,official_fee,steps,official_url,official_url_label,what_happens_after,troubleshooting,source_notes,verification_status,keywords,active)
VALUES(
  'vehicle-rc-transfer',
  '{"en":"Vehicle RC — Ownership Transfer","hi":"वाहन RC — स्वामित्व स्थानांतरण","kn":"ವಾಹನ RC — ಮಾಲೀಕತ್ವ ವರ್ಗಾವಣೆ"}',
  'driving-transport',3,'karnataka',
  '{"en":"Transfer vehicle ownership (RC) when buying or selling a used vehicle in Karnataka.","hi":"कर्नाटक में पुराना वाहन खरीदते या बेचते समय वाहन स्वामित्व (RC) स्थानांतरित करें।","kn":"ಕರ್ನಾಟಕದಲ್ಲಿ ಬಳಸಿದ ವಾಹನ ಖರೀದಿ ಅಥವಾ ಮಾರಾಟ ಮಾಡುವಾಗ ವಾಹನ ಮಾಲೀಕತ್ವ (RC) ವರ್ಗಾಯಿಸಿ."}',
  '{"en":"Transfer a vehicle to a new owner after buying/selling.","hi":"खरीद/बिक्री के बाद वाहन नए मालिक को ट्रांसफर करें।","kn":"ಖರೀದಿ/ಮಾರಾಟದ ನಂತರ ವಾಹನ ಹೊಸ ಮಾಲೀಕರಿಗೆ ವರ್ಗಾಯಿಸಿ."}',
  null,
  '[{"id":"seller_or_buyer","type":"select","label":{"en":"Are you the buyer or seller?","hi":"क्या आप खरीदार हैं या विक्रेता?","kn":"ನೀವು ಖರೀದಿದಾರರೇ ಅಥವಾ ಮಾರಾಟಗಾರರೇ?"},"options":[{"value":"buyer","label":{"en":"Buyer","hi":"खरीदार","kn":"ಖರೀದಿದಾರ"}},{"value":"seller","label":{"en":"Seller","hi":"विक्रेता","kn":"ಮಾರಾಟಗಾರ"}}],"required":true,"eligibility_relevant":false}]',
  '[{"id":"original_rc","name":{"en":"Original RC of vehicle","hi":"वाहन का मूल RC","kn":"ವಾಹನದ ಮೂಲ RC"},"status":"required"},{"id":"sale_agreement","name":{"en":"Sale Agreement / Form 29 and Form 30","hi":"बिक्री समझौता / फॉर्म 29 और 30","kn":"ಮಾರಾಟ ಒಪ್ಪಂದ / ಫಾರ್ಮ್ 29 ಮತ್ತು 30"},"status":"required"},{"id":"insurance","name":{"en":"Valid Insurance Certificate","hi":"वैध बीमा प्रमाण पत्र","kn":"ಮಾನ್ಯ ವಿಮೆ ಪ್ರಮಾಣಪತ್ರ"},"status":"required"},{"id":"buyer_id","name":{"en":"Buyer''s Aadhaar and Address Proof","hi":"खरीदार का आधार और पते का प्रमाण","kn":"ಖರೀದಿದಾರರ ಆಧಾರ್ ಮತ್ತು ವಿಳಾಸ ಪುರಾವೆ"},"status":"required"}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"Transfer fee applies. Check Vahan portal for current Karnataka RC transfer fee.","hi":"स्थानांतरण शुल्क लागू है।","kn":"ವರ್ಗಾವಣೆ ಶುಲ್ಕ ಅನ್ವಯಿಸುತ್ತದೆ."},"varies_by":null}',
  '[{"step_number":1,"title":{"en":"Both buyer and seller complete Forms 29 and 30"},"description":{"en":"Form 29 is NOC from seller. Form 30 is application for transfer by buyer."},"is_online":false,"is_offline":true},{"step_number":2,"title":{"en":"Apply online on Vahan portal"},"description":{"en":"Visit vahan.parivahan.gov.in → Services → Ownership Transfer."},"is_online":true,"is_offline":false},{"step_number":3,"title":{"en":"Submit documents and pay fee"},"description":{"en":"Upload all documents and pay the transfer fee."},"is_online":true,"is_offline":false},{"step_number":4,"title":{"en":"Receive updated RC"},"description":{"en":"New RC with buyer''s name is issued and dispatched."},"is_online":false,"is_offline":true}]',
  'https://vahan.parivahan.gov.in',
  '{"en":"Vahan Parivahan — Vehicle Registration Portal","hi":"वाहन परिवहन — वाहन पंजीकरण पोर्टल","kn":"ವಾಹನ ಪರಿವಹನ — ವಾಹನ ನೋಂದಣಿ ಪೋರ್ಟಲ್"}',
  '{"en":"After processing, the new RC in the buyer''s name is dispatched.","hi":"प्रोसेसिंग के बाद, नए मालिक के नाम पर RC भेजी जाती है।","kn":"ಪ್ರಕ್ರಿಯೆಯ ನಂತರ ಖರೀದಿದಾರರ ಹೆಸರಿನಲ್ಲಿ ಹೊಸ RC ರವಾನಿಸಲಾಗುತ್ತದೆ."}',
  '[]',
  'Source: vahan.parivahan.gov.in — needs human verification.',
  'needs_verification',
  ARRAY['rc transfer','ownership transfer','vehicle transfer','car transfer','used vehicle','second hand car rc'],
  true
);

-- 27. Marriage Certificate Registration
INSERT INTO services (slug,name,category,tier,state,description,short_description,eligibility_rules,questions,required_documents,official_fee,steps,official_url,official_url_label,what_happens_after,troubleshooting,source_notes,verification_status,keywords,active)
VALUES(
  'marriage-certificate',
  '{"en":"Marriage Certificate Registration","hi":"विवाह प्रमाणपत्र पंजीकरण","kn":"ವಿವಾಹ ಪ್ರಮಾಣಪತ್ರ ನೋಂದಣಿ"}',
  'family-marriage',3,'karnataka',
  '{"en":"Register your marriage and obtain a Marriage Certificate in Karnataka. Can be registered under the Hindu Marriage Act, Special Marriage Act, or Karnataka Marriages (Registration and Miscellaneous Provisions) Act.","hi":"कर्नाटक में अपनी शादी पंजीकृत करें और विवाह प्रमाणपत्र प्राप्त करें।","kn":"ಕರ್ನಾಟಕದಲ್ಲಿ ನಿಮ್ಮ ಮದುವೆ ನೋಂದಾಯಿಸಿ ಮತ್ತು ವಿವಾಹ ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ."}',
  '{"en":"Register your marriage and get an official Marriage Certificate.","hi":"शादी पंजीकृत करें और विवाह प्रमाणपत्र प्राप्त करें।","kn":"ಮದುವೆ ನೋಂದಾಯಿಸಿ ಮತ್ತು ವಿವಾಹ ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ."}',
  null,
  '[{"id":"act","type":"select","label":{"en":"Under which act is your marriage to be registered?","hi":"आपकी शादी किस अधिनियम के तहत पंजीकृत होनी है?","kn":"ನಿಮ್ಮ ಮದುವೆ ಯಾವ ಕಾಯ್ದೆ ಅಡಿ ನೋಂದಣಿ ಆಗಬೇಕು?"},"options":[{"value":"hindu","label":{"en":"Hindu Marriage Act","hi":"हिंदू विवाह अधिनियम","kn":"ಹಿಂದೂ ವಿವಾಹ ಕಾಯ್ದೆ"}},{"value":"special","label":{"en":"Special Marriage Act","hi":"विशेष विवाह अधिनियम","kn":"ವಿಶೇಷ ವಿವಾಹ ಕಾಯ್ದೆ"}},{"value":"karnataka","label":{"en":"Karnataka Marriages Act","hi":"कर्नाटक विवाह अधिनियम","kn":"ಕರ್ನಾಟಕ ವಿವಾಹ ಕಾಯ್ದೆ"}}],"required":true,"eligibility_relevant":false}]',
  '[{"id":"couple_id","name":{"en":"Aadhaar of both bride and groom","hi":"दोनों दूल्हे और दुल्हन का आधार","kn":"ವರ ಮತ್ತು ವಧುವಿನ ಆಧಾರ್"},"status":"required"},{"id":"age_proof","name":{"en":"Age proof (both parties — bride min 18, groom min 21)","hi":"आयु प्रमाण (दोनों पक्ष — दुल्हन कम से कम 18, दूल्हा कम से कम 21)","kn":"ವಯಸ್ಸಿನ ಪುರಾವೆ (ವಧು ಕನಿಷ್ಠ 18, ವರ ಕನಿಷ್ಠ 21)"},"status":"required"},{"id":"address_proof","name":{"en":"Address Proof (both parties)","hi":"पते का प्रमाण (दोनों पक्ष)","kn":"ವಿಳಾಸ ಪುರಾವೆ (ಇಬ್ಬರಿಗೂ)"},"status":"required"},{"id":"marriage_photo","name":{"en":"Marriage photograph","hi":"विवाह की तस्वीर","kn":"ಮದುವೆ ಫೋಟೋ"},"status":"required"},{"id":"witnesses","name":{"en":"Two witnesses with ID proof","hi":"दो गवाह आईडी प्रमाण सहित","kn":"ಗುರುತಿನ ಪ್ರಮಾಣ ಸಹಿತ ಇಬ್ಬರು ಸಾಕ್ಷಿಗಳು"},"status":"required"},{"id":"invitation","name":{"en":"Marriage invitation card (optional but helpful)","hi":"विवाह आमंत्रण कार्ड (वैकल्पिक)","kn":"ಮದುವೆ ಆಮಂತ್ರಣ ಪತ್ರ (ಐಚ್ಛಿಕ)"},"status":"optional"}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"Nominal registration fee. Check the Karnataka Kaveri Online or Sub-Registrar office for current fee.","hi":"मामूली पंजीकरण शुल्क।","kn":"ಸಾಮಾನ್ಯ ನೋಂದಣಿ ಶುಲ್ಕ."},"varies_by":"act"}',
  '[{"step_number":1,"title":{"en":"Apply on Kaveri Online or visit Sub-Registrar office"},"description":{"en":"Visit kaverionline.karnataka.gov.in or the Sub-Registrar office where either party resides."},"is_online":true,"is_offline":true},{"step_number":2,"title":{"en":"Fill marriage registration form"},"description":{"en":"Provide details of both parties, date of marriage, place."},"is_online":true,"is_offline":true},{"step_number":3,"title":{"en":"Appear with witnesses"},"description":{"en":"Both parties and two witnesses must be present at the Sub-Registrar office on the appointed date."},"is_online":false,"is_offline":true},{"step_number":4,"title":{"en":"Receive Marriage Certificate"},"description":{"en":"Certificate is issued after verification."},"is_online":false,"is_offline":true}]',
  'https://kaverionline.karnataka.gov.in',
  '{"en":"Kaveri Online — Karnataka Registration Portal","hi":"कावेरी ऑनलाइन — कर्नाटक पंजीकरण पोर्टल","kn":"ಕಾವೇರಿ ಆನ್‌ಲೈನ್ — ಕರ್ನಾಟಕ ನೋಂದಣಿ ಪೋರ್ಟಲ್"}',
  '{"en":"After in-person verification at the Sub-Registrar office, the Marriage Certificate is issued.","hi":"उप-रजिस्ट्रार कार्यालय में व्यक्तिगत सत्यापन के बाद, विवाह प्रमाणपत्र जारी किया जाता है।","kn":"ಉಪ-ರಿಜಿಸ್ಟ್ರಾರ್ ಕಚೇರಿಯಲ್ಲಿ ವ್ಯಕ್ತಿಗತ ಪರಿಶೀಲನೆಯ ನಂತರ ವಿವಾಹ ಪ್ರಮಾಣಪತ್ರ ನೀಡಲಾಗುತ್ತದೆ."}',
  '[{"problem":{"en":"Marriage registration refused or disputed"},"solution":{"en":"Disputes about marriage registration are legal matters. Consult a lawyer or contact the Registrar of Marriages."},"defer_to_official":true}]',
  'Source: kaverionline.karnataka.gov.in — needs human verification.',
  'needs_verification',
  ARRAY['marriage certificate','vivah promanapatra','marriage registration','wedding certificate','nikah registration','special marriage act'],
  true
);

-- 28. Police Clearance Certificate
INSERT INTO services (slug,name,category,tier,state,description,short_description,eligibility_rules,questions,required_documents,official_fee,steps,official_url,official_url_label,what_happens_after,troubleshooting,source_notes,verification_status,keywords,active)
VALUES(
  'police-clearance-certificate',
  '{"en":"Police Clearance Certificate (PCC)","hi":"पुलिस क्लियरेंस सर्टिफिकेट (PCC)","kn":"ಪೊಲೀಸ್ ಕ್ಲಿಯರೆನ್ಸ್ ಸರ್ಟಿಫಿಕೇಟ್ (PCC)"}',
  'police-verification',3,'karnataka',
  '{"en":"Obtain a Police Clearance Certificate (PCC) from Karnataka Police. Required for foreign visa applications, employment abroad, immigration, and certain domestic purposes.","hi":"विदेशी वीजा आवेदन, विदेश में रोजगार, आव्रजन के लिए कर्नाटक पुलिस से पुलिस क्लियरेंस प्रमाणपत्र प्राप्त करें।","kn":"ವಿದೇಶ ವೀಸಾ ಅರ್ಜಿ, ವಿದೇಶದಲ್ಲಿ ಉದ್ಯೋಗ, ವಲಸೆಗಾಗಿ ಕರ್ನಾಟಕ ಪೊಲೀಸ್‌ನಿಂದ ಪೊಲೀಸ್ ಕ್ಲಿಯರೆನ್ಸ್ ಸರ್ಟಿಫಿಕೇಟ್ ಪಡೆಯಿರಿ."}',
  '{"en":"Get a Police Clearance Certificate for visa, immigration, or employment.","hi":"वीजा, आव्रजन या रोजगार के लिए पुलिस क्लियरेंस प्रमाणपत्र प्राप्त करें।","kn":"ವೀಸಾ, ವಲಸೆ ಅಥವಾ ಉದ್ಯೋಗಕ್ಕಾಗಿ ಪೊಲೀಸ್ ಕ್ಲಿಯರೆನ್ಸ್ ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ."}',
  null,
  '[{"id":"pcc_purpose","type":"select","label":{"en":"What is the purpose of the PCC?","hi":"PCC का उद्देश्य क्या है?","kn":"PCC ಯ ಉದ್ದೇಶ ಏನು?"},"options":[{"value":"passport_visa","label":{"en":"Passport / Visa application","hi":"पासपोर्ट / वीजा आवेदन","kn":"ಪಾಸ್‌ಪೋರ್ಟ್ / ವೀಸಾ ಅರ್ಜಿ"}},{"value":"employment","label":{"en":"Employment abroad","hi":"विदेश में रोजगार","kn":"ವಿದೇಶದಲ್ಲಿ ಉದ್ಯೋಗ"}},{"value":"immigration","label":{"en":"Immigration / PR","hi":"आव्रजन / पीआर","kn":"ವಲಸೆ / PR"}},{"value":"other","label":{"en":"Other","hi":"अन्य","kn":"ಇತರೆ"}}],"required":true,"eligibility_relevant":false}]',
  '[{"id":"passport","name":{"en":"Passport copy","hi":"पासपोर्ट की प्रति","kn":"ಪಾಸ್‌ಪೋರ್ಟ್ ಪ್ರತಿ"},"status":"required"},{"id":"aadhaar","name":{"en":"Aadhaar Card","hi":"आधार कार्ड","kn":"ಆಧಾರ್ ಕಾರ್ಡ್"},"status":"required"},{"id":"address_proof","name":{"en":"Address Proof (current Karnataka address)","hi":"पते का प्रमाण (वर्तमान कर्नाटक पता)","kn":"ವಿಳಾಸ ಪುರಾವೆ (ಪ್ರಸ್ತುತ ಕರ್ನಾಟಕ ವಿಳಾಸ)"},"status":"required"},{"id":"purpose_doc","name":{"en":"Document showing purpose (offer letter, visa application, etc.)","hi":"उद्देश्य दिखाने वाला दस्तावेज़","kn":"ಉದ್ದೇಶ ತೋರಿಸುವ ದಾಖಲೆ"},"status":"optional"}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"Fee applies. Check Passport Seva or Karnataka Police portal for current PCC fee.","hi":"शुल्क लागू है।","kn":"ಶುಲ್ಕ ಅನ್ವಯಿಸುತ್ತದೆ."},"varies_by":"pcc_purpose"}',
  '[{"step_number":1,"title":{"en":"Apply on Passport Seva portal (for passport-linked PCC)"},"description":{"en":"For passport-related PCC, apply at passportindia.gov.in → Police Clearance Certificate."},"is_online":true,"is_offline":false},{"step_number":2,"title":{"en":"Or apply at local police station"},"description":{"en":"For other purposes, visit your local police station or the Commissioner''s office in Bengaluru."},"is_online":false,"is_offline":true},{"step_number":3,"title":{"en":"Police verification conducted"},"description":{"en":"Police verify your background and residential address."},"is_online":false,"is_offline":true},{"step_number":4,"title":{"en":"Receive PCC"},"description":{"en":"PCC is issued if background check is clear."},"is_online":false,"is_offline":true}]',
  'https://passportindia.gov.in',
  '{"en":"Passport Seva — PCC Application","hi":"पासपोर्ट सेवा — PCC आवेदन","kn":"ಪಾಸ್‌ಪೋರ್ಟ್ ಸೇವಾ — PCC ಅರ್ಜಿ"}',
  '{"en":"After police verification, PCC is issued if background is clear. This process is government-controlled and Government Work Helper cannot influence or track it.","hi":"पुलिस सत्यापन के बाद, यदि पृष्ठभूमि स्पष्ट है तो PCC जारी किया जाता है।","kn":"ಪೊಲೀಸ್ ಪರಿಶೀಲನೆಯ ನಂತರ ಹಿನ್ನೆಲೆ ಸ್ಪಷ್ಟವಾಗಿದ್ದರೆ PCC ನೀಡಲಾಗುತ್ತದೆ."}',
  '[{"problem":{"en":"PCC not issued due to pending cases or adverse report"},"solution":{"en":"This is a legal matter. Government Work Helper cannot advise on criminal matters or pending cases. Consult a lawyer."},"defer_to_official":true}]',
  'Source: passportindia.gov.in — needs human verification.',
  'needs_verification',
  ARRAY['police clearance','pcc','police certificate','character certificate','police verification','criminal record'],
  true
);

-- 29. Disability Certificate
INSERT INTO services (slug,name,category,tier,state,description,short_description,eligibility_rules,questions,required_documents,official_fee,steps,official_url,official_url_label,what_happens_after,troubleshooting,source_notes,verification_status,keywords,active)
VALUES(
  'disability-certificate',
  '{"en":"Disability Certificate","hi":"विकलांगता प्रमाणपत्र","kn":"ಅಂಗವೈಕಲ್ಯ ಪ್ರಮಾಣಪತ್ರ"}',
  'health-disability',3,'karnataka',
  '{"en":"Obtain a Disability Certificate (UDID) from Karnataka Disability Authority or designated government hospitals. Enables access to reservations, schemes, and concessions for persons with disabilities.","hi":"विकलांग व्यक्तियों के लिए आरक्षण, योजनाओं और रियायतों तक पहुंच के लिए कर्नाटक विकलांगता प्राधिकरण से विकलांगता प्रमाणपत्र प्राप्त करें।","kn":"ವಿಕಲಾಂಗ ವ್ಯಕ್ತಿಗಳ ಮೀಸಲಾತಿ, ಯೋಜನೆಗಳು ಮತ್ತು ರಿಯಾಯಿತಿಗಾಗಿ ಅಂಗವೈಕಲ್ಯ ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ."}',
  '{"en":"Get your Disability Certificate (UDID) for government schemes and reservations.","hi":"सरकारी योजनाओं और आरक्षण के लिए विकलांगता प्रमाणपत्र (UDID) प्राप्त करें।","kn":"ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಮೀಸಲಾತಿಗಾಗಿ ಅಂಗವೈಕಲ್ಯ ಪ್ರಮಾಣಪತ್ರ (UDID) ಪಡೆಯಿರಿ."}',
  null,
  '[{"id":"disability_type","type":"select","label":{"en":"What type of disability?","hi":"विकलांगता का प्रकार?","kn":"ಅಂಗವೈಕಲ್ಯದ ಪ್ರಕಾರ?"},"options":[{"value":"locomotor","label":{"en":"Locomotor / Physical","hi":"लोकोमोटर / शारीरिक","kn":"ಚಲನ / ದೈಹಿಕ"}},{"value":"visual","label":{"en":"Visual","hi":"दृश्य","kn":"ದೃಷ್ಟಿ"}},{"value":"hearing","label":{"en":"Hearing / Speech","hi":"सुनने / बोलने","kn":"ಶ್ರವಣ / ಭಾಷಣ"}},{"value":"intellectual","label":{"en":"Intellectual / Mental","hi":"बौद्धिक / मानसिक","kn":"ಬೌದ್ಧಿಕ / ಮಾನಸಿಕ"}},{"value":"other","label":{"en":"Other","hi":"अन्य","kn":"ಇತರೆ"}}],"required":true,"eligibility_relevant":false}]',
  '[{"id":"aadhaar","name":{"en":"Aadhaar Card","hi":"आधार कार्ड","kn":"ಆಧಾರ್ ಕಾರ್ಡ್"},"status":"required"},{"id":"medical_records","name":{"en":"Medical records / hospital reports showing disability","hi":"विकलांगता दर्शाने वाले चिकित्सा अभिलेख / अस्पताल रिपोर्ट","kn":"ಅಂಗವೈಕಲ್ಯ ತೋರಿಸುವ ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳು"},"status":"required"},{"id":"photo","name":{"en":"Recent passport-size photograph","hi":"हाल की पासपोर्ट आकार की तस्वीर","kn":"ಇತ್ತೀಚಿನ ಪಾಸ್‌ಪೋರ್ಟ್ ಗಾತ್ರದ ಫೋಟೋ"},"status":"required"}]',
  '{"amount":0,"currency":"INR","is_free":true,"notes":{"en":"Disability Certificate / UDID is issued free of charge.","hi":"विकलांगता प्रमाणपत्र / UDID निःशुल्क जारी किया जाता है।","kn":"ಅಂಗವೈಕಲ್ಯ ಪ್ರಮಾಣಪತ್ರ / UDID ಉಚಿತವಾಗಿ ನೀಡಲಾಗುತ್ತದೆ."},"varies_by":null}',
  '[{"step_number":1,"title":{"en":"Apply on UDID portal"},"description":{"en":"Visit udid.gov.in to apply for Unique Disability ID online."},"is_online":true,"is_offline":false},{"step_number":2,"title":{"en":"Or visit designated government hospital"},"description":{"en":"Visit a government hospital with a disability assessment board in Karnataka."},"is_online":false,"is_offline":true},{"step_number":3,"title":{"en":"Medical assessment"},"description":{"en":"A medical board assesses the type and percentage of disability."},"is_online":false,"is_offline":true},{"step_number":4,"title":{"en":"Certificate issued"},"description":{"en":"UDID card and disability certificate are issued based on the medical assessment."},"is_online":false,"is_offline":true}]',
  'https://udid.gov.in',
  '{"en":"UDID — Unique Disability ID Portal","hi":"UDID — यूनिक डिसेबिलिटी आईडी पोर्टल","kn":"UDID — ವಿಶಿಷ್ಟ ಅಂಗವೈಕಲ್ಯ ಗುರುತು ಪೋರ್ಟಲ್"}',
  '{"en":"After medical assessment by the government medical board, the UDID card and certificate are issued. They are valid for the period specified by the medical board.","hi":"सरकारी चिकित्सा बोर्ड द्वारा चिकित्सा मूल्यांकन के बाद, UDID कार्ड और प्रमाणपत्र जारी किया जाता है।","kn":"ಸರ್ಕಾರಿ ವೈದ್ಯಕೀಯ ಮಂಡಳಿ ಮೌಲ್ಯಮಾಪನದ ನಂತರ UDID ಕಾರ್ಡ್ ಮತ್ತು ಪ್ರಮಾಣಪತ್ರ ನೀಡಲಾಗುತ್ತದೆ."}',
  '[]',
  'Source: udid.gov.in — needs human verification.',
  'needs_verification',
  ARRAY['disability certificate','udid','divyang','handicap certificate','pwd certificate','vikalaanga'],
  true
);

-- 30. EPF / UAN Services
INSERT INTO services (slug,name,category,tier,state,description,short_description,eligibility_rules,questions,required_documents,official_fee,steps,official_url,official_url_label,what_happens_after,troubleshooting,source_notes,verification_status,keywords,active)
VALUES(
  'epf-uan-services',
  '{"en":"EPF / UAN Services (Withdrawal, KYC Update)","hi":"EPF / UAN सेवाएं (निकासी, KYC अपडेट)","kn":"EPF / UAN ಸೇವೆಗಳು (ಹಿಂತೆಗೆದುಕೊಳ್ಳುವಿಕೆ, KYC ನವೀಕರಣ)"}',
  'employment-benefits',3,'karnataka',
  '{"en":"Access your EPF (Employee Provident Fund) account through EPFO — withdraw funds, update KYC, transfer your PF, or check balance. Relevant for salaried employees in Karnataka.","hi":"EPFO के माध्यम से अपने EPF खाते का उपयोग करें — धन निकालें, KYC अपडेट करें, PF ट्रांसफर करें, या बैलेंस जाँचें।","kn":"EPFO ಮೂಲಕ ನಿಮ್ಮ EPF ಖಾತೆ ಬಳಸಿ — ಹಣ ಹಿಂತೆಗೆಯಿರಿ, KYC ನವೀಕರಿಸಿ, PF ವರ್ಗಾಯಿಸಿ, ಅಥವಾ ಬ್ಯಾಲೆನ್ಸ್ ಪರಿಶೀಲಿಸಿ."}',
  '{"en":"Manage your EPF — withdrawal, KYC update, or PF transfer.","hi":"अपने EPF का प्रबंधन करें — निकासी, KYC अपडेट, या PF ट्रांसफर।","kn":"ನಿಮ್ಮ EPF ನಿರ್ವಹಿಸಿ — ಹಿಂತೆಗೆದುಕೊಳ್ಳುವಿಕೆ, KYC ನವೀಕರಣ, ಅಥವಾ PF ವರ್ಗಾವಣೆ."}',
  '{"all":[{"field":"has_uan","operator":"equals","value":true,"message":"You must have a UAN (Universal Account Number) to access EPFO services"}]}',
  '[{"id":"has_uan","type":"boolean","label":{"en":"Do you have a UAN (Universal Account Number)?","hi":"क्या आपके पास UAN है?","kn":"ನಿಮ್ಮ ಬಳಿ UAN (ಯೂನಿವರ್ಸಲ್ ಅಕೌಂಟ್ ನಂಬರ್) ಇದೆಯೇ?"},"required":true,"eligibility_relevant":true},{"id":"epf_service","type":"select","label":{"en":"What do you need to do?","hi":"आपको क्या करना है?","kn":"ನೀವು ಏನು ಮಾಡಬೇಕು?"},"options":[{"value":"withdrawal","label":{"en":"Withdraw EPF funds","hi":"EPF निधि निकालें","kn":"EPF ಹಣ ಹಿಂತೆಗೆಯಿರಿ"}},{"value":"kyc","label":{"en":"Update KYC (Aadhaar/PAN/Bank)","hi":"KYC अपडेट करें","kn":"KYC ನವೀಕರಿಸಿ"}},{"value":"transfer","label":{"en":"Transfer PF to new employer","hi":"नए नियोक्ता को PF ट्रांसफर करें","kn":"ಹೊಸ ಉದ್ಯೋಗದಾತರಿಗೆ PF ವರ್ಗಾಯಿಸಿ"}},{"value":"balance","label":{"en":"Check balance","hi":"बैलेंस जाँचें","kn":"ಬ್ಯಾಲೆನ್ಸ್ ಪರಿಶೀಲಿಸಿ"}}],"required":true,"eligibility_relevant":false}]',
  '[{"id":"aadhaar_linked","name":{"en":"Aadhaar linked to UAN","hi":"UAN से जुड़ा आधार","kn":"UAN ಗೆ ಲಿಂಕ್ ಆದ ಆಧಾರ್"},"status":"required"},{"id":"bank_account","name":{"en":"Bank account linked to UAN","hi":"UAN से जुड़ा बैंक खाता","kn":"UAN ಗೆ ಲಿಂಕ್ ಆದ ಬ್ಯಾಂಕ್ ಖಾತೆ"},"status":"required"}]',
  '{"amount":0,"currency":"INR","is_free":true,"notes":{"en":"EPF portal services are free. No fee for withdrawal, KYC, or transfer.","hi":"EPF पोर्टल सेवाएं निःशुल्क हैं।","kn":"EPF ಪೋರ್ಟಲ್ ಸೇವೆಗಳು ಉಚಿತ."},"varies_by":null}',
  '[{"step_number":1,"title":{"en":"Log in to EPFO Member Portal"},"description":{"en":"Visit unifiedportal-mem.epfindia.gov.in and log in with your UAN and password."},"is_online":true,"is_offline":false},{"step_number":2,"title":{"en":"Navigate to the required service"},"description":{"en":"For withdrawal: Online Services → Claim. For KYC: Manage → KYC. For balance: Passbook."},"is_online":true,"is_offline":false},{"step_number":3,"title":{"en":"Complete the process online"},"description":{"en":"Follow the steps for your specific service. Aadhaar OTP verification required for most transactions."},"is_online":true,"is_offline":false}]',
  'https://unifiedportal-mem.epfindia.gov.in',
  '{"en":"EPFO Member Portal","hi":"EPFO सदस्य पोर्टल","kn":"EPFO ಸದಸ್ಯ ಪೋರ್ಟಲ್"}',
  '{"en":"For EPF withdrawal, the amount is credited to your linked bank account after processing (typically 5–10 working days). For KYC, approval by employer may be needed.","hi":"EPF निकासी के लिए, राशि प्रसंस्करण के बाद आपके बैंक खाते में जमा होती है।","kn":"EPF ಹಿಂತೆಗೆದುಕೊಳ್ಳಲು, ಮೊತ್ತ ಪ್ರಕ್ರಿಯೆಯ ನಂತರ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮಾ ಆಗುತ್ತದೆ."}',
  '[{"problem":{"en":"KYC not approved by employer"},"solution":{"en":"Contact your HR / employer to approve the KYC on the EPFO Employer portal. KYC must be employer-approved for most EPFO services."},"defer_to_official":false},{"problem":{"en":"UAN not activated or forgotten password"},"solution":{"en":"Visit the UAN portal to activate your UAN or reset your password using your registered mobile number."},"defer_to_official":false}]',
  'Source: epfindia.gov.in — needs human verification.',
  'needs_verification',
  ARRAY['epf','pf','epfo','uan','provident fund','epf withdrawal','pf transfer','pf balance','employee provident fund'],
  true
);

-- ============================================================
-- Seed: Tier 2 Services (11–20)
-- All marked needs_verification — human review required before
-- setting verification_status = 'verified'.
-- ============================================================

-- 11. Income Certificate
INSERT INTO services (slug,name,category,tier,state,description,short_description,eligibility_rules,questions,required_documents,official_fee,steps,official_url,official_url_label,what_happens_after,troubleshooting,source_notes,verification_status,keywords,active)
VALUES(
  'income-certificate',
  '{"en":"Income Certificate","hi":"आय प्रमाणपत्र","kn":"ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ"}',
  'certificates',2,'karnataka',
  '{"en":"Obtain an Income Certificate issued by the Karnataka Revenue Department. Used for scholarships, government schemes, fee concessions, and more.","hi":"छात्रवृत्ति, सरकारी योजनाओं, शुल्क रियायतों के लिए कर्नाटक राजस्व विभाग द्वारा जारी आय प्रमाणपत्र प्राप्त करें।","kn":"ವಿದ್ಯಾರ್ಥಿವೇತನ, ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ಶುಲ್ಕ ರಿಯಾಯಿತಿಗಳಿಗಾಗಿ ಕರ್ನಾಟಕ ಕಂದಾಯ ಇಲಾಖೆ ನೀಡುವ ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ."}',
  '{"en":"Prove your annual family income for government schemes and concessions.","hi":"सरकारी योजनाओं के लिए वार्षिक पारिवारिक आय प्रमाणित करें।","kn":"ಸರ್ಕಾರಿ ಯೋಜನೆಗಳಿಗಾಗಿ ವಾರ್ಷಿಕ ಕುಟುಂಬ ಆದಾಯ ದೃಢೀಕರಿಸಿ."}',
  null,
  '[{"id":"income_source","type":"select","label":{"en":"What is your primary source of income?","hi":"आपकी आय का मुख्य स्रोत क्या है?","kn":"ನಿಮ್ಮ ಮುಖ್ಯ ಆದಾಯ ಮೂಲ ಯಾವುದು?"},"options":[{"value":"salary","label":{"en":"Salary / Employment","hi":"वेतन / रोजगार","kn":"ವೇತನ / ಉದ್ಯೋಗ"}},{"value":"agriculture","label":{"en":"Agriculture","hi":"कृषि","kn":"ಕೃಷಿ"}},{"value":"business","label":{"en":"Business / Self-employed","hi":"व्यापार / स्व-रोजगार","kn":"ವ್ಯಾಪಾರ / ಸ್ವಯಂ ಉದ್ಯೋಗ"}},{"value":"other","label":{"en":"Other","hi":"अन्य","kn":"ಇತರೆ"}}],"required":true,"eligibility_relevant":false}]',
  '[{"id":"aadhaar","name":{"en":"Aadhaar Card","hi":"आधार कार्ड","kn":"ಆಧಾರ್ ಕಾರ್ಡ್"},"status":"required"},{"id":"ration_card","name":{"en":"Ration Card","hi":"राशन कार्ड","kn":"ಪಡಿತರ ಚೀಟಿ"},"status":"required"},{"id":"salary_slip","name":{"en":"Salary Slip / Income proof (latest month)","hi":"वेतन पर्ची / आय प्रमाण","kn":"ವೇತನ ಚೀಟಿ / ಆದಾಯ ಪ್ರಮಾಣ"},"status":"conditional","required_when":{"field":"income_source","operator":"equals","value":"salary"}},{"id":"land_records","name":{"en":"Land records / RTC (for agricultural income)","hi":"भूमि अभिलेख / आरटीसी (कृषि आय के लिए)","kn":"ಭೂ ದಾಖಲೆಗಳು / RTC (ಕೃಷಿ ಆದಾಯಕ್ಕಾಗಿ)"},"status":"conditional","required_when":{"field":"income_source","operator":"equals","value":"agriculture"}}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"A nominal fee applies. Verify on Nadakacheri / Karnataka Seva Sindhu portal.","hi":"एक मामूली शुल्क लागू है। नादकचेरी / कर्नाटक सेवा सिंधु पोर्टल पर जाँचें।","kn":"ಸಾಮಾನ್ಯ ಶುಲ್ಕ ಅನ್ವಯಿಸುತ್ತದೆ. ನಾಡ ಕಚೇರಿ / ಕರ್ನಾಟಕ ಸೇವಾ ಸಿಂಧು ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ."},"varies_by":null}',
  '[{"step_number":1,"title":{"en":"Apply on Karnataka Seva Sindhu / Nadakacheri"},"description":{"en":"Visit sevasindhu.karnataka.gov.in or your nearest Nadakacheri centre."},"is_online":true,"is_offline":true},{"step_number":2,"title":{"en":"Fill the income certificate application"},"description":{"en":"Provide family income details and the purpose for which the certificate is needed."},"is_online":true,"is_offline":true},{"step_number":3,"title":{"en":"Upload or submit documents"},"description":{"en":"Upload Aadhaar, ration card, and income proof."},"is_online":true,"is_offline":true},{"step_number":4,"title":{"en":"Pay the fee and submit"},"description":{"en":"Pay the fee and submit. Note your reference number."},"is_online":true,"is_offline":true},{"step_number":5,"title":{"en":"Receive the certificate"},"description":{"en":"Certificate is issued digitally or in person at Nadakacheri after verification by the Revenue Inspector/Tahsildar."},"is_online":true,"is_offline":true}]',
  'https://sevasindhu.karnataka.gov.in',
  '{"en":"Karnataka Seva Sindhu Portal","hi":"कर्नाटक सेवा सिंधु पोर्टल","kn":"ಕರ್ನಾಟಕ ಸೇವಾ ಸಿಂಧು ಪೋರ್ಟಲ್"}',
  '{"en":"After submission, the Revenue Inspector verifies your income details. The Tahsildar approves and digitally signs the certificate. You can download it from the portal.","hi":"सबमिशन के बाद, राजस्व निरीक्षक आपकी आय विवरणों की जाँच करता है।","kn":"ಸಲ್ಲಿಕೆಯ ನಂತರ ಕಂದಾಯ ನಿರೀಕ್ಷಕ ನಿಮ್ಮ ಆದಾಯ ವಿವರ ಪರಿಶೀಲಿಸುತ್ತಾರೆ."}',
  '[{"problem":{"en":"Certificate rejected — income too high"},"solution":{"en":"Income certificates are issued for the income you declare and can prove. Ensure your supporting documents accurately reflect your income."},"defer_to_official":false}]',
  'Source: sevasindhu.karnataka.gov.in — needs human verification of current fee and process.',
  'needs_verification',
  ARRAY['income certificate','income proof','salary certificate','annual income','aay praman patra','aadaya promanapatra','nadakacheri'],
  true
);

-- 12. Caste Certificate
INSERT INTO services (slug,name,category,tier,state,description,short_description,eligibility_rules,questions,required_documents,official_fee,steps,official_url,official_url_label,what_happens_after,troubleshooting,source_notes,verification_status,keywords,active)
VALUES(
  'caste-certificate',
  '{"en":"Caste Certificate","hi":"जाति प्रमाणपत्र","kn":"ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ"}',
  'certificates',2,'karnataka',
  '{"en":"Obtain a Caste Certificate (SC/ST/OBC) from the Karnataka Revenue Department. Required for reservations, government schemes, educational admissions, and jobs.","hi":"कर्नाटक राजस्व विभाग से जाति प्रमाणपत्र प्राप्त करें।","kn":"ಮೀಸಲಾತಿ, ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ಪ್ರವೇಶ ಮತ್ತು ಉದ್ಯೋಗಕ್ಕಾಗಿ ಕರ್ನಾಟಕ ಕಂದಾಯ ಇಲಾಖೆಯಿಂದ ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ."}',
  '{"en":"Get your SC/ST/OBC caste certificate for reservations and government benefits.","hi":"आरक्षण और सरकारी लाभ के लिए जाति प्रमाणपत्र प्राप्त करें।","kn":"ಮೀಸಲಾತಿ ಮತ್ತು ಸರ್ಕಾರಿ ಸೌಲಭ್ಯಗಳಿಗಾಗಿ ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ."}',
  null,
  '[{"id":"caste_category","type":"select","label":{"en":"What is your caste category?","hi":"आपकी जाति श्रेणी क्या है?","kn":"ನಿಮ್ಮ ಜಾತಿ ವರ್ಗ ಯಾವುದು?"},"options":[{"value":"sc","label":{"en":"SC (Scheduled Caste)","hi":"अनुसूचित जाति","kn":"ಪರಿಶಿಷ್ಟ ಜಾತಿ"}},{"value":"st","label":{"en":"ST (Scheduled Tribe)","hi":"अनुसूचित जनजाति","kn":"ಪರಿಶಿಷ್ಟ ಪಂಗಡ"}},{"value":"obc","label":{"en":"OBC (Other Backward Classes)","hi":"ओबीसी","kn":"ಇತರ ಹಿಂದುಳಿದ ವರ್ಗ"}}],"required":true,"eligibility_relevant":false}]',
  '[{"id":"aadhaar","name":{"en":"Aadhaar Card","hi":"आधार कार्ड","kn":"ಆಧಾರ್ ಕಾರ್ಡ್"},"status":"required"},{"id":"ration_card","name":{"en":"Ration Card","hi":"राशन कार्ड","kn":"ಪಡಿತರ ಚೀಟಿ"},"status":"required"},{"id":"parent_caste_cert","name":{"en":"Parent''s Caste Certificate (if available)","hi":"माता-पिता का जाति प्रमाणपत्र (यदि उपलब्ध हो)","kn":"ಪೋಷಕರ ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ (ಲಭ್ಯವಿದ್ದರೆ)"},"status":"optional"},{"id":"school_cert","name":{"en":"School Transfer Certificate (showing caste)","hi":"स्कूल स्थानांतरण प्रमाण पत्र (जाति दर्शाते हुए)","kn":"ಶಾಲಾ ವರ್ಗಾವಣೆ ಪ್ರಮಾಣಪತ್ರ (ಜಾತಿ ತೋರಿಸುವ)"},"status":"optional"}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"Nominal fee. Check Seva Sindhu / Nadakacheri portal for current fee.","hi":"मामूली शुल्क। वर्तमान शुल्क के लिए पोर्टल पर जाँचें।","kn":"ಸಾಮಾನ್ಯ ಶುಲ್ಕ. ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಪರಿಶೀಲಿಸಿ."},"varies_by":null}',
  '[{"step_number":1,"title":{"en":"Apply on Karnataka Seva Sindhu / Nadakacheri"},"description":{"en":"Visit sevasindhu.karnataka.gov.in or your nearest Nadakacheri."},"is_online":true,"is_offline":true},{"step_number":2,"title":{"en":"Fill the caste certificate application"},"description":{"en":"Provide your caste, sub-caste, and relevant details."},"is_online":true,"is_offline":true},{"step_number":3,"title":{"en":"Upload documents"},"description":{"en":"Upload Aadhaar, ration card, and any supporting caste documents."},"is_online":true,"is_offline":true},{"step_number":4,"title":{"en":"Pay fee and submit"},"description":{"en":"Pay the applicable fee and submit."},"is_online":true,"is_offline":true}]',
  'https://sevasindhu.karnataka.gov.in',
  '{"en":"Karnataka Seva Sindhu Portal","hi":"कर्नाटक सेवा सिंधु पोर्टल","kn":"ಕರ್ನಾಟಕ ಸೇವಾ ಸಿಂಧು ಪೋರ್ಟಲ್"}',
  '{"en":"After submission, the Village Accountant or Revenue Inspector verifies caste details. The Tahsildar issues the certificate digitally.","hi":"सबमिशन के बाद, ग्राम लेखाकार या राजस्व निरीक्षक जाति विवरण सत्यापित करता है।","kn":"ಸಲ್ಲಿಕೆಯ ನಂತರ ಗ್ರಾಮ ಲೆಕ್ಕಾಧಿಕಾರಿ ಜಾತಿ ವಿವರ ಪರಿಶೀಲಿಸುತ್ತಾರೆ."}',
  '[{"problem":{"en":"Caste not found in Karnataka list"},"solution":{"en":"Karnataka maintains its own OBC list (different from central OBC list). Verify your caste name and spelling against the official Karnataka list."},"defer_to_official":true}]',
  'Source: sevasindhu.karnataka.gov.in — needs human verification.',
  'needs_verification',
  ARRAY['caste certificate','sc certificate','st certificate','obc certificate','community certificate','jati praman patra','jaati promanapatra'],
  true
);

-- 13. Birth Certificate
INSERT INTO services (slug,name,category,tier,state,description,short_description,eligibility_rules,questions,required_documents,official_fee,steps,official_url,official_url_label,what_happens_after,troubleshooting,source_notes,verification_status,keywords,active)
VALUES(
  'birth-certificate',
  '{"en":"Birth Certificate","hi":"जन्म प्रमाणपत्र","kn":"ಜನನ ಪ್ರಮಾಣಪತ್ರ"}',
  'certificates',2,'karnataka',
  '{"en":"Apply for a Birth Certificate in Karnataka from the local body (Municipal Corporation, Gram Panchayat). Required for school admissions, passports, and official age proof.","hi":"स्कूल प्रवेश, पासपोर्ट, और आधिकारिक आयु प्रमाण के लिए कर्नाटक में स्थानीय निकाय से जन्म प्रमाणपत्र प्राप्त करें।","kn":"ಶಾಲಾ ಪ್ರವೇಶ, ಪಾಸ್‌ಪೋರ್ಟ್ ಮತ್ತು ಅಧಿಕೃತ ವಯಸ್ಸಿನ ಪುರಾವೆಗಾಗಿ ಜನನ ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ."}',
  '{"en":"Get your Birth Certificate from your local municipal body or gram panchayat.","hi":"स्थानीय निकाय से जन्म प्रमाणपत्र प्राप्त करें।","kn":"ಸ್ಥಳೀಯ ಸಂಸ್ಥೆಯಿಂದ ಜನನ ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ."}',
  null,
  '[{"id":"registration_status","type":"select","label":{"en":"Was the birth registered at the time of birth?","hi":"क्या जन्म के समय जन्म पंजीकृत किया गया था?","kn":"ಹುಟ್ಟಿದ ಸಮಯದಲ್ಲಿ ಜನನ ನೋಂದಣಿ ಆಗಿದೆಯೇ?"},"options":[{"value":"yes_within_21","label":{"en":"Yes, within 21 days","hi":"हाँ, 21 दिनों के भीतर","kn":"ಹೌದು, 21 ದಿನಗಳಲ್ಲಿ"}},{"value":"yes_delayed","label":{"en":"Yes, but delayed (after 21 days)","hi":"हाँ, लेकिन विलंबित (21 दिनों के बाद)","kn":"ಹೌದು, ಆದರೆ ವಿಳಂಬ (21 ದಿನಗಳ ನಂತರ)"}},{"value":"not_registered","label":{"en":"Not registered yet","hi":"अभी तक पंजीकृत नहीं","kn":"ಇನ್ನೂ ನೋಂದಾಯಿಸಲಾಗಿಲ್ಲ"}}],"required":true,"eligibility_relevant":false}]',
  '[{"id":"hospital_cert","name":{"en":"Hospital discharge certificate / birth intimation letter","hi":"अस्पताल छुट्टी प्रमाण पत्र / जन्म सूचना पत्र","kn":"ಆಸ್ಪತ್ರೆ ಡಿಸ್ಚಾರ್ಜ್ ಪ್ರಮಾಣಪತ್ರ / ಜನನ ತಿಳಿಸೋ ಪತ್ರ"},"status":"required"},{"id":"parents_id","name":{"en":"Parents'' Aadhaar / ID proof","hi":"माता-पिता का आधार / पहचान प्रमाण","kn":"ಪೋಷಕರ ಆಧಾರ್ / ಗುರುತಿನ ಪ್ರಮಾಣ"},"status":"required"},{"id":"affidavit","name":{"en":"Affidavit for delayed registration (if applicable)","hi":"विलंबित पंजीकरण के लिए शपथ पत्र (यदि लागू हो)","kn":"ವಿಳಂಬ ನೋಂದಣಿಗಾಗಿ ಪ್ರಮಾಣ ಪತ್ರ (ಅನ್ವಯಿಸಿದರೆ)"},"status":"conditional"}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"Nominal fee. Check Karnataka Janma Mrityu Nondani portal or your local body for current fee.","hi":"मामूली शुल्क।","kn":"ಸಾಮಾನ್ಯ ಶುಲ್ಕ."},"varies_by":"registration_status"}',
  '[{"step_number":1,"title":{"en":"Apply online or visit local body"},"description":{"en":"Use Karnataka Janma Mrityu Nondani portal (jnk.karnataka.gov.in) or visit Municipal Corporation / Gram Panchayat."},"is_online":true,"is_offline":true},{"step_number":2,"title":{"en":"Submit birth registration form"},"description":{"en":"Fill the birth registration form with all birth details (date, place, parents)."},"is_online":true,"is_offline":true},{"step_number":3,"title":{"en":"Submit supporting documents"},"description":{"en":"Provide hospital certificate, parents'' identity proof."},"is_online":true,"is_offline":true},{"step_number":4,"title":{"en":"Pay fee and collect certificate"},"description":{"en":"Pay the fee. Certificate is issued after verification."},"is_online":true,"is_offline":true}]',
  'https://jnk.karnataka.gov.in',
  '{"en":"Karnataka Janma Mrityu Nondani Portal","hi":"कर्नाटक जन्म मृत्यु नोंदणी पोर्टल","kn":"ಕರ್ನಾಟಕ ಜನ್ಮ ಮೃತ್ಯು ನೋಂದಣಿ ಪೋರ್ಟಲ್"}',
  '{"en":"After registration, the birth certificate is issued by the local body registrar. You can download a digitally signed copy from the portal.","hi":"पंजीकरण के बाद, जन्म प्रमाणपत्र स्थानीय निकाय रजिस्ट्रार द्वारा जारी किया जाता है।","kn":"ನೋಂದಣಿಯ ನಂತರ ಜನನ ಪ್ರಮಾಣಪತ್ರ ಸ್ಥಳೀಯ ಸಂಸ್ಥೆ ರಿಜಿಸ್ಟ್ರಾರ್ ನೀಡುತ್ತಾರೆ."}',
  '[{"problem":{"en":"Birth not registered — born more than 1 year ago"},"solution":{"en":"For delayed registration beyond 1 year, a court order may be required. This is a complex process — visit your local body office for specific guidance."},"defer_to_official":true}]',
  'Source: jnk.karnataka.gov.in — needs human verification.',
  'needs_verification',
  ARRAY['birth certificate','janma promanapatra','janma pramana','birth registration','janma certificate'],
  true
);

-- 14. Death Certificate
INSERT INTO services (slug,name,category,tier,state,description,short_description,eligibility_rules,questions,required_documents,official_fee,steps,official_url,official_url_label,what_happens_after,troubleshooting,source_notes,verification_status,keywords,active)
VALUES(
  'death-certificate',
  '{"en":"Death Certificate","hi":"मृत्यु प्रमाणपत्र","kn":"ಮರಣ ಪ್ರಮಾಣಪತ್ರ"}',
  'certificates',2,'karnataka',
  '{"en":"Obtain a Death Certificate from the Karnataka local body (Municipal Corporation / Gram Panchayat). Required for property transfer, insurance claims, and other legal purposes.","hi":"कर्नाटक स्थानीय निकाय से मृत्यु प्रमाणपत्र प्राप्त करें।","kn":"ಆಸ್ತಿ ವರ್ಗಾವಣೆ, ವಿಮೆ ಹಕ್ಕುಗಳಿಗಾಗಿ ಕರ್ನಾಟಕ ಸ್ಥಳೀಯ ಸಂಸ್ಥೆಯಿಂದ ಮರಣ ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ."}',
  '{"en":"Get a Death Certificate from your local municipal body or gram panchayat.","hi":"स्थानीय निकाय से मृत्यु प्रमाणपत्र प्राप्त करें।","kn":"ಸ್ಥಳೀಯ ಸಂಸ್ಥೆಯಿಂದ ಮರಣ ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ."}',
  null,
  '[{"id":"death_location","type":"select","label":{"en":"Where did the death occur?","hi":"मृत्यु कहाँ हुई?","kn":"ಮರಣ ಎಲ್ಲಿ ಸಂಭವಿಸಿತು?"},"options":[{"value":"hospital","label":{"en":"Hospital","hi":"अस्पताल","kn":"ಆಸ್ಪತ್ರೆ"}},{"value":"home","label":{"en":"Home","hi":"घर","kn":"ಮನೆ"}},{"value":"other","label":{"en":"Other","hi":"अन्य","kn":"ಇತರೆ"}}],"required":true,"eligibility_relevant":false}]',
  '[{"id":"hospital_death_cert","name":{"en":"Hospital death intimation letter / certificate","hi":"अस्पताल मृत्यु सूचना पत्र / प्रमाण पत्र","kn":"ಆಸ್ಪತ್ರೆ ಮರಣ ತಿಳಿಸೋ ಪತ್ರ"},"status":"conditional","required_when":{"field":"death_location","operator":"equals","value":"hospital"}},{"id":"deceased_id","name":{"en":"Deceased person''s Aadhaar / ID proof","hi":"मृतक का आधार / पहचान प्रमाण","kn":"ಮೃತ ವ್ಯಕ್ತಿಯ ಆಧಾರ್ / ಗುರುತಿನ ಪ್ರಮಾಣ"},"status":"required"},{"id":"applicant_id","name":{"en":"Applicant''s Aadhaar (relationship to deceased)","hi":"आवेदक का आधार (मृतक से संबंध)","kn":"ಅರ್ಜಿದಾರರ ಆಧಾರ್ (ಮೃತನ ಸಂಬಂಧ)"},"status":"required"}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"Nominal fee. Verify on Karnataka Janma Mrityu Nondani portal.","hi":"मामूली शुल्क।","kn":"ಸಾಮಾನ್ಯ ಶುಲ್ಕ."},"varies_by":null}',
  '[{"step_number":1,"title":{"en":"Register the death within 21 days"},"description":{"en":"Death must be reported to the local body (Municipal Corporation or Gram Panchayat) within 21 days of occurrence."},"is_online":false,"is_offline":true},{"step_number":2,"title":{"en":"Apply online or in person"},"description":{"en":"Use jnk.karnataka.gov.in or visit the local body office."},"is_online":true,"is_offline":true},{"step_number":3,"title":{"en":"Submit documents"},"description":{"en":"Submit hospital certificate (if applicable), deceased''s ID, applicant''s ID."},"is_online":true,"is_offline":true},{"step_number":4,"title":{"en":"Collect the death certificate"},"description":{"en":"After verification, the certificate is issued."},"is_online":true,"is_offline":true}]',
  'https://jnk.karnataka.gov.in',
  '{"en":"Karnataka Janma Mrityu Nondani Portal","hi":"कर्नाटक जन्म मृत्यु नोंदणी पोर्टल","kn":"ಕರ್ನಾಟಕ ಜನ್ಮ ಮೃತ್ಯು ನೋಂದಣಿ ಪೋರ್ಟಲ್"}',
  '{"en":"After registration, the death certificate is issued. A digitally signed copy can be downloaded from the portal.","hi":"पंजीकरण के बाद, मृत्यु प्रमाणपत्र जारी किया जाता है।","kn":"ನೋಂದಣಿಯ ನಂತರ ಮರಣ ಪ್ರಮಾಣಪತ್ರ ನೀಡಲಾಗುತ್ತದೆ."}',
  '[{"problem":{"en":"Death not registered within 21 days"},"solution":{"en":"Delayed registration beyond 21 days requires an additional affidavit. For deaths older than 1 year, contact the local body for specific procedure — this may require a court order."},"defer_to_official":true}]',
  'Source: jnk.karnataka.gov.in — needs human verification.',
  'needs_verification',
  ARRAY['death certificate','mrityu promanapatra','death registration','death proof'],
  true
);

-- 15. Domicile/Residence Certificate
INSERT INTO services (slug,name,category,tier,state,description,short_description,eligibility_rules,questions,required_documents,official_fee,steps,official_url,official_url_label,what_happens_after,troubleshooting,source_notes,verification_status,keywords,active)
VALUES(
  'domicile-certificate',
  '{"en":"Domicile / Residence Certificate","hi":"अधिवास / निवास प्रमाणपत्र","kn":"ನಿವಾಸ ಪ್ರಮಾಣಪತ್ರ"}',
  'certificates',2,'karnataka',
  '{"en":"Get a Domicile or Residence Certificate from Karnataka Revenue Department to prove your state residency. Required for educational admissions, employment, and government schemes.","hi":"शैक्षिक प्रवेश, रोजगार, और सरकारी योजनाओं के लिए कर्नाटक राजस्व विभाग से अधिवास प्रमाणपत्र प्राप्त करें।","kn":"ಶೈಕ್ಷಣಿಕ ಪ್ರವೇಶ, ಉದ್ಯೋಗ ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳಿಗಾಗಿ ಕರ್ನಾಟಕ ಕಂದಾಯ ಇಲಾಖೆಯಿಂದ ನಿವಾಸ ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ."}',
  '{"en":"Prove your Karnataka residency with an official certificate.","hi":"अपनी कर्नाटक निवास की आधिकारिक पुष्टि करें।","kn":"ಕರ್ನಾಟಕ ನಿವಾಸವನ್ನು ಅಧಿಕೃತ ಪ್ರಮಾಣಪತ್ರದೊಂದಿಗೆ ದೃಢೀಕರಿಸಿ."}',
  null,
  '[{"id":"years_in_karnataka","type":"select","label":{"en":"How long have you lived in Karnataka?","hi":"आप कर्नाटक में कितने समय से रह रहे हैं?","kn":"ನೀವು ಕರ್ನಾಟಕದಲ್ಲಿ ಎಷ್ಟು ದಿನಗಳಿಂದ ವಾಸಿಸುತ್ತಿದ್ದೀರಿ?"},"options":[{"value":"less_1","label":{"en":"Less than 1 year","hi":"1 साल से कम","kn":"1 ವರ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ"}},{"value":"1_to_5","label":{"en":"1–5 years","hi":"1-5 साल","kn":"1–5 ವರ್ಷ"}},{"value":"5_plus","label":{"en":"More than 5 years","hi":"5 साल से अधिक","kn":"5 ವರ್ಷಕ್ಕಿಂತ ಹೆಚ್ಚು"}}],"required":true,"eligibility_relevant":false}]',
  '[{"id":"aadhaar","name":{"en":"Aadhaar (with Karnataka address)","hi":"आधार (कर्नाटक पते के साथ)","kn":"ಆಧಾರ್ (ಕರ್ನಾಟಕ ವಿಳಾಸ ಸಹಿತ)"},"status":"required"},{"id":"ration_card","name":{"en":"Ration Card","hi":"राशन कार्ड","kn":"ಪಡಿತರ ಚೀಟಿ"},"status":"required"},{"id":"additional_address_proof","name":{"en":"Additional address proof (electricity bill, etc.)","hi":"अतिरिक्त पते का प्रमाण (बिजली बिल आदि)","kn":"ಹೆಚ್ಚುವರಿ ವಿಳಾಸ ಪುರಾವೆ (ವಿದ್ಯುತ್ ಬಿಲ್ ಇತ್ಯಾದಿ)"},"status":"optional"}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"Nominal fee. Verify on Seva Sindhu portal.","hi":"मामूली शुल्क।","kn":"ಸಾಮಾನ್ಯ ಶುಲ್ಕ."},"varies_by":null}',
  '[{"step_number":1,"title":{"en":"Apply on Karnataka Seva Sindhu / Nadakacheri"},"description":{"en":"Visit sevasindhu.karnataka.gov.in or nearest Nadakacheri."},"is_online":true,"is_offline":true},{"step_number":2,"title":{"en":"Fill application and upload documents"},"description":{"en":"Provide your Karnataka address details and upload proof."},"is_online":true,"is_offline":true},{"step_number":3,"title":{"en":"Pay and submit"},"description":{"en":"Pay fee and submit. Certificate issued after Tahsildar verification."},"is_online":true,"is_offline":true}]',
  'https://sevasindhu.karnataka.gov.in',
  '{"en":"Karnataka Seva Sindhu Portal","hi":"कर्नाटक सेवा सिंधु पोर्टल","kn":"ಕರ್ನಾಟಕ ಸೇವಾ ಸಿಂಧು ಪೋರ್ಟಲ್"}',
  '{"en":"Certificate is issued digitally after verification by the Revenue Department.","hi":"राजस्व विभाग के सत्यापन के बाद प्रमाणपत्र डिजिटल रूप से जारी किया जाता है।","kn":"ಕಂದಾಯ ಇಲಾಖೆಯ ಪರಿಶೀಲನೆಯ ನಂತರ ಪ್ರಮಾಣಪತ್ರ ಡಿಜಿಟಲ್ ಆಗಿ ನೀಡಲಾಗುತ್ತದೆ."}',
  '[]',
  'Source: sevasindhu.karnataka.gov.in — needs human verification.',
  'needs_verification',
  ARRAY['domicile certificate','residence certificate','nivaas praman patra','Karnataka resident','state certificate'],
  true
);

-- 16. Passport — New / Renewal
INSERT INTO services (slug,name,category,tier,state,description,short_description,eligibility_rules,questions,required_documents,official_fee,steps,official_url,official_url_label,what_happens_after,troubleshooting,source_notes,verification_status,keywords,active)
VALUES(
  'passport',
  '{"en":"Passport — New Application / Renewal","hi":"पासपोर्ट — नया आवेदन / नवीनीकरण","kn":"ಪಾಸ್‌ಪೋರ್ಟ್ — ಹೊಸ ಅರ್ಜಿ / ನವೀಕರಣ"}',
  'identity-documents',2,'karnataka',
  '{"en":"Apply for a new Indian Passport or renew your existing one through the Passport Seva Portal (Ministry of External Affairs). Valid for international travel.","hi":"पासपोर्ट सेवा पोर्टल के माध्यम से नए भारतीय पासपोर्ट के लिए आवेदन करें या मौजूदा पासपोर्ट का नवीनीकरण करें।","kn":"ಪಾಸ್‌ಪೋರ್ಟ್ ಸೇವಾ ಪೋರ್ಟಲ್ ಮೂಲಕ ಹೊಸ ಭಾರತೀಯ ಪಾಸ್‌ಪೋರ್ಟ್‌ಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ಅಥವಾ ಅಸ್ತಿತ್ವದಲ್ಲಿರುವದನ್ನು ನವೀಕರಿಸಿ."}',
  '{"en":"Get your Indian passport for international travel — new or renewal.","hi":"अंतरराष्ट्रीय यात्रा के लिए भारतीय पासपोर्ट प्राप्त करें।","kn":"ಅಂತಾರಾಷ್ಟ್ರೀಯ ಪ್ರಯಾಣಕ್ಕಾಗಿ ಭಾರತೀಯ ಪಾಸ್‌ಪೋರ್ಟ್ ಪಡೆಯಿರಿ."}',
  null,
  '[{"id":"passport_type","type":"select","label":{"en":"Is this a new passport or renewal?","hi":"क्या यह नया पासपोर्ट है या नवीनीकरण?","kn":"ಇದು ಹೊಸ ಪಾಸ್‌ಪೋರ್ಟ್ ಅಥವಾ ನವೀಕರಣ?"},"options":[{"value":"new","label":{"en":"New passport","hi":"नया पासपोर्ट","kn":"ಹೊಸ ಪಾಸ್‌ಪೋರ್ಟ್"}},{"value":"renewal","label":{"en":"Renewal","hi":"नवीनीकरण","kn":"ನವೀಕರಣ"}}],"required":true,"eligibility_relevant":false}]',
  '[{"id":"poi","name":{"en":"Proof of Identity (Aadhaar / Voter ID / DL)","hi":"पहचान प्रमाण (आधार / वोटर आईडी / DL)","kn":"ಗುರುತಿನ ಪುರಾವೆ"},"status":"required"},{"id":"poa","name":{"en":"Proof of Address","hi":"पते का प्रमाण","kn":"ವಿಳಾಸ ಪುರಾವೆ"},"status":"required"},{"id":"pob","name":{"en":"Proof of Date of Birth (Birth certificate / Aadhaar)","hi":"जन्म तिथि का प्रमाण","kn":"ಜನ್ಮ ದಿನಾಂಕ ಪುರಾವೆ"},"status":"required"},{"id":"old_passport","name":{"en":"Existing passport (for renewal)","hi":"मौजूदा पासपोर्ट (नवीनीकरण के लिए)","kn":"ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಪಾಸ್‌ಪೋರ್ಟ್ (ನವೀಕರಣಕ್ಕಾಗಿ)"},"status":"conditional","required_when":{"field":"passport_type","operator":"equals","value":"renewal"}}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"Fee varies by passport type (36 or 60 pages) and service type (normal or Tatkaal). Check passportindia.gov.in for current fees.","hi":"शुल्क पासपोर्ट प्रकार और सेवा प्रकार के अनुसार भिन्न होता है।","kn":"ಶುಲ್ಕ ಪಾಸ್‌ಪೋರ್ಟ್ ಪ್ರಕಾರ ಮತ್ತು ಸೇವಾ ಪ್ರಕಾರಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಬೇರೆಯಾಗಿರುತ್ತದೆ."},"varies_by":"passport_type"}',
  '[{"step_number":1,"title":{"en":"Register on Passport Seva Portal"},"description":{"en":"Visit passportindia.gov.in. Register with your email and mobile."},"is_online":true,"is_offline":false},{"step_number":2,"title":{"en":"Fill the application form"},"description":{"en":"Fill the relevant form (fresh or re-issue). Provide all personal details accurately."},"is_online":true,"is_offline":false},{"step_number":3,"title":{"en":"Schedule an appointment"},"description":{"en":"Book an appointment at the Bengaluru PSK (Passport Seva Kendra) or PSP (Post Office Passport Seva)."},"is_online":true,"is_offline":false},{"step_number":4,"title":{"en":"Pay the fee"},"description":{"en":"Pay the application fee online."},"is_online":true,"is_offline":false},{"step_number":5,"title":{"en":"Visit the Passport Seva Kendra"},"description":{"en":"Visit on your appointment date with original documents. Biometrics and photo are captured."},"is_online":false,"is_offline":true},{"step_number":6,"title":{"en":"Police verification and passport dispatch"},"description":{"en":"Police verification is conducted (may be pre or post dispatch). Passport is dispatched by Speed Post."},"is_online":false,"is_offline":true}]',
  'https://passportindia.gov.in',
  '{"en":"Passport Seva — Official Passport Portal","hi":"पासपोर्ट सेवा — आधिकारिक पासपोर्ट पोर्टल","kn":"ಪಾಸ್‌ಪೋರ್ಟ್ ಸೇವಾ — ಅಧಿಕೃತ ಪಾಸ್‌ಪೋರ್ಟ್ ಪೋರ್ಟಲ್"}',
  '{"en":"After your PSK visit, your application enters police verification. Once cleared, your passport is printed and dispatched by Speed Post (typically 4–6 weeks for normal service, faster for Tatkaal).","hi":"PSK में जाने के बाद, आपका आवेदन पुलिस सत्यापन में जाता है।","kn":"PSK ಭೇಟಿಯ ನಂತರ, ನಿಮ್ಮ ಅರ್ಜಿ ಪೊಲೀಸ್ ಪರಿಶೀಲನೆಗೆ ಹೋಗುತ್ತದೆ."}',
  '[{"problem":{"en":"Police verification adverse report"},"solution":{"en":"This is a legal-sensitive matter. Contact your nearest Passport Seva Kendra or regional Passport Office for specific guidance. We cannot advise on this."},"defer_to_official":true}]',
  'Source: passportindia.gov.in — needs human verification of current fee structure.',
  'needs_verification',
  ARRAY['passport','passport new','passport renewal','passport india','international travel','visa','travel document'],
  true
);

-- 17. Duplicate Driving Licence
INSERT INTO services (slug,name,category,tier,state,description,short_description,eligibility_rules,questions,required_documents,official_fee,steps,official_url,official_url_label,what_happens_after,troubleshooting,source_notes,verification_status,keywords,active)
VALUES(
  'duplicate-driving-licence',
  '{"en":"Duplicate Driving Licence","hi":"डुप्लीकेट ड्राइविंग लाइसेंस","kn":"ನಕಲಿ ಚಾಲನಾ ಪರವಾನಗಿ"}',
  'driving-transport',2,'karnataka',
  '{"en":"Apply for a duplicate Driving Licence if yours is lost, stolen, or damaged in Karnataka.","hi":"यदि आपका लाइसेंस खो गया है, चोरी हो गया है, या क्षतिग्रस्त हो गया है तो डुप्लीकेट ड्राइविंग लाइसेंस के लिए आवेदन करें।","kn":"ನಿಮ್ಮ ಪರವಾನಗಿ ಕಳೆದುಹೋದರೆ, ಕಳ್ಳತನವಾದರೆ ಅಥವಾ ಹಾಳಾದರೆ ನಕಲಿ ಚಾಲನಾ ಪರವಾನಗಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ."}',
  '{"en":"Get a replacement if your Driving Licence is lost or damaged.","hi":"खोया या क्षतिग्रस्त DL बदलवाएं।","kn":"ಕಳೆದುಹೋದ ಅಥವಾ ಹಾಳಾದ DL ಬದಲಿ ಪಡೆಯಿರಿ."}',
  '{"all":[{"field":"has_dl","operator":"equals","value":true,"message":"You must have had a Driving Licence previously to apply for a duplicate"}]}',
  '[{"id":"reason","type":"select","label":{"en":"Why do you need a duplicate?","hi":"आपको डुप्लीकेट की आवश्यकता क्यों है?","kn":"ನಿಮಗೆ ನಕಲು ಏಕೆ ಬೇಕು?"},"options":[{"value":"lost","label":{"en":"Lost","hi":"खो गया","kn":"ಕಳೆದಿದೆ"}},{"value":"stolen","label":{"en":"Stolen","hi":"चोरी","kn":"ಕಳ್ಳತನ"}},{"value":"damaged","label":{"en":"Damaged","hi":"क्षतिग्रस्त","kn":"ಹಾಳಾಗಿದೆ"}}],"required":true,"eligibility_relevant":false}]',
  '[{"id":"fir","name":{"en":"FIR / Police complaint (for lost/stolen)","hi":"एफआईआर / पुलिस शिकायत (खोने/चोरी के लिए)","kn":"FIR / ಪೊಲೀಸ್ ದೂರು (ಕಳೆದಿದ್ದರೆ/ಕಳ್ಳತನ)"},"status":"conditional","required_when":{"field":"reason","operator":"in","value":["lost","stolen"]}},{"id":"old_dl","name":{"en":"Damaged DL (for damaged case)","hi":"क्षतिग्रस्त DL (क्षति के मामले में)","kn":"ಹಾಳಾದ DL (ಹಾಳಾದ ಸಂದರ್ಭದಲ್ಲಿ)"},"status":"conditional","required_when":{"field":"reason","operator":"equals","value":"damaged"}},{"id":"address_proof","name":{"en":"Address Proof","hi":"पते का प्रमाण","kn":"ವಿಳಾಸ ಪುರಾವೆ"},"status":"required"},{"id":"photo","name":{"en":"Passport-size photograph","hi":"पासपोर्ट आकार की तस्वीर","kn":"ಪಾಸ್‌ಪೋರ್ಟ್ ಗಾತ್ರದ ಫೋಟೋ"},"status":"required"}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"Fee applies. Check Sarathi portal for current duplicate DL fee.","hi":"शुल्क लागू है।","kn":"ಶುಲ್ಕ ಅನ್ವಯಿಸುತ್ತದೆ."},"varies_by":null}',
  '[{"step_number":1,"title":{"en":"File FIR if lost or stolen"},"description":{"en":"Go to your nearest police station and file an FIR or complaint for the lost/stolen DL."},"is_online":false,"is_offline":true},{"step_number":2,"title":{"en":"Apply online on Sarathi Parivahan"},"description":{"en":"Visit sarathi.parivahan.gov.in → Karnataka → Duplicate DL."},"is_online":true,"is_offline":false},{"step_number":3,"title":{"en":"Upload documents and pay fee"},"description":{"en":"Upload FIR copy, address proof, photograph, and pay the fee."},"is_online":true,"is_offline":false},{"step_number":4,"title":{"en":"Receive duplicate DL"},"description":{"en":"Duplicate DL is dispatched to your address."},"is_online":false,"is_offline":true}]',
  'https://sarathi.parivahan.gov.in',
  '{"en":"Sarathi Parivahan — Official Driving Licence Portal","hi":"सारथी परिवहन — आधिकारिक ड्राइविंग लाइसेंस पोर्टल","kn":"ಸಾರಥಿ ಪರಿವಹನ — ಅಧಿಕೃತ ಚಾಲನಾ ಪರವಾನಗಿ ಪೋರ್ಟಲ್"}',
  '{"en":"After submission, the duplicate DL is processed and dispatched to your address.","hi":"सबमिशन के बाद, डुप्लीकेट DL प्रोसेस किया जाता है।","kn":"ಸಲ್ಲಿಕೆಯ ನಂತರ ನಕಲಿ DL ಪ್ರಕ್ರಿಯೆಗೊಳ್ಳುತ್ತದೆ."}',
  '[]',
  'Source: sarathi.parivahan.gov.in — needs human verification.',
  'needs_verification',
  ARRAY['duplicate dl','lost licence','stolen driving licence','duplicate driving licence','dl lost'],
  true
);

-- 18. Driving Licence — Address/Name Correction
INSERT INTO services (slug,name,category,tier,state,description,short_description,eligibility_rules,questions,required_documents,official_fee,steps,official_url,official_url_label,what_happens_after,troubleshooting,source_notes,verification_status,keywords,active)
VALUES(
  'dl-correction',
  '{"en":"Driving Licence — Address / Name Correction","hi":"ड्राइविंग लाइसेंस — पता / नाम सुधार","kn":"ಚಾಲನಾ ಪರವಾನಗಿ — ವಿಳಾಸ / ಹೆಸರು ತಿದ್ದುಪಡಿ"}',
  'driving-transport',2,'karnataka',
  '{"en":"Update your address or correct your name on your Karnataka Driving Licence.","hi":"कर्नाटक ड्राइविंग लाइसेंस पर पता अपडेट करें या नाम सुधारें।","kn":"ಕರ್ನಾಟಕ ಚಾಲನಾ ಪರವಾನಗಿಯಲ್ಲಿ ವಿಳಾಸ ಅಥವಾ ಹೆಸರು ತಿದ್ದಿಕೊಳ್ಳಿ."}',
  '{"en":"Update address or fix name on your Driving Licence.","hi":"DL में पता अपडेट करें या नाम सुधारें।","kn":"DL ನಲ್ಲಿ ವಿಳಾಸ ನವೀಕರಿಸಿ ಅಥವಾ ಹೆಸರು ತಿದ್ದಿಕೊಳ್ಳಿ."}',
  '{"all":[{"field":"has_dl","operator":"equals","value":true,"message":"You must have an existing DL to request a correction"}]}',
  '[{"id":"correction_type","type":"select","label":{"en":"What needs to be changed?","hi":"क्या बदलना है?","kn":"ಏನನ್ನು ಬದಲಾಯಿಸಬೇಕು?"},"options":[{"value":"address","label":{"en":"Address","hi":"पता","kn":"ವಿಳಾಸ"}},{"value":"name","label":{"en":"Name","hi":"नाम","kn":"ಹೆಸರು"}}],"required":true,"eligibility_relevant":false}]',
  '[{"id":"existing_dl","name":{"en":"Existing Driving Licence","hi":"मौजूदा ड्राइविंग लाइसेंस","kn":"ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಚಾಲನಾ ಪರವಾನಗಿ"},"status":"required"},{"id":"new_address_proof","name":{"en":"New Address Proof (for address change)","hi":"नए पते का प्रमाण (पता परिवर्तन के लिए)","kn":"ಹೊಸ ವಿಳಾಸ ಪುರಾವೆ (ವಿಳಾಸ ಬದಲಾವಣೆಗಾಗಿ)"},"status":"conditional","required_when":{"field":"correction_type","operator":"equals","value":"address"}},{"id":"name_proof","name":{"en":"Gazette notification / Marriage certificate (for name change)","hi":"राजपत्र अधिसूचना / विवाह प्रमाण पत्र (नाम परिवर्तन के लिए)","kn":"ಗೆಜೆಟ್ ಅಧಿಸೂಚನೆ / ಮದುವೆ ಪ್ರಮಾಣಪತ್ರ (ಹೆಸರು ಬದಲಾವಣೆಗಾಗಿ)"},"status":"conditional","required_when":{"field":"correction_type","operator":"equals","value":"name"}}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"Fee applies. Check Sarathi portal for current fee.","hi":"शुल्क लागू है।","kn":"ಶುಲ್ಕ ಅನ್ವಯಿಸುತ್ತದೆ."},"varies_by":"correction_type"}',
  '[{"step_number":1,"title":{"en":"Apply on Sarathi Parivahan"},"description":{"en":"Visit sarathi.parivahan.gov.in → Karnataka → Change of Address / Correction."},"is_online":true,"is_offline":false},{"step_number":2,"title":{"en":"Upload supporting document"},"description":{"en":"Upload proof of new address or name change document."},"is_online":true,"is_offline":false},{"step_number":3,"title":{"en":"Pay fee and submit"},"description":{"en":"Pay the applicable fee. Corrected DL is dispatched."},"is_online":true,"is_offline":false}]',
  'https://sarathi.parivahan.gov.in',
  '{"en":"Sarathi Parivahan — Official Driving Licence Portal","hi":"सारथी परिवहन — आधिकारिक ड्राइविंग लाइसेंस पोर्टल","kn":"ಸಾರಥಿ ಪರಿವಹನ — ಅಧಿಕೃತ ಚಾಲನಾ ಪರವಾನಗಿ ಪೋರ್ಟಲ್"}',
  '{"en":"Updated DL is dispatched to your new address after processing.","hi":"प्रोसेसिंग के बाद अपडेटेड DL आपके नए पते पर भेजा जाता है।","kn":"ಪ್ರಕ್ರಿಯೆಯ ನಂತರ ನವೀಕೃತ DL ನಿಮ್ಮ ಹೊಸ ವಿಳಾಸಕ್ಕೆ ರವಾನಿಸಲಾಗುತ್ತದೆ."}',
  '[]',
  'Source: sarathi.parivahan.gov.in — needs human verification.',
  'needs_verification',
  ARRAY['dl address change','driving licence address update','dl name change','driving licence correction'],
  true
);

-- 19. Legal Heir Certificate
INSERT INTO services (slug,name,category,tier,state,description,short_description,eligibility_rules,questions,required_documents,official_fee,steps,official_url,official_url_label,what_happens_after,troubleshooting,source_notes,verification_status,keywords,active)
VALUES(
  'legal-heir-certificate',
  '{"en":"Legal Heir Certificate","hi":"कानूनी उत्तराधिकारी प्रमाणपत्र","kn":"ಕಾನೂನು ವಾರಸುದಾರ ಪ್ರಮಾಣಪತ್ರ"}',
  'certificates',2,'karnataka',
  '{"en":"Obtain a Legal Heir Certificate from the Karnataka Revenue Department to establish legal heirs of a deceased person. Required for property transfer, insurance, pension, and government benefits.","hi":"मृतक के कानूनी उत्तराधिकारियों को स्थापित करने के लिए कर्नाटक राजस्व विभाग से कानूनी उत्तराधिकारी प्रमाणपत्र प्राप्त करें।","kn":"ಮೃತ ವ್ಯಕ್ತಿಯ ಕಾನೂನು ವಾರಸುದಾರರನ್ನು ಸ್ಥಾಪಿಸಲು ಕರ್ನಾಟಕ ಕಂದಾಯ ಇಲಾಖೆಯಿಂದ ಕಾನೂನು ವಾರಸುದಾರ ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ."}',
  '{"en":"Establish legal heirs of a deceased family member.","hi":"मृत परिवार के सदस्य के कानूनी उत्तराधिकारी स्थापित करें।","kn":"ಮೃತ ಕುಟುಂಬ ಸದಸ್ಯರ ಕಾನೂನು ವಾರಸುದಾರರನ್ನು ಸ್ಥಾಪಿಸಿ."}',
  null,
  '[{"id":"applicant_relation","type":"select","label":{"en":"What is your relationship to the deceased?","hi":"आपका मृतक से क्या संबंध है?","kn":"ಮೃತ ವ್ಯಕ್ತಿಯೊಂದಿಗೆ ನಿಮ್ಮ ಸಂಬಂಧ ಏನು?"},"options":[{"value":"spouse","label":{"en":"Spouse","hi":"जीवनसाथी","kn":"ಜೀವನಸಾಥಿ"}},{"value":"child","label":{"en":"Son / Daughter","hi":"बेटा / बेटी","kn":"ಮಗ / ಮಗಳು"}},{"value":"parent","label":{"en":"Parent","hi":"माता-पिता","kn":"ಪೋಷಕರು"}},{"value":"sibling","label":{"en":"Sibling","hi":"भाई-बहन","kn":"ಒಡಹುಟ್ಟಿದವರು"}}],"required":true,"eligibility_relevant":false}]',
  '[{"id":"death_cert","name":{"en":"Death Certificate of the deceased","hi":"मृतक का मृत्यु प्रमाणपत्र","kn":"ಮೃತ ವ್ಯಕ್ತಿಯ ಮರಣ ಪ್ರಮಾಣಪತ್ರ"},"status":"required"},{"id":"applicant_aadhaar","name":{"en":"Aadhaar of applicant and all heirs","hi":"आवेदक और सभी उत्तराधिकारियों का आधार","kn":"ಅರ್ಜಿದಾರ ಮತ್ತು ಎಲ್ಲ ವಾರಸುದಾರರ ಆಧಾರ್"},"status":"required"},{"id":"ration_card","name":{"en":"Ration Card showing family members","hi":"परिवार के सदस्यों को दर्शाने वाला राशन कार्ड","kn":"ಕುಟುಂಬ ಸದಸ್ಯರನ್ನು ತೋರಿಸುವ ಪಡಿತರ ಚೀಟಿ"},"status":"required"}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"Nominal fee. Verify on Seva Sindhu portal.","hi":"मामूली शुल्क।","kn":"ಸಾಮಾನ್ಯ ಶುಲ್ಕ."},"varies_by":null}',
  '[{"step_number":1,"title":{"en":"Apply on Karnataka Seva Sindhu / Nadakacheri"},"description":{"en":"Visit sevasindhu.karnataka.gov.in or nearest Nadakacheri."},"is_online":true,"is_offline":true},{"step_number":2,"title":{"en":"Fill the Legal Heir application"},"description":{"en":"Provide details of the deceased and all legal heirs."},"is_online":true,"is_offline":true},{"step_number":3,"title":{"en":"Upload documents and submit"},"description":{"en":"Upload death certificate, Aadhaar of all heirs, and ration card."},"is_online":true,"is_offline":true}]',
  'https://sevasindhu.karnataka.gov.in',
  '{"en":"Karnataka Seva Sindhu Portal","hi":"कर्नाटक सेवा सिंधु पोर्टल","kn":"ಕರ್ನಾಟಕ ಸೇವಾ ಸಿಂಧು ಪೋರ್ಟಲ್"}',
  '{"en":"The Revenue Inspector verifies family details. The Tahsildar issues the Legal Heir Certificate digitally.","hi":"राजस्व निरीक्षक परिवार के विवरण की जाँच करता है।","kn":"ಕಂದಾಯ ನಿರೀಕ್ಷಕ ಕುಟುಂಬ ವಿವರ ಪರಿಶೀಲಿಸುತ್ತಾರೆ."}',
  '[{"problem":{"en":"Dispute over who qualifies as legal heir"},"solution":{"en":"Legal heir disputes are legal matters. Government Work Helper cannot advise on this. Consult a lawyer or approach the civil court."},"defer_to_official":true}]',
  'Source: sevasindhu.karnataka.gov.in — needs human verification.',
  'needs_verification',
  ARRAY['legal heir','legal heir certificate','vaarasudara','inheritance','succession certificate','waris'],
  true
);

-- 20. Non-Creamy Layer Certificate
INSERT INTO services (slug,name,category,tier,state,description,short_description,eligibility_rules,questions,required_documents,official_fee,steps,official_url,official_url_label,what_happens_after,troubleshooting,source_notes,verification_status,keywords,active)
VALUES(
  'non-creamy-layer-certificate',
  '{"en":"Non-Creamy Layer Certificate","hi":"नॉन-क्रीमी लेयर प्रमाणपत्र","kn":"ನಾನ್-ಕ್ರೀಮಿ ಲೇಯರ್ ಪ್ರಮಾಣಪತ್ರ"}',
  'certificates',2,'karnataka',
  '{"en":"Obtain a Non-Creamy Layer (NCL) certificate from Karnataka Revenue Department for OBC category citizens. Proves that your family income is below the creamy layer threshold, required for OBC reservation benefits.","hi":"ओबीसी श्रेणी के नागरिकों के लिए कर्नाटक राजस्व विभाग से नॉन-क्रीमी लेयर प्रमाणपत्र प्राप्त करें।","kn":"OBC ವರ್ಗದ ನಾಗರಿಕರಿಗಾಗಿ ಕರ್ನಾಟಕ ಕಂದಾಯ ಇಲಾಖೆಯಿಂದ ನಾನ್-ಕ್ರೀಮಿ ಲೇಯರ್ ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ."}',
  '{"en":"Get NCL certificate to claim OBC reservation benefits.","hi":"ओबीसी आरक्षण लाभ के लिए NCL प्रमाणपत्र प्राप्त करें।","kn":"OBC ಮೀಸಲಾತಿ ಸೌಲಭ್ಯಕ್ಕಾಗಿ NCL ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ."}',
  null,
  '[{"id":"is_obc","type":"boolean","label":{"en":"Do you belong to the OBC category?","hi":"क्या आप ओबीसी श्रेणी से हैं?","kn":"ನೀವು OBC ವರ್ಗಕ್ಕೆ ಸೇರಿದ್ದೀರಾ?"},"required":true,"eligibility_relevant":true}]',
  '[{"id":"caste_cert","name":{"en":"OBC Caste Certificate","hi":"ओबीसी जाति प्रमाणपत्र","kn":"OBC ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ"},"status":"required"},{"id":"income_proof","name":{"en":"Income proof of parents / self","hi":"माता-पिता / स्वयं का आय प्रमाण","kn":"ಪೋಷಕರ / ಸ್ವಂತ ಆದಾಯ ಪ್ರಮಾಣ"},"status":"required"},{"id":"aadhaar","name":{"en":"Aadhaar Card","hi":"आधार कार्ड","kn":"ಆಧಾರ್ ಕಾರ್ಡ್"},"status":"required"}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"Nominal fee. Verify on Seva Sindhu portal.","hi":"मामूली शुल्क।","kn":"ಸಾಮಾನ್ಯ ಶುಲ್ಕ."},"varies_by":null}',
  '[{"step_number":1,"title":{"en":"Apply on Karnataka Seva Sindhu / Nadakacheri"},"description":{"en":"Visit sevasindhu.karnataka.gov.in or nearest Nadakacheri."},"is_online":true,"is_offline":true},{"step_number":2,"title":{"en":"Submit caste and income documents"},"description":{"en":"Upload OBC caste certificate and income proof."},"is_online":true,"is_offline":true},{"step_number":3,"title":{"en":"Receive NCL certificate"},"description":{"en":"Certificate issued after Tahsildar verification."},"is_online":true,"is_offline":true}]',
  'https://sevasindhu.karnataka.gov.in',
  '{"en":"Karnataka Seva Sindhu Portal","hi":"कर्नाटक सेवा सिंधु पोर्टल","kn":"ಕರ್ನಾಟಕ ಸೇವಾ ಸಿಂಧು ಪೋರ್ಟಲ್"}',
  '{"en":"Certificate issued digitally after verification. Valid typically for 1 year — renewal may be needed annually.","hi":"सत्यापन के बाद डिजिटल रूप से प्रमाणपत्र जारी किया जाता है।","kn":"ಪರಿಶೀಲನೆಯ ನಂತರ ಡಿಜಿಟಲ್ ಆಗಿ ಪ್ರಮಾಣಪತ್ರ ನೀಡಲಾಗುತ್ತದೆ."}',
  '[]',
  'Source: sevasindhu.karnataka.gov.in — needs human verification.',
  'needs_verification',
  ARRAY['non creamy layer','ncl certificate','obc certificate','creamy layer','obc reservation'],
  true
);

-- ============================================================
-- Seed: Tier 1 Services (1–10)
-- NOTE: All records marked needs_verification until a human
-- verifier confirms each field against official sources.
-- Official URLs are real Karnataka/India government portals.
-- Fees/steps marked as needs_verification where not confirmed.
-- ============================================================

-- 1. Aadhaar — New Enrollment
INSERT INTO services (
  slug, name, category, tier, state,
  description, short_description,
  eligibility_rules, questions, required_documents,
  official_fee, steps, official_url, official_url_label,
  what_happens_after, troubleshooting,
  source_notes, verification_status, keywords, active
) VALUES (
  'aadhaar-new-enrollment',
  '{"en":"Aadhaar — New Enrollment","hi":"आधार — नया नामांकन","kn":"ಆಧಾರ್ — ಹೊಸ ನೋಂದಣಿ"}',
  'identity-documents', 1, 'karnataka',
  '{"en":"Apply for a new Aadhaar card if you do not already have one. Aadhaar is a 12-digit unique identity number issued by UIDAI to all residents of India.","hi":"यदि आपके पास पहले से आधार नहीं है, तो नए आधार कार्ड के लिए आवेदन करें।","kn":"ನಿಮ್ಮ ಬಳಿ ಆಧಾರ್ ಇಲ್ಲದಿದ್ದರೆ ಹೊಸ ಆಧಾರ್ ಕಾರ್ಡ್‌ಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ."}',
  '{"en":"Get your Aadhaar number — India'\''s universal identity document.","hi":"अपना आधार नंबर प्राप्त करें।","kn":"ನಿಮ್ಮ ಆಧಾರ್ ಸಂಖ್ಯೆ ಪಡೆಯಿರಿ."}',
  '{"any":[{"field":"has_aadhaar","operator":"not_equals","value":true,"message":"You must not already have an Aadhaar to apply for a new one"}]}',
  '[{"id":"has_aadhaar","type":"boolean","label":{"en":"Do you already have an Aadhaar number?","hi":"क्या आपके पास पहले से आधार नंबर है?","kn":"ನಿಮ್ಮ ಬಳಿ ಈಗಾಗಲೇ ಆಧಾರ್ ಸಂಖ್ಯೆ ಇದೆಯೇ?"},"required":true,"eligibility_relevant":true}]',
  '[{"id":"poa","name":{"en":"Proof of Address","hi":"पते का प्रमाण","kn":"ವಿಳಾಸ ಪುರಾವೆ"},"status":"required","description":{"en":"Any one: Voter ID, Passport, Bank Passbook, Utility Bill (not older than 3 months)","hi":"इनमें से एक: वोटर आईडी, पासपोर्ट, बैंक पासबुक, उपयोगिता बिल (3 माह से पुराना नहीं)","kn":"ಯಾವುದಾದರೊಂದು: ಮತದಾರ ಚೀಟಿ, ಪಾಸ್‌ಪೋರ್ಟ್, ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್, ಯುಟಿಲಿಟಿ ಬಿಲ್"}},{"id":"poi","name":{"en":"Proof of Identity","hi":"पहचान का प्रमाण","kn":"ಗುರುತಿನ ಪುರಾವೆ"},"status":"required","description":{"en":"Any one: PAN card, Voter ID, Passport, Driving Licence","hi":"इनमें से एक: पैन कार्ड, वोटर आईडी, पासपोर्ट, ड्राइविंग लाइसेंस","kn":"ಯಾವುದಾದರೊಂದು: ಪ್ಯಾನ್ ಕಾರ್ಡ್, ಮತದಾರ ಚೀಟಿ, ಪಾಸ್‌ಪೋರ್ಟ್, ಚಾಲನಾ ಪರವಾನಗಿ"}}]',
  '{"amount":0,"currency":"INR","is_free":true,"notes":{"en":"Aadhaar enrollment is free of charge.","hi":"आधार नामांकन निःशुल्क है।","kn":"ಆಧಾರ್ ನೋಂದಣಿ ಉಚಿತ."},"varies_by":null}',
  '[{"step_number":1,"title":{"en":"Find your nearest Aadhaar Enrolment Centre"},"description":{"en":"Visit appointments.uidai.gov.in to locate the nearest centre and book an appointment if required."},"is_online":true,"is_offline":false},{"step_number":2,"title":{"en":"Carry your original documents"},"description":{"en":"Bring originals of all required documents — Proof of Identity and Proof of Address."},"is_online":false,"is_offline":true},{"step_number":3,"title":{"en":"Complete biometric capture at the centre"},"description":{"en":"Your fingerprints, iris scan, and photograph will be captured at the enrolment centre."},"is_online":false,"is_offline":true},{"step_number":4,"title":{"en":"Receive your Enrolment ID slip"},"description":{"en":"You will receive an acknowledgement slip with a 28-digit Enrolment ID. Keep this safe."},"is_online":false,"is_offline":true},{"step_number":5,"title":{"en":"Download or receive your Aadhaar"},"description":{"en":"After processing (typically 90 days), you can download your e-Aadhaar from uidai.gov.in or receive the physical card by post."},"is_online":true,"is_offline":false}]',
  'https://uidai.gov.in',
  '{"en":"Official UIDAI Portal","hi":"आधिकारिक UIDAI पोर्टल","kn":"ಅಧಿಕೃತ UIDAI ಪೋರ್ಟಲ್"}',
  '{"en":"After submitting at the enrolment centre, your biometric data is processed by UIDAI. You will receive an SMS on your registered mobile once your Aadhaar is generated. You can track status using your Enrolment ID on uidai.gov.in. Physical card is mailed to your address.","hi":"नामांकन केंद्र पर जमा करने के बाद, UIDAI आपके बायोमेट्रिक डेटा को प्रोसेस करता है।","kn":"ನೋಂದಣಿ ಕೇಂದ್ರದಲ್ಲಿ ಸಲ್ಲಿಸಿದ ನಂತರ UIDAI ನಿಮ್ಮ ಡೇಟಾ ಪ್ರಕ್ರಿಯೆ ಮಾಡುತ್ತದೆ."}',
  '[{"problem":{"en":"Enrolment centre says documents are not sufficient"},"solution":{"en":"Check the full list of acceptable documents on uidai.gov.in. Bring originals, not photocopies."},"defer_to_official":false},{"problem":{"en":"Status not updating after 90 days"},"solution":{"en":"Check status on uidai.gov.in using your Enrolment ID. If still pending, raise a complaint through the UIDAI grievance portal."},"defer_to_official":true}]',
  'Source: uidai.gov.in — needs human verification of current document list and processing timelines.',
  'needs_verification',
  ARRAY['aadhaar','aadhar','uid','unique identification','biometric','enrollment','enrolment','uidai','identity'],
  true
);

-- 2. Aadhaar — Update
INSERT INTO services (
  slug, name, category, tier, state,
  description, short_description,
  eligibility_rules, questions, required_documents,
  official_fee, steps, official_url, official_url_label,
  what_happens_after, troubleshooting,
  source_notes, verification_status, keywords, active
) VALUES (
  'aadhaar-update',
  '{"en":"Aadhaar — Update (Name/Address/Mobile/DOB)","hi":"आधार — अपडेट","kn":"ಆಧಾರ್ — ನವೀಕರಣ"}',
  'identity-documents', 1, 'karnataka',
  '{"en":"Update your existing Aadhaar details — name, address, mobile number, date of birth, email, or biometrics.","hi":"अपने मौजूदा आधार विवरण को अपडेट करें।","kn":"ನಿಮ್ಮ ಆಧಾರ್ ವಿವರಗಳನ್ನು ನವೀಕರಿಸಿ."}',
  '{"en":"Change your name, address, mobile, or other Aadhaar details.","hi":"आधार में नाम, पता, मोबाइल अपडेट करें।","kn":"ಆಧಾರ್‌ನಲ್ಲಿ ಹೆಸರು, ವಿಳಾಸ, ಮೊಬೈಲ್ ಬದಲಾಯಿಸಿ."}',
  '{"all":[{"field":"has_aadhaar","operator":"equals","value":true,"message":"You must have an existing Aadhaar number to request an update"}]}',
  '[{"id":"has_aadhaar","type":"boolean","label":{"en":"Do you have an existing Aadhaar number?","hi":"क्या आपके पास आधार नंबर है?","kn":"ನಿಮ್ಮ ಬಳಿ ಆಧಾರ್ ಸಂಖ್ಯೆ ಇದೆಯೇ?"},"required":true,"eligibility_relevant":true},{"id":"update_type","type":"select","label":{"en":"What do you want to update?","hi":"आप क्या अपडेट करना चाहते हैं?","kn":"ನೀವು ಏನನ್ನು ನವೀಕರಿಸಲು ಬಯಸುತ್ತೀರಿ?"},"options":[{"value":"address","label":{"en":"Address","hi":"पता","kn":"ವಿಳಾಸ"}},{"value":"name","label":{"en":"Name","hi":"नाम","kn":"ಹೆಸರು"}},{"value":"mobile","label":{"en":"Mobile Number","hi":"मोबाइल नंबर","kn":"ಮೊಬೈಲ್ ಸಂಖ್ಯೆ"}},{"value":"dob","label":{"en":"Date of Birth","hi":"जन्म तिथि","kn":"ಜನ್ಮ ದಿನಾಂಕ"}},{"value":"biometric","label":{"en":"Biometrics","hi":"बायोमेट्रिक्स","kn":"ಬಯೋಮೆಟ್ರಿಕ್ಸ್"}}],"required":true,"eligibility_relevant":false}]',
  '[{"id":"supporting_doc","name":{"en":"Supporting document for the field being updated","hi":"अपडेट किए जाने वाले फ़ील्ड का समर्थन दस्तावेज़","kn":"ನವೀಕರಿಸಲಾಗುವ ಕ್ಷೇತ್ರದ ಬೆಂಬಲ ದಾಖಲೆ"},"status":"required","description":{"en":"Proof of Address (for address update), Gazette notification or school certificate (for name update), Birth certificate (for DOB update)","hi":"पते के अपडेट के लिए पते का प्रमाण, नाम अपडेट के लिए राजपत्र अधिसूचना या स्कूल प्रमाण पत्र","kn":"ವಿಳಾಸ ನವೀಕರಣಕ್ಕೆ ವಿಳಾಸ ಪುರಾವೆ, ಹೆಸರು ನವೀಕರಣಕ್ಕೆ ಗೆಜೆಟ್ ಅಧಿಸೂಚನೆ"}}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"Fee applies for some update types (e.g., biometric update). Check the official portal for current fee. Address update online may be free.","hi":"कुछ अपडेट प्रकारों के लिए शुल्क लागू होता है।","kn":"ಕೆಲವು ನವೀಕರಣ ಪ್ರಕಾರಗಳಿಗೆ ಶುಲ್ಕ ಅನ್ವಯಿಸುತ್ತದೆ."},"varies_by":"update_type"}',
  '[{"step_number":1,"title":{"en":"Go to myAadhaar portal"},"description":{"en":"Visit myaadhaar.uidai.gov.in and log in with your Aadhaar number and OTP."},"is_online":true,"is_offline":false},{"step_number":2,"title":{"en":"Select the field to update"},"description":{"en":"Choose the detail you want to change — address, name, mobile, DOB, or biometrics."},"is_online":true,"is_offline":false},{"step_number":3,"title":{"en":"Upload supporting document"},"description":{"en":"Upload a scanned copy of the supporting document relevant to the update."},"is_online":true,"is_offline":false},{"step_number":4,"title":{"en":"Submit and note your URN"},"description":{"en":"Submit the request. You will receive an Update Request Number (URN). Use this to track your request."},"is_online":true,"is_offline":false}]',
  'https://myaadhaar.uidai.gov.in',
  '{"en":"myAadhaar Official Portal","hi":"माईआधार आधिकारिक पोर्टल","kn":"myAadhaar ಅಧಿಕೃತ ಪೋರ್ಟಲ್"}',
  '{"en":"After submission, UIDAI processes the update request. You will receive an SMS when the update is complete. You can track the status using your URN on uidai.gov.in.","hi":"सबमिशन के बाद, UIDAI अपडेट अनुरोध को प्रोसेस करता है।","kn":"ಸಲ್ಲಿಸಿದ ನಂತರ UIDAI ನವೀಕರಣ ವಿನಂತಿಯನ್ನು ಪ್ರಕ್ರಿಯೆ ಮಾಡುತ್ತದೆ."}',
  '[{"problem":{"en":"Update request rejected"},"solution":{"en":"Check the rejection reason in your myAadhaar account. Ensure your supporting document clearly shows the updated information and is from an accepted list."},"defer_to_official":false},{"problem":{"en":"Cannot receive OTP on registered mobile"},"solution":{"en":"For mobile number update, you must visit an Aadhaar Enrolment Centre in person as online update requires OTP on the old number."},"defer_to_official":true}]',
  'Source: uidai.gov.in / myaadhaar.uidai.gov.in — needs human verification.',
  'needs_verification',
  ARRAY['aadhaar update','aadhar update','aadhaar address change','aadhaar name change','aadhaar correction','uidai update'],
  true
);

-- 3. PAN Card — New Application
INSERT INTO services (
  slug, name, category, tier, state,
  description, short_description,
  eligibility_rules, questions, required_documents,
  official_fee, steps, official_url, official_url_label,
  what_happens_after, troubleshooting,
  source_notes, verification_status, keywords, active
) VALUES (
  'pan-card-new',
  '{"en":"PAN Card — New Application","hi":"पैन कार्ड — नया आवेदन","kn":"ಪ್ಯಾನ್ ಕಾರ್ಡ್ — ಹೊಸ ಅರ್ಜಿ"}',
  'identity-documents', 1, 'karnataka',
  '{"en":"Apply for a new Permanent Account Number (PAN) card issued by the Income Tax Department of India. Required for financial transactions, filing taxes, and more.","hi":"आयकर विभाग द्वारा जारी नया पैन कार्ड प्राप्त करें।","kn":"ಆದಾಯ ತೆರಿಗೆ ಇಲಾಖೆಯಿಂದ ಹೊಸ ಶಾಶ್ವತ ಖಾತೆ ಸಂಖ್ಯೆ (ಪ್ಯಾನ್) ಕಾರ್ಡ್ ಪಡೆಯಿರಿ."}',
  '{"en":"Get your PAN card — essential for taxes, banking, and financial transactions.","hi":"अपना पैन कार्ड प्राप्त करें।","kn":"ನಿಮ್ಮ ಪ್ಯಾನ್ ಕಾರ್ಡ್ ಪಡೆಯಿರಿ."}',
  '{"any":[{"field":"has_pan","operator":"not_equals","value":true,"message":"You must not already have a PAN card"}]}',
  '[{"id":"has_pan","type":"boolean","label":{"en":"Do you already have a PAN card?","hi":"क्या आपके पास पहले से पैन कार्ड है?","kn":"ನಿಮ್ಮ ಬಳಿ ಈಗಾಗಲೇ ಪ್ಯಾನ್ ಕಾರ್ಡ್ ಇದೆಯೇ?"},"required":true,"eligibility_relevant":true},{"id":"applicant_type","type":"select","label":{"en":"Are you applying as an Individual or for a business?","hi":"क्या आप व्यक्तिगत या व्यापार के लिए आवेदन कर रहे हैं?","kn":"ನೀವು ವ್ಯಕ್ತಿಯಾಗಿ ಅಥವಾ ವ್ಯಾಪಾರಕ್ಕಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸುತ್ತಿದ್ದೀರಾ?"},"options":[{"value":"individual","label":{"en":"Individual","hi":"व्यक्तिगत","kn":"ವ್ಯಕ್ತಿ"}},{"value":"company","label":{"en":"Company/HUF/Others","hi":"कंपनी/एचयूएफ/अन्य","kn":"ಕಂಪನಿ/HUF/ಇತರರು"}}],"required":true,"eligibility_relevant":false}]',
  '[{"id":"poi","name":{"en":"Proof of Identity","hi":"पहचान का प्रमाण","kn":"ಗುರುತಿನ ಪುರಾವೆ"},"status":"required","description":{"en":"Aadhaar / Voter ID / Passport / Driving Licence","hi":"आधार / वोटर आईडी / पासपोर्ट / ड्राइविंग लाइसेंस","kn":"ಆಧಾರ್ / ಮತದಾರ ಚೀಟಿ / ಪಾಸ್‌ಪೋರ್ಟ್ / ಚಾಲನಾ ಪರವಾನಗಿ"}},{"id":"poa","name":{"en":"Proof of Address","hi":"पते का प्रमाण","kn":"ವಿಳಾಸ ಪುರಾವೆ"},"status":"required"},{"id":"pob","name":{"en":"Proof of Date of Birth","hi":"जन्म तिथि का प्रमाण","kn":"ಜನ್ಮ ದಿನಾಂಕ ಪುರಾವೆ"},"status":"required","description":{"en":"Birth certificate, Aadhaar, Matriculation certificate, or Passport","hi":"जन्म प्रमाण पत्र, आधार, मैट्रिकुलेशन प्रमाण पत्र, या पासपोर्ट"}},{"id":"photo","name":{"en":"Two recent passport-size photographs","hi":"दो हालिया पासपोर्ट आकार की तस्वीरें","kn":"ಎರಡು ಇತ್ತೀಚಿನ ಪಾಸ್‌ಪೋರ್ಟ್ ಗಾತ್ರದ ಫೋಟೋಗಳು"},"status":"required"}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"Fee varies. Check the official NSDL/UTIITSL portal for the current application fee (physical delivery) and Instant e-PAN fee (free for Aadhaar holders).","hi":"शुल्क भिन्न होता है। कृपया आधिकारिक पोर्टल पर जाँचें।","kn":"ಶುಲ್ಕ ಬದಲಾಗುತ್ತದೆ. ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಪರಿಶೀಲಿಸಿ."},"varies_by":"delivery_type"}',
  '[{"step_number":1,"title":{"en":"Choose application route"},"description":{"en":"Option A: Instant e-PAN via Income Tax portal (free, requires Aadhaar). Option B: Physical PAN via NSDL or UTIITSL (fee applicable)."},"is_online":true,"is_offline":false},{"step_number":2,"title":{"en":"Fill the online application form"},"description":{"en":"Fill Form 49A on the portal. Provide your name exactly as on your identity document."},"is_online":true,"is_offline":false},{"step_number":3,"title":{"en":"Upload documents"},"description":{"en":"Upload scanned copies of identity, address, and date of birth proof, plus photograph."},"is_online":true,"is_offline":false},{"step_number":4,"title":{"en":"Pay the fee"},"description":{"en":"Pay the application fee online. Keep the acknowledgement number."},"is_online":true,"is_offline":false},{"step_number":5,"title":{"en":"Receive your PAN"},"description":{"en":"e-PAN is emailed. Physical PAN card is mailed to the address provided within 15 working days (approximate)."},"is_online":true,"is_offline":false}]',
  'https://www.incometax.gov.in/iec/foportal',
  '{"en":"Income Tax e-Filing Portal","hi":"आयकर ई-फाइलिंग पोर्टल","kn":"ಆದಾಯ ತೆರಿಗೆ ಇ-ಫೈಲಿಂಗ್ ಪೋರ್ಟಲ್"}',
  '{"en":"After submission, your application is processed by NSDL/UTIITSL. You can track status using your acknowledgement number. e-PAN is generated quickly; physical card is dispatched by post.","hi":"सबमिशन के बाद NSDL/UTIITSL आपके आवेदन को प्रोसेस करता है।","kn":"ಸಲ್ಲಿಸಿದ ನಂತರ NSDL/UTIITSL ನಿಮ್ಮ ಅರ್ಜಿ ಪ್ರಕ್ರಿಯೆ ಮಾಡುತ್ತದೆ."}',
  '[{"problem":{"en":"Application rejected due to name mismatch"},"solution":{"en":"Ensure the name on your application exactly matches your identity document. Reapply with consistent documents."},"defer_to_official":false},{"problem":{"en":"PAN card not received"},"solution":{"en":"Track your application on the NSDL portal using your acknowledgement number. If dispatched and not received, raise a complaint."},"defer_to_official":true}]',
  'Source: incometax.gov.in, nsdl.co.in — needs human verification of current fees.',
  'needs_verification',
  ARRAY['pan','pan card','permanent account number','income tax','pan application','pan new'],
  true
);

-- 4. PAN Card — Correction/Update
INSERT INTO services (
  slug, name, category, tier, state,
  description, short_description,
  eligibility_rules, questions, required_documents,
  official_fee, steps, official_url, official_url_label,
  what_happens_after, troubleshooting,
  source_notes, verification_status, keywords, active
) VALUES (
  'pan-card-correction',
  '{"en":"PAN Card — Correction / Update","hi":"पैन कार्ड — सुधार / अपडेट","kn":"ಪ್ಯಾನ್ ಕಾರ್ಡ್ — ತಿದ್ದುಪಡಿ"}',
  'identity-documents', 1, 'karnataka',
  '{"en":"Correct or update details on your existing PAN card — name, date of birth, address, photograph, or signature.","hi":"अपने मौजूदा पैन कार्ड पर विवरण सुधारें या अपडेट करें।","kn":"ನಿಮ್ಮ ಪ್ಯಾನ್ ಕಾರ್ಡ್‌ನಲ್ಲಿ ವಿವರ ತಿದ್ದಿಕೊಳ್ಳಿ."}',
  '{"en":"Fix errors on your PAN card — name, date of birth, or address.","hi":"पैन कार्ड में गलती सुधारें।","kn":"ಪ್ಯಾನ್ ಕಾರ್ಡ್‌ನ ದೋಷ ಸರಿಪಡಿಸಿ."}',
  '{"all":[{"field":"has_pan","operator":"equals","value":true,"message":"You must have an existing PAN card to request a correction"}]}',
  '[{"id":"has_pan","type":"boolean","label":{"en":"Do you have an existing PAN card?","hi":"क्या आपके पास पैन कार्ड है?","kn":"ನಿಮ್ಮ ಬಳಿ ಪ್ಯಾನ್ ಕಾರ್ಡ್ ಇದೆಯೇ?"},"required":true,"eligibility_relevant":true},{"id":"correction_type","type":"select","label":{"en":"What needs to be corrected?","hi":"क्या सुधारना है?","kn":"ಏನನ್ನು ಸರಿಪಡಿಸಬೇಕು?"},"options":[{"value":"name","label":{"en":"Name","hi":"नाम","kn":"ಹೆಸರು"}},{"value":"dob","label":{"en":"Date of Birth","hi":"जन्म तिथि","kn":"ಜನ್ಮ ದಿನಾಂಕ"}},{"value":"address","label":{"en":"Address","hi":"पता","kn":"ವಿಳಾಸ"}},{"value":"photo_signature","label":{"en":"Photo / Signature","hi":"फोटो / हस्ताक्षर","kn":"ಫೋಟೋ / ಸಹಿ"}}],"required":true,"eligibility_relevant":false}]',
  '[{"id":"existing_pan","name":{"en":"Existing PAN card copy","hi":"मौजूदा पैन कार्ड की प्रति","kn":"ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಪ್ಯಾನ್ ಕಾರ್ಡ್ ಪ್ರತಿ"},"status":"required"},{"id":"correction_proof","name":{"en":"Document supporting the correction","hi":"सुधार का समर्थन करने वाला दस्तावेज़","kn":"ತಿದ್ದುಪಡಿ ಬೆಂಬಲಿಸುವ ದಾಖಲೆ"},"status":"required","description":{"en":"e.g., Gazette notification for name change, Birth certificate for DOB correction","hi":"जैसे नाम बदलने के लिए राजपत्र अधिसूचना, जन्म तिथि सुधार के लिए जन्म प्रमाण पत्र"}}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"Fee applies. Check NSDL or UTIITSL portal for current fees.","hi":"शुल्क लागू है। कृपया पोर्टल पर जाँचें।","kn":"ಶುಲ್ಕ ಅನ್ವಯಿಸುತ್ತದೆ. ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಪರಿಶೀಲಿಸಿ."},"varies_by":null}',
  '[{"step_number":1,"title":{"en":"Visit NSDL or UTIITSL portal"},"description":{"en":"Go to tin.tin.nsdl.com or utiitsl.com to apply for PAN correction (Form 49A for changes)."},"is_online":true,"is_offline":false},{"step_number":2,"title":{"en":"Fill the correction form"},"description":{"en":"Select ''Correction in PAN data''. Enter your existing PAN number and fill in the fields to be corrected."},"is_online":true,"is_offline":false},{"step_number":3,"title":{"en":"Upload supporting documents"},"description":{"en":"Upload scanned proof of the correction (e.g., gazette for name change)."},"is_online":true,"is_offline":false},{"step_number":4,"title":{"en":"Pay and submit"},"description":{"en":"Pay the applicable fee and submit. Keep the acknowledgement number."},"is_online":true,"is_offline":false}]',
  'https://tin.tin.nsdl.com/pan',
  '{"en":"NSDL PAN Portal","hi":"NSDL पैन पोर्टल","kn":"NSDL ಪ್ಯಾನ್ ಪೋರ್ಟಲ್"}',
  '{"en":"After submission, the correction is processed. Updated PAN card is dispatched by post. Track using your acknowledgement number.","hi":"सबमिशन के बाद, सुधार संसाधित किया जाता है।","kn":"ಸಲ್ಲಿಸಿದ ನಂತರ ತಿದ್ದುಪಡಿ ಪ್ರಕ್ರಿಯೆಗೊಳ್ಳುತ್ತದೆ."}',
  '[{"problem":{"en":"Correction rejected"},"solution":{"en":"Review the rejection reason. Ensure the supporting document matches the correction requested exactly."},"defer_to_official":false}]',
  'Source: tin.tin.nsdl.com — needs human verification.',
  'needs_verification',
  ARRAY['pan correction','pan update','pan name change','pan card error','pan card fix'],
  true
);

-- 5. Learner''s Licence
INSERT INTO services (
  slug, name, category, tier, state,
  description, short_description,
  eligibility_rules, questions, required_documents,
  official_fee, steps, official_url, official_url_label,
  what_happens_after, troubleshooting,
  source_notes, verification_status, keywords, active
) VALUES (
  'learners-licence',
  '{"en":"Learner'\''s Licence","hi":"लर्नर लाइसेंस","kn":"ಕಲಿಕಾ ಪರವಾನಗಿ"}',
  'driving-transport', 1, 'karnataka',
  '{"en":"Apply for a Learner'\''s Licence — the first step before getting a permanent driving licence in Karnataka. Required before you can legally learn to drive on public roads.","hi":"कर्नाटक में स्थायी ड्राइविंग लाइसेंस से पहले लर्नर लाइसेंस के लिए आवेदन करें।","kn":"ಕರ್ನಾಟಕದಲ್ಲಿ ಕಾಯಂ ಚಾಲನಾ ಪರವಾನಗಿ ಪಡೆಯುವ ಮೊದಲ ಹೆಜ್ಜೆ."}',
  '{"en":"Get your Learner'\''s Licence to legally learn to drive.","hi":"कानूनी रूप से गाड़ी चलाना सीखने के लिए लर्नर लाइसेंस लें।","kn":"ಕಾನೂನುಬದ್ಧವಾಗಿ ವಾಹನ ಓಡಿಸಲು ಕಲಿಕಾ ಪರವಾನಗಿ ಪಡೆಯಿರಿ."}',
  '{"all":[{"field":"age_bracket","operator":"not_in","value":["under_18"],"message":"You must be at least 16 years old for a two-wheeler LL or 18 for a four-wheeler LL"}]}',
  '[{"id":"vehicle_type","type":"select","label":{"en":"What type of vehicle do you want to learn to drive?","hi":"आप किस प्रकार का वाहन चलाना सीखना चाहते हैं?","kn":"ನೀವು ಯಾವ ರೀತಿಯ ವಾಹನ ಓಡಿಸಲು ಕಲಿಯಲು ಬಯಸುತ್ತೀರಿ?"},"options":[{"value":"2w_ng","label":{"en":"Two-wheeler (without gear)","hi":"दोपहिया (बिना गियर)","kn":"ದ್ವಿಚಕ್ರ ವಾಹನ (ಗೇರ್ ಇಲ್ಲದೆ)"}},{"value":"2w_g","label":{"en":"Two-wheeler (with gear)","hi":"दोपहिया (गियर के साथ)","kn":"ದ್ವಿಚಕ್ರ ವಾಹನ (ಗೇರ್ ಸಹಿತ)"}},{"value":"4w","label":{"en":"Four-wheeler (LMV)","hi":"चार पहिया (एलएमवी)","kn":"ನಾಲ್ಕು ಚಕ್ರ ವಾಹನ (LMV)"}}],"required":true,"eligibility_relevant":true}]',
  '[{"id":"age_proof","name":{"en":"Age Proof","hi":"आयु प्रमाण","kn":"ವಯಸ್ಸಿನ ಪುರಾವೆ"},"status":"required","description":{"en":"Aadhaar / Birth Certificate / Passport / SSLC Marks Card","hi":"आधार / जन्म प्रमाण पत्र / पासपोर्ट / एसएसएलसी मार्क्स कार्ड"}},{"id":"address_proof","name":{"en":"Address Proof","hi":"पते का प्रमाण","kn":"ವಿಳಾಸ ಪುರಾವೆ"},"status":"required"},{"id":"photo","name":{"en":"Passport-size photograph","hi":"पासपोर्ट आकार की तस्वीर","kn":"ಪಾಸ್‌ಪೋರ್ಟ್ ಗಾತ್ರದ ಫೋಟೋ"},"status":"required"},{"id":"form1","name":{"en":"Form 1 — Application cum Declaration (Medical)","hi":"फॉर्म 1 — आवेदन सह घोषणा (चिकित्सा)","kn":"ಫಾರ್ಮ್ 1 — ಅರ್ಜಿ ಸಹ ಘೋಷಣೆ"},"status":"required"}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"Fee varies by vehicle class. Check Sarathi portal for current Karnataka LL fee schedule.","hi":"शुल्क वाहन वर्ग के अनुसार अलग-अलग होता है।","kn":"ಶುಲ್ಕ ವಾಹನ ವರ್ಗವಾರು ಬೇರೆಯಾಗಿರುತ್ತದೆ."},"varies_by":"vehicle_type"}',
  '[{"step_number":1,"title":{"en":"Apply online on Sarathi Parivahan"},"description":{"en":"Visit sarathi.parivahan.gov.in, select Karnataka, choose Learner'\''s Licence application."},"is_online":true,"is_offline":false},{"step_number":2,"title":{"en":"Fill in application details"},"description":{"en":"Provide personal details, select vehicle class, upload photograph and address/age proof."},"is_online":true,"is_offline":false},{"step_number":3,"title":{"en":"Pay the fee online"},"description":{"en":"Pay the applicable fee and book your LL test slot."},"is_online":true,"is_offline":false},{"step_number":4,"title":{"en":"Appear for the computer-based LL test at RTO"},"description":{"en":"Visit your selected RTO on the appointment date. Pass the road rules test (typically 9/15 questions to pass)."},"is_online":false,"is_offline":true},{"step_number":5,"title":{"en":"Receive your Learner'\''s Licence"},"description":{"en":"On passing, your LL is issued. It is valid for 6 months, during which you must apply for a permanent DL."},"is_online":false,"is_offline":true}]',
  'https://sarathi.parivahan.gov.in',
  '{"en":"Sarathi Parivahan — Official Driving Licence Portal","hi":"सारथी परिवहन — आधिकारिक ड्राइविंग लाइसेंस पोर्टल","kn":"ಸಾರಥಿ ಪರಿವಹನ — ಅಧಿಕೃತ ಚಾಲನಾ ಪರವಾನಗಿ ಪೋರ್ಟಲ್"}',
  '{"en":"After passing the test, your Learner'\''s Licence is issued immediately. It is valid for 6 months. You must hold the LL for at least 30 days before applying for a permanent DL.","hi":"परीक्षा पास करने के बाद, लर्नर लाइसेंस तुरंत जारी किया जाता है।","kn":"ಪರೀಕ್ಷೆ ಪಾಸ್ ಆದ ನಂತರ, ಕಲಿಕಾ ಪರವಾನಗಿ ತಕ್ಷಣ ನೀಡಲಾಗುತ್ತದೆ."}',
  '[{"problem":{"en":"Failed the LL test"},"solution":{"en":"You can re-appear for the test after 7 days. Study the Karnataka road rules handbook available on the Sarathi portal before retaking."},"defer_to_official":false}]',
  'Source: sarathi.parivahan.gov.in — needs human verification of current fee schedule.',
  'needs_verification',
  ARRAY['learner licence','learner license','ll','learning licence','driving test','rto karnataka','sarathi'],
  true
);

-- 6. Permanent Driving Licence
INSERT INTO services (
  slug, name, category, tier, state,
  description, short_description,
  eligibility_rules, questions, required_documents,
  official_fee, steps, official_url, official_url_label,
  what_happens_after, troubleshooting,
  source_notes, verification_status, keywords, active
) VALUES (
  'permanent-driving-licence',
  '{"en":"Permanent Driving Licence","hi":"स्थायी ड्राइविंग लाइसेंस","kn":"ಕಾಯಂ ಚಾಲನಾ ಪರವಾನಗಿ"}',
  'driving-transport', 1, 'karnataka',
  '{"en":"Apply for a Permanent Driving Licence after holding a valid Learner'\''s Licence for at least 30 days in Karnataka.","hi":"कर्नाटक में कम से कम 30 दिन वैध लर्नर लाइसेंस रखने के बाद स्थायी ड्राइविंग लाइसेंस के लिए आवेदन करें।","kn":"ಕಾಯಂ ಚಾಲನಾ ಪರವಾನಗಿಗಾಗಿ ಕನಿಷ್ಠ 30 ದಿನ ಕಲಿಕಾ ಪರವಾನಗಿ ಇರಿಸಿದ ನಂತರ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ."}',
  '{"en":"Get your full Driving Licence after your Learner'\''s period.","hi":"अपना स्थायी ड्राइविंग लाइसेंस प्राप्त करें।","kn":"ನಿಮ್ಮ ಪರ್ಮನೆಂಟ್ ಚಾಲನಾ ಪರವಾನಗಿ ಪಡೆಯಿರಿ."}',
  '{"all":[{"field":"has_learner_licence","operator":"equals","value":true,"message":"You must hold a valid Learner'\''s Licence"},{"field":"ll_days_held","operator":"greater_than_or_equal","value":30,"message":"You must have held your Learner'\''s Licence for at least 30 days"}]}',
  '[{"id":"has_learner_licence","type":"boolean","label":{"en":"Do you have a valid Learner'\''s Licence?","hi":"क्या आपके पास वैध लर्नर लाइसेंस है?","kn":"ನಿಮ್ಮ ಬಳಿ ಮಾನ್ಯ ಕಲಿಕಾ ಪರವಾನಗಿ ಇದೆಯೇ?"},"required":true,"eligibility_relevant":true},{"id":"ll_days_held","type":"number","label":{"en":"How many days ago did you get your Learner'\''s Licence?","hi":"आपको लर्नर लाइसेंस कितने दिन पहले मिला था?","kn":"ನಿಮಗೆ ಕಲಿಕಾ ಪರವಾನಗಿ ಎಷ್ಟು ದಿನಗಳ ಹಿಂದೆ ಸಿಕ್ಕಿತು?"},"required":true,"eligibility_relevant":true}]',
  '[{"id":"ll_copy","name":{"en":"Learner'\''s Licence copy","hi":"लर्नर लाइसेंस की प्रति","kn":"ಕಲಿಕಾ ಪರವಾನಗಿ ಪ್ರತಿ"},"status":"required"},{"id":"age_proof","name":{"en":"Age Proof","hi":"आयु प्रमाण","kn":"ವಯಸ್ಸಿನ ಪುರಾವೆ"},"status":"required"},{"id":"address_proof","name":{"en":"Address Proof","hi":"पते का प्रमाण","kn":"ವಿಳಾಸ ಪುರಾವೆ"},"status":"required"},{"id":"photo","name":{"en":"Passport-size photograph","hi":"पासपोर्ट आकार की तस्वीर","kn":"ಪಾಸ್‌ಪೋರ್ಟ್ ಗಾತ್ರದ ಫೋಟೋ"},"status":"required"},{"id":"form1a","name":{"en":"Form 1A — Medical Certificate (if over 40)","hi":"फॉर्म 1ए — चिकित्सा प्रमाण पत्र (40 से ऊपर)","kn":"ಫಾರ್ಮ್ 1A — ವೈದ್ಯಕೀಯ ಪ್ರಮಾಣಪತ್ರ (40ರ ಮೇಲೆ)"},"status":"conditional","required_when":{"field":"age_bracket","operator":"in","value":["51_60","60_plus"]}}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"Fee varies by vehicle class. Check Sarathi portal for current DL fee schedule.","hi":"शुल्क वाहन वर्ग के अनुसार अलग-अलग होता है।","kn":"ಶುಲ್ಕ ವಾಹನ ವರ್ಗವಾರು ಬೇರೆಯಾಗಿರುತ್ತದೆ."},"varies_by":"vehicle_type"}',
  '[{"step_number":1,"title":{"en":"Apply online on Sarathi Parivahan"},"description":{"en":"Visit sarathi.parivahan.gov.in, select Karnataka, and choose Permanent DL application."},"is_online":true,"is_offline":false},{"step_number":2,"title":{"en":"Book a driving test slot"},"description":{"en":"Select your RTO, pick an available slot for the driving skill test."},"is_online":true,"is_offline":false},{"step_number":3,"title":{"en":"Pay the fee"},"description":{"en":"Pay the DL application fee online."},"is_online":true,"is_offline":false},{"step_number":4,"title":{"en":"Appear for the driving test at RTO"},"description":{"en":"Visit the RTO with your original documents. Demonstrate your driving skills."},"is_online":false,"is_offline":true},{"step_number":5,"title":{"en":"Collect your Driving Licence"},"description":{"en":"On passing, your DL is either issued on the spot (smart card) or dispatched by post."},"is_online":false,"is_offline":true}]',
  'https://sarathi.parivahan.gov.in',
  '{"en":"Sarathi Parivahan — Official Driving Licence Portal","hi":"सारथी परिवहन — आधिकारिक ड्राइविंग लाइसेंस पोर्टल","kn":"ಸಾರಥಿ ಪರಿವಹನ — ಅಧಿಕೃತ ಚಾಲನಾ ಪರವಾನಗಿ ಪೋರ್ಟಲ್"}',
  '{"en":"After passing the driving test, your DL is issued. The smart card DL may take a few weeks to be dispatched to your address if not issued on the spot.","hi":"ड्राइविंग टेस्ट पास करने के बाद, आपका DL जारी किया जाता है।","kn":"ಚಾಲನಾ ಪರೀಕ್ಷೆ ಪಾಸ್ ಆದ ನಂತರ ನಿಮ್ಮ DL ನೀಡಲಾಗುತ್ತದೆ."}',
  '[{"problem":{"en":"Failed the driving test"},"solution":{"en":"You can re-appear for the test after 7 days. Practice in the specific vehicle class you are testing for."},"defer_to_official":false}]',
  'Source: sarathi.parivahan.gov.in — needs human verification.',
  'needs_verification',
  ARRAY['driving licence','driving license','permanent dl','dl karnataka','rto licence','dl new'],
  true
);

-- 7. Driving Licence Renewal
INSERT INTO services (
  slug, name, category, tier, state,
  description, short_description,
  eligibility_rules, questions, required_documents,
  official_fee, steps, official_url, official_url_label,
  what_happens_after, troubleshooting,
  source_notes, verification_status, keywords, active
) VALUES (
  'driving-licence-renewal',
  '{"en":"Driving Licence Renewal","hi":"ड्राइविंग लाइसेंस नवीनीकरण","kn":"ಚಾಲನಾ ಪರವಾನಗಿ ನವೀಕರಣ"}',
  'driving-transport', 1, 'karnataka',
  '{"en":"Renew your expired or soon-to-expire Karnataka Driving Licence. You can apply up to 1 year before expiry.","hi":"अपने समाप्त या जल्द समाप्त होने वाले कर्नाटक ड्राइविंग लाइसेंस को नवीनीकृत करें।","kn":"ಮುಕ್ತಾಯವಾದ ಅಥವಾ ಶೀಘ್ರದಲ್ಲೇ ಮುಕ್ತಾಯವಾಗಲಿರುವ ಚಾಲನಾ ಪರವಾನಗಿ ನವೀಕರಿಸಿ."}',
  '{"en":"Renew your driving licence before or after it expires.","hi":"ड्राइविंग लाइसेंस रिन्यू करें।","kn":"ನಿಮ್ಮ ಚಾಲನಾ ಪರವಾನಗಿ ನವೀಕರಿಸಿ."}',
  '{"all":[{"field":"has_dl","operator":"equals","value":true,"message":"You must have an existing Driving Licence to renew"}]}',
  '[{"id":"has_dl","type":"boolean","label":{"en":"Do you have an existing Driving Licence?","hi":"क्या आपके पास ड्राइविंग लाइसेंस है?","kn":"ನಿಮ್ಮ ಬಳಿ ಚಾಲನಾ ಪರವಾನಗಿ ಇದೆಯೇ?"},"required":true,"eligibility_relevant":true},{"id":"dl_expired","type":"boolean","label":{"en":"Has your Driving Licence already expired?","hi":"क्या आपका ड्राइविंग लाइसेंस पहले से समाप्त हो गया है?","kn":"ನಿಮ್ಮ ಚಾಲನಾ ಪರವಾನಗಿ ಈಗಾಗಲೇ ಮುಕ್ತಾಯವಾಗಿದೆಯೇ?"},"required":true,"eligibility_relevant":false}]',
  '[{"id":"existing_dl","name":{"en":"Original Driving Licence","hi":"मूल ड्राइविंग लाइसेंस","kn":"ಮೂಲ ಚಾಲನಾ ಪರವಾನಗಿ"},"status":"required"},{"id":"address_proof","name":{"en":"Address Proof","hi":"पते का प्रमाण","kn":"ವಿಳಾಸ ಪುರಾವೆ"},"status":"required"},{"id":"photo","name":{"en":"Passport-size photograph","hi":"पासपोर्ट आकार की तस्वीर","kn":"ಪಾಸ್‌ಪೋರ್ಟ್ ಗಾತ್ರದ ಫೋಟೋ"},"status":"required"},{"id":"form1a","name":{"en":"Form 1A — Medical Certificate (if 40+ years)","hi":"फॉर्म 1ए — चिकित्सा प्रमाण पत्र (40+ वर्ष)","kn":"ಫಾರ್ಮ್ 1A — ವೈದ್ಯಕೀಯ ಪ್ರಮಾಣಪತ್ರ (40+ ವರ್ಷ)"},"status":"conditional","required_when":{"field":"age_bracket","operator":"in","value":["51_60","60_plus"]}}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"Renewal fee applies. An additional fine may be charged if the licence has already expired. Check Sarathi for current fees.","hi":"नवीनीकरण शुल्क लागू है। यदि लाइसेंस पहले से समाप्त हो गया है तो अतिरिक्त जुर्माना लग सकता है।","kn":"ನವೀಕರಣ ಶುಲ್ಕ ಅನ್ವಯಿಸುತ್ತದೆ. ಪರವಾನಗಿ ಮುಕ್ತಾಯವಾಗಿದ್ದರೆ ಹೆಚ್ಚುವರಿ ದಂಡ ಇರಬಹುದು."},"varies_by":"dl_expired"}',
  '[{"step_number":1,"title":{"en":"Apply online on Sarathi Parivahan"},"description":{"en":"Visit sarathi.parivahan.gov.in, select Karnataka, choose Renewal of DL."},"is_online":true,"is_offline":false},{"step_number":2,"title":{"en":"Enter your DL number and details"},"description":{"en":"Your existing licence details will be fetched. Verify and confirm."},"is_online":true,"is_offline":false},{"step_number":3,"title":{"en":"Upload documents"},"description":{"en":"Upload address proof, photograph, and medical certificate if applicable."},"is_online":true,"is_offline":false},{"step_number":4,"title":{"en":"Pay the renewal fee"},"description":{"en":"Pay online. If your licence is expired, an additional late fee applies."},"is_online":true,"is_offline":false},{"step_number":5,"title":{"en":"Receive renewed licence"},"description":{"en":"The renewed DL is dispatched to your registered address or can be collected from the RTO."},"is_online":false,"is_offline":true}]',
  'https://sarathi.parivahan.gov.in',
  '{"en":"Sarathi Parivahan — Official Driving Licence Portal","hi":"सारथी परिवहन — आधिकारिक ड्राइविंग लाइसेंस पोर्टल","kn":"ಸಾರಥಿ ಪರಿವಹನ — ಅಧಿಕೃತ ಚಾಲನಾ ಪರವಾನಗಿ ಪೋರ್ಟಲ್"}',
  '{"en":"After submission and payment, your renewed DL is processed. The smart card is dispatched to your address. Track dispatch status on the Sarathi portal.","hi":"सबमिशन और भुगतान के बाद, नवीनीकृत DL प्रोसेस किया जाता है।","kn":"ಸಲ್ಲಿಕೆ ಮತ್ತು ಪಾವತಿಯ ನಂತರ ನವೀಕೃತ DL ಪ್ರಕ್ರಿಯೆಗೊಳ್ಳುತ್ತದೆ."}',
  '[{"problem":{"en":"DL number not found on portal"},"solution":{"en":"Try entering your DL number without spaces or special characters. If still not found, visit your issuing RTO with original documents."},"defer_to_official":false},{"problem":{"en":"Licence expired more than 5 years ago"},"solution":{"en":"For licences expired beyond 5 years, you may need to apply fresh and re-appear for the driving test. Visit your RTO for specific guidance as this is a complex situation."},"defer_to_official":true}]',
  'Source: sarathi.parivahan.gov.in — needs human verification of late fee rules.',
  'needs_verification',
  ARRAY['dl renewal','driving licence renewal','driving license renew','renew dl','licence expired','dl expiry'],
  true
);

-- 8. Voter ID — New Registration
INSERT INTO services (
  slug, name, category, tier, state,
  description, short_description,
  eligibility_rules, questions, required_documents,
  official_fee, steps, official_url, official_url_label,
  what_happens_after, troubleshooting,
  source_notes, verification_status, keywords, active
) VALUES (
  'voter-id-new',
  '{"en":"Voter ID — New Registration","hi":"वोटर आईडी — नया पंजीकरण","kn":"ಮತದಾರ ಗುರುತುಪತ್ರ — ಹೊಸ ನೋಂದಣಿ"}',
  'voting', 1, 'karnataka',
  '{"en":"Register as a new voter and get your Voter ID (EPIC card) in Karnataka. You must be 18 years or older and an Indian citizen.","hi":"कर्नाटक में नए मतदाता के रूप में पंजीकरण करें और अपना वोटर आईडी कार्ड (ईपीआईसी) प्राप्त करें।","kn":"ಕರ್ನಾಟಕದಲ್ಲಿ ಹೊಸ ಮತದಾರರಾಗಿ ನೋಂದಾಯಿಸಿ ಮತ್ತು ಮತದಾರ ಗುರುತುಪತ್ರ ಪಡೆಯಿರಿ."}',
  '{"en":"Register to vote and get your Voter ID card.","hi":"मतदाता के रूप में पंजीकरण करें।","kn":"ಮತದಾರರಾಗಿ ನೋಂದಾಯಿಸಿ."}',
  '{"all":[{"field":"age_bracket","operator":"not_in","value":["under_18"],"message":"You must be 18 years or older to register as a voter"}]}',
  '[{"id":"is_indian_citizen","type":"boolean","label":{"en":"Are you an Indian citizen?","hi":"क्या आप भारतीय नागरिक हैं?","kn":"ನೀವು ಭಾರತೀಯ ನಾಗರಿಕರೇ?"},"required":true,"eligibility_relevant":true},{"id":"is_ordinarily_resident","type":"boolean","label":{"en":"Are you ordinarily resident at your current address in Karnataka?","hi":"क्या आप कर्नाटक में अपने वर्तमान पते पर सामान्यतः निवास करते हैं?","kn":"ನೀವು ಕರ್ನಾಟಕದಲ್ಲಿ ನಿಮ್ಮ ಪ್ರಸ್ತುತ ವಿಳಾಸದಲ್ಲಿ ಸಾಮಾನ್ಯವಾಗಿ ವಾಸಿಸುತ್ತೀರಾ?"},"required":true,"eligibility_relevant":true}]',
  '[{"id":"age_proof","name":{"en":"Age Proof","hi":"आयु प्रमाण","kn":"ವಯಸ್ಸಿನ ಪುರಾವೆ"},"status":"required","description":{"en":"Aadhaar / Birth certificate / Passport / SSLC certificate","hi":"आधार / जन्म प्रमाण पत्र / पासपोर्ट / एसएसएलसी प्रमाण पत्र"}},{"id":"address_proof","name":{"en":"Address Proof","hi":"पते का प्रमाण","kn":"ವಿಳಾಸ ಪುರಾವೆ"},"status":"required"},{"id":"photo","name":{"en":"Recent passport-size photograph","hi":"हाल की पासपोर्ट आकार की तस्वीर","kn":"ಇತ್ತೀಚಿನ ಪಾಸ್‌ಪೋರ್ಟ್ ಗಾತ್ರದ ಫೋಟೋ"},"status":"required"}]',
  '{"amount":0,"currency":"INR","is_free":true,"notes":{"en":"Voter registration and EPIC card are free of charge.","hi":"मतदाता पंजीकरण और ईपीआईसी कार्ड निःशुल्क हैं।","kn":"ಮತದಾರ ನೋಂದಣಿ ಮತ್ತು EPIC ಕಾರ್ಡ್ ಉಚಿತ."},"varies_by":null}',
  '[{"step_number":1,"title":{"en":"Apply on Voter Helpline Portal (voters.eci.gov.in)"},"description":{"en":"Visit voters.eci.gov.in or the Voter Helpline app. Fill Form 6 for new registration."},"is_online":true,"is_offline":false},{"step_number":2,"title":{"en":"Provide personal and address details"},"description":{"en":"Fill your name, address, age, and upload the required documents."},"is_online":true,"is_offline":false},{"step_number":3,"title":{"en":"Submit the application"},"description":{"en":"Submit Form 6. Note your application reference number."},"is_online":true,"is_offline":false},{"step_number":4,"title":{"en":"Verification by Booth Level Officer"},"description":{"en":"A Booth Level Officer (BLO) may visit your address to verify your residence. Cooperate with the verification."},"is_online":false,"is_offline":true},{"step_number":5,"title":{"en":"Receive your EPIC card"},"description":{"en":"If approved, your name is added to the electoral roll and your EPIC (Voter ID) card is issued."},"is_online":false,"is_offline":true}]',
  'https://voters.eci.gov.in',
  '{"en":"Election Commission of India — Voter Portal","hi":"भारत निर्वाचन आयोग — वोटर पोर्टल","kn":"ಭಾರತ ಚುನಾವಣಾ ಆಯೋಗ — ಮತದಾರ ಪೋರ್ಟಲ್"}',
  '{"en":"After submission, a Booth Level Officer verifies your details. Once approved, your name is included in the electoral roll and your EPIC card is issued and dispatched.","hi":"सबमिशन के बाद, बूथ स्तरीय अधिकारी आपके विवरण की जाँच करता है।","kn":"ಸಲ್ಲಿಕೆಯ ನಂತರ, ಬೂತ್ ಮಟ್ಟದ ಅಧಿಕಾರಿ ನಿಮ್ಮ ವಿವರ ಪರಿಶೀಲಿಸುತ್ತಾರೆ."}',
  '[{"problem":{"en":"Name not showing in electoral roll after registration"},"solution":{"en":"Check your application status on voters.eci.gov.in. Electoral rolls are updated at specific intervals. If rejected, you can re-apply."},"defer_to_official":false}]',
  'Source: voters.eci.gov.in — needs human verification.',
  'needs_verification',
  ARRAY['voter id','voter card','epic card','voter registration','form 6','election card','vote','voter'],
  true
);

-- 9. Voter ID — Correction (Form 8)
INSERT INTO services (
  slug, name, category, tier, state,
  description, short_description,
  eligibility_rules, questions, required_documents,
  official_fee, steps, official_url, official_url_label,
  what_happens_after, troubleshooting,
  source_notes, verification_status, keywords, active
) VALUES (
  'voter-id-correction',
  '{"en":"Voter ID — Correction (Form 8)","hi":"वोटर आईडी — सुधार (फॉर्म 8)","kn":"ಮತದಾರ ಗುರುತುಪತ್ರ — ತಿದ್ದುಪಡಿ (ಫಾರ್ಮ್ 8)"}',
  'voting', 1, 'karnataka',
  '{"en":"Correct errors in your existing Voter ID (EPIC) card — name spelling, address, photo, age, or other details.","hi":"अपने मौजूदा वोटर आईडी कार्ड में त्रुटियों को सुधारें।","kn":"ನಿಮ್ಮ ಮತದಾರ ಗುರುತುಪತ್ರದಲ್ಲಿ ತಪ್ಪುಗಳನ್ನು ಸರಿಪಡಿಸಿ."}',
  '{"en":"Fix errors on your Voter ID card using Form 8.","hi":"वोटर आईडी में गलती सुधारें।","kn":"ಮತದಾರ ಕಾರ್ಡ್‌ನ ತಪ್ಪು ಸರಿಪಡಿಸಿ."}',
  '{"all":[{"field":"has_voter_id","operator":"equals","value":true,"message":"You must have an existing Voter ID to request a correction"}]}',
  '[{"id":"has_voter_id","type":"boolean","label":{"en":"Do you have an existing Voter ID card?","hi":"क्या आपके पास वोटर आईडी कार्ड है?","kn":"ನಿಮ್ಮ ಬಳಿ ಮತದಾರ ಗುರುತುಪತ್ರ ಇದೆಯೇ?"},"required":true,"eligibility_relevant":true}]',
  '[{"id":"existing_voter_id","name":{"en":"Existing Voter ID card copy","hi":"मौजूदा वोटर आईडी कार्ड की प्रति","kn":"ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಮತದಾರ ಗುರುತುಪತ್ರ ಪ್ರತಿ"},"status":"required"},{"id":"proof_of_correction","name":{"en":"Document supporting the correction","hi":"सुधार का समर्थन करने वाला दस्तावेज़","kn":"ತಿದ್ದುಪಡಿ ಬೆಂಬಲಿಸುವ ದಾಖಲೆ"},"status":"required","description":{"en":"e.g., Aadhaar showing correct name/DOB, Address proof for address correction","hi":"जैसे सही नाम/जन्म तिथि दिखाने वाला आधार, पते के सुधार के लिए पते का प्रमाण"}}]',
  '{"amount":0,"currency":"INR","is_free":true,"notes":{"en":"Voter ID corrections are free of charge.","hi":"वोटर आईडी सुधार निःशुल्क हैं।","kn":"ಮತದಾರ ಕಾರ್ಡ್ ತಿದ್ದುಪಡಿ ಉಚಿತ."},"varies_by":null}',
  '[{"step_number":1,"title":{"en":"Submit Form 8 on voters.eci.gov.in"},"description":{"en":"Go to voters.eci.gov.in, log in, and fill Form 8 (for corrections to entries in electoral roll)."},"is_online":true,"is_offline":false},{"step_number":2,"title":{"en":"Mention the correction needed"},"description":{"en":"Clearly specify which field needs correction and provide the correct information."},"is_online":true,"is_offline":false},{"step_number":3,"title":{"en":"Upload supporting proof"},"description":{"en":"Upload a document that proves the correct information."},"is_online":true,"is_offline":false},{"step_number":4,"title":{"en":"Submit and track"},"description":{"en":"Submit the form and note your reference number. Track status on the voter portal."},"is_online":true,"is_offline":false}]',
  'https://voters.eci.gov.in',
  '{"en":"Election Commission of India — Voter Portal","hi":"भारत निर्वाचन आयोग — वोटर पोर्टल","kn":"ಭಾರತ ಚುನಾವಣಾ ಆಯೋಗ — ಮತದಾರ ಪೋರ್ಟಲ್"}',
  '{"en":"After submitting Form 8, the electoral registration officer reviews the correction. If approved, your electoral roll entry is corrected and a new EPIC card is issued.","hi":"फॉर्म 8 सबमिट करने के बाद, निर्वाचन पंजीकरण अधिकारी सुधार की समीक्षा करता है।","kn":"ಫಾರ್ಮ್ 8 ಸಲ್ಲಿಸಿದ ನಂತರ, ಚುನಾವಣಾ ನೋಂದಣಿ ಅಧಿಕಾರಿ ತಿದ್ದುಪಡಿ ಪರಿಶೀಲಿಸುತ್ತಾರೆ."}',
  '[{"problem":{"en":"Correction not reflected after long wait"},"solution":{"en":"Check status on voters.eci.gov.in. Electoral roll updates happen periodically. Contact your local Electoral Registration Officer if still unresolved."},"defer_to_official":true}]',
  'Source: voters.eci.gov.in — needs human verification.',
  'needs_verification',
  ARRAY['voter id correction','voter card correction','form 8','voter id error','epic correction','voter name change'],
  true
);

-- 10. Ration Card — New / Modification
INSERT INTO services (
  slug, name, category, tier, state,
  description, short_description,
  eligibility_rules, questions, required_documents,
  official_fee, steps, official_url, official_url_label,
  what_happens_after, troubleshooting,
  source_notes, verification_status, keywords, active
) VALUES (
  'ration-card',
  '{"en":"Ration Card — New Application / Modification","hi":"राशन कार्ड — नया आवेदन / संशोधन","kn":"ಪಡಿತರ ಚೀಟಿ — ಹೊಸ ಅರ್ಜಿ / ಮಾರ್ಪಾಡು"}',
  'ration-food', 1, 'karnataka',
  '{"en":"Apply for a new Ration Card or make modifications (add/remove family members, change address, change category) under the Karnataka Food and Civil Supplies Department.","hi":"कर्नाटक में नए राशन कार्ड के लिए आवेदन करें या संशोधन करें।","kn":"ಕರ್ನಾಟಕ ಆಹಾರ ಮತ್ತು ನಾಗರಿಕ ಸರಬರಾಜು ಇಲಾಖೆ ಅಡಿಯಲ್ಲಿ ಹೊಸ ಪಡಿತರ ಚೀಟಿ ಅಥವಾ ಮಾರ್ಪಾಡಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ."}',
  '{"en":"Get a new ration card or update your existing one.","hi":"नया राशन कार्ड पाएं या मौजूदा अपडेट करें।","kn":"ಹೊಸ ಪಡಿತರ ಚೀಟಿ ಪಡೆಯಿರಿ ಅಥವಾ ಅಸ್ತಿತ್ವದಲ್ಲಿರುವದನ್ನು ನವೀಕರಿಸಿ."}',
  null,
  '[{"id":"request_type","type":"select","label":{"en":"What do you need?","hi":"आपको क्या चाहिए?","kn":"ನಿಮಗೆ ಏನು ಬೇಕು?"},"options":[{"value":"new","label":{"en":"New ration card","hi":"नया राशन कार्ड","kn":"ಹೊಸ ಪಡಿತರ ಚೀಟಿ"}},{"value":"add_member","label":{"en":"Add a family member","hi":"परिवार का सदस्य जोड़ें","kn":"ಕುಟುಂಬ ಸದಸ್ಯ ಸೇರಿಸಿ"}},{"value":"remove_member","label":{"en":"Remove a family member","hi":"परिवार का सदस्य हटाएं","kn":"ಕುಟುಂಬ ಸದಸ್ಯ ತೆಗೆದುಹಾಕಿ"}},{"value":"address_change","label":{"en":"Change address","hi":"पता बदलें","kn":"ವಿಳಾಸ ಬದಲಾಯಿಸಿ"}}],"required":true,"eligibility_relevant":false}]',
  '[{"id":"aadhaar_family","name":{"en":"Aadhaar of head of family and all members","hi":"परिवार के मुखिया और सभी सदस्यों का आधार","kn":"ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥ ಮತ್ತು ಎಲ್ಲ ಸದಸ್ಯರ ಆಧಾರ್"},"status":"required"},{"id":"address_proof","name":{"en":"Address Proof","hi":"पते का प्रमाण","kn":"ವಿಳಾಸ ಪುರಾವೆ"},"status":"required"},{"id":"income_proof","name":{"en":"Income proof (for APL/BPL categorisation)","hi":"आय प्रमाण (एपीएल/बीपीएल वर्गीकरण के लिए)","kn":"ಆದಾಯ ಪ್ರಮಾಣ (APL/BPL ವರ್ಗೀಕರಣಕ್ಕಾಗಿ)"},"status":"conditional"},{"id":"surrender_cert","name":{"en":"Surrender certificate from previous ration card (if migrating from another state/district)","hi":"पिछले राशन कार्ड से सरेंडर प्रमाण पत्र","kn":"ಹಿಂದಿನ ಪಡಿತರ ಚೀಟಿಯ ಸರೆಂಡರ್ ಪ್ರಮಾಣಪತ್ರ"},"status":"conditional"}]',
  '{"amount":null,"currency":"INR","is_free":false,"notes":{"en":"A nominal fee may apply. Check the Karnataka Food Department portal (ahara.kar.nic.in) for current fee.","hi":"एक मामूली शुल्क लागू हो सकता है। कर्नाटक खाद्य विभाग पोर्टल पर जाँचें।","kn":"ಸಾಮಾನ್ಯ ಶುಲ್ಕ ಅನ್ವಯಿಸಬಹುದು. ಕರ್ನಾಟಕ ಆಹಾರ ಇಲಾಖೆ ಪೋರ್ಟಲ್ ಪರಿಶೀಲಿಸಿ."},"varies_by":"request_type"}',
  '[{"step_number":1,"title":{"en":"Visit ahara.kar.nic.in"},"description":{"en":"Go to the Karnataka Food, Civil Supplies and Consumer Affairs portal."},"is_online":true,"is_offline":false},{"step_number":2,"title":{"en":"Select the appropriate application type"},"description":{"en":"Choose new card application or modification based on your need."},"is_online":true,"is_offline":false},{"step_number":3,"title":{"en":"Fill the form and upload documents"},"description":{"en":"Provide household details, upload Aadhaar and address proof for all family members."},"is_online":true,"is_offline":false},{"step_number":4,"title":{"en":"Submit and note reference number"},"description":{"en":"Submit the application. Note the reference number for tracking."},"is_online":true,"is_offline":false},{"step_number":5,"title":{"en":"Verification and card issuance"},"description":{"en":"A field verification may occur. The ration card is issued after approval."},"is_online":false,"is_offline":true}]',
  'https://ahara.kar.nic.in',
  '{"en":"Karnataka Food Department — Ahara Portal","hi":"कर्नाटक खाद्य विभाग — आहार पोर्टल","kn":"ಕರ್ನಾಟಕ ಆಹಾರ ಇಲಾಖೆ — ಆಹಾರ ಪೋರ್ಟಲ್"}',
  '{"en":"After submission, field verification is carried out. On approval, the ration card is issued and can be collected from the designated Food Inspector office or delivered.","hi":"सबमिशन के बाद, क्षेत्र सत्यापन किया जाता है।","kn":"ಸಲ್ಲಿಕೆಯ ನಂತರ, ಕ್ಷೇತ್ರ ಪರಿಶೀಲನೆ ನಡೆಯುತ್ತದೆ."}',
  '[{"problem":{"en":"Application rejected due to duplicate card"},"solution":{"en":"If you or a family member already has a ration card elsewhere, you must surrender the old card first."},"defer_to_official":false}]',
  'Source: ahara.kar.nic.in — needs human verification of current process.',
  'needs_verification',
  ARRAY['ration card','ration','food card','ration card new','ration card update','bpl card','apl card','ahara'],
  true
);

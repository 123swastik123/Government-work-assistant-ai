-- ============================================================
-- Seed: Service Categories
-- ============================================================
INSERT INTO service_categories (name, slug, icon, sort_order, translations) VALUES
('Identity & Documents',   'identity-documents',  'id-card',        1,  '{"en":"Identity & Documents","hi":"पहचान और दस्तावेज़","kn":"ಗುರುತು ಮತ್ತು ದಾಖಲೆಗಳು"}'),
('Driving & Transport',    'driving-transport',   'car',            2,  '{"en":"Driving & Transport","hi":"ड्राइविंग और परिवहन","kn":"ವಾಹನ ಮತ್ತು ಸಾರಿಗೆ"}'),
('Certificates',           'certificates',        'file-check',     3,  '{"en":"Certificates","hi":"प्रमाणपत्र","kn":"ಪ್ರಮಾಣಪತ್ರಗಳು"}'),
('Voting',                 'voting',              'vote',           4,  '{"en":"Voting","hi":"मतदान","kn":"ಮತದಾನ"}'),
('Property & Land',        'property-land',       'home',           5,  '{"en":"Property & Land","hi":"संपत्ति और भूमि","kn":"ಆಸ್ತಿ ಮತ್ತು ಭೂಮಿ"}'),
('Tax & Finance',          'tax-finance',         'landmark',       6,  '{"en":"Tax & Finance","hi":"कर और वित्त","kn":"ತೆರಿಗೆ ಮತ್ತು ಹಣಕಾಸು"}'),
('Employment & Benefits',  'employment-benefits', 'briefcase',      7,  '{"en":"Employment & Benefits","hi":"रोजगार और लाभ","kn":"ಉದ್ಯೋಗ ಮತ್ತು ಸೌಲಭ್ಯಗಳು"}'),
('Family & Marriage',      'family-marriage',     'heart',          8,  '{"en":"Family & Marriage","hi":"परिवार और विवाह","kn":"ಕುಟುಂಬ ಮತ್ತು ಮದುವೆ"}'),
('Police & Verification',  'police-verification', 'shield-check',   9,  '{"en":"Police & Verification","hi":"पुलिस और सत्यापन","kn":"ಪೊಲೀಸ್ ಮತ್ತು ಪರಿಶೀಲನೆ"}'),
('Health & Disability',    'health-disability',   'heart-pulse',    10, '{"en":"Health & Disability","hi":"स्वास्थ्य और विकलांगता","kn":"ಆರೋಗ್ಯ ಮತ್ತು ಅಂಗವೈಕಲ್ಯ"}'),
('Ration & Food Security', 'ration-food',         'shopping-basket',11, '{"en":"Ration & Food Security","hi":"राशन और खाद्य सुरक्षा","kn":"ಪಡಿತರ ಮತ್ತು ಆಹಾರ ಭದ್ರತೆ"}'),
('Agriculture',            'agriculture',         'wheat',          12, '{"en":"Agriculture","hi":"कृषि","kn":"ಕೃಷಿ"}'),
('Other',                  'other',               'more-horizontal',13, '{"en":"Other","hi":"अन्य","kn":"ಇತರೆ"}')
ON CONFLICT (slug) DO NOTHING;

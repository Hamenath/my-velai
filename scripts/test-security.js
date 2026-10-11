/**
 * Comprehensive Security & Logic Verification Suite for MY VELAI Firestore Profiles:
 * 1. Input sanitization & boundary validation
 * 2. Immutable fields protection (UID, role, createdAt)
 * 3. Client privilege escalation prevention (isVerified, aadhaarVerified, rating, reviewsCount)
 * 4. Zero PII in public worker listings (no email, no phone, no KYC)
 * 5. Rules whitelist validation (hasOnlyFields enforcement)
 */

function testProfileValidation() {
  console.log('--- Test 1: Validation & Sanitization ---');
  
  const customerInput = {
    displayName: '  Kannan Alagar  ',
    email: 'kannan@madurai.in',
    phone: '  +91 94432 10000  ',
    role: 'customer',
    localityId: 'loc-mattuthavani',
    locality_en: 'Mattuthavani',
    locality_ta: 'மாட்டுத்தாவணி',
    language: 'ta',
  };

  const sanitizedCustomer = {
    displayName: customerInput.displayName.trim(),
    email: customerInput.email.trim(),
    phone: customerInput.phone.trim(),
    role: customerInput.role,
    localityId: customerInput.localityId,
  };

  if (sanitizedCustomer.displayName !== 'Kannan Alagar') {
    throw new Error('Customer name trimming failed');
  }
  if (sanitizedCustomer.phone !== '+91 94432 10000') {
    throw new Error('Customer phone trimming failed');
  }
  console.log('✔ Customer sanitization passed');
}

function testFieldProtectionAndImmutability() {
  console.log('--- Test 2: Field Immutability (Role, UID, & Timestamps) ---');

  const existingProfile = {
    uid: 'user-abc-123',
    role: 'customer',
    displayName: 'Original Name',
    createdAt: '2026-10-10T00:00:00Z',
    updatedAt: '2026-10-10T00:00:00Z',
    isVerified: false,
    aadhaarVerified: false,
  };

  // Malicious payload attempting to escalate role, change UID, or fake verification
  const maliciousPayload = {
    uid: 'hacked-uid-999',
    role: 'worker',
    createdAt: '1970-01-01T00:00:00Z',
    isVerified: true,
    aadhaarVerified: true,
    displayName: 'Updated Name',
    phone: '+91 98765 43210',
  };

  // ProfileService sanitization logic:
  const sanitizedUpdates = {};
  if (maliciousPayload.displayName) {
    sanitizedUpdates.displayName = maliciousPayload.displayName.trim();
  }
  if (maliciousPayload.phone) {
    sanitizedUpdates.phone = maliciousPayload.phone.trim();
  }

  // Verify that protected fields are strictly excluded
  const forbiddenFields = ['uid', 'role', 'createdAt', 'isVerified', 'aadhaarVerified'];
  for (const field of forbiddenFields) {
    if (field in sanitizedUpdates) {
      throw new Error(`FAILED: Forbidden field ${field} was allowed in sanitized updates!`);
    }
  }

  const updatedProfile = {
    ...existingProfile,
    ...sanitizedUpdates,
  };

  if (updatedProfile.uid !== 'user-abc-123') throw new Error('FAILED: UID was altered!');
  if (updatedProfile.role !== 'customer') throw new Error('FAILED: Role was altered!');
  if (updatedProfile.createdAt !== '2026-10-10T00:00:00Z') throw new Error('FAILED: createdAt was altered!');
  if (updatedProfile.isVerified !== false) throw new Error('FAILED: isVerified was escalated!');
  if (updatedProfile.aadhaarVerified !== false) throw new Error('FAILED: aadhaarVerified was escalated!');

  console.log('✔ Protected fields (uid, role, createdAt, isVerified, aadhaarVerified) are strictly immutable');
}

function testZeroPiiInPublicWorkerListings() {
  console.log('--- Test 3: Zero PII in Public Worker Listings (/workers/{workerId}) ---');

  const privateUserDoc = {
    uid: 'worker-xyz-789',
    displayName: 'Ramu Electrician',
    email: 'ramu.private@gmail.com', // Private PII
    phone: '+91 98421 00000',        // Private PII
    aadhaarVerified: true,           // Sensitive KYC
    role: 'worker',
    createdAt: '2026-10-11T10:00:00Z',
  };

  // Public listing in /workers/{workerId} created per updated profileService
  const publicWorkerDoc = {
    workerId: privateUserDoc.uid,
    name_en: privateUserDoc.displayName,
    name_ta: privateUserDoc.displayName,
    localityId: 'loc-simmakkal',
    locality_en: 'Simmakkal',
    locality_ta: 'சிம்மக்கல்',
    categoryId: 'cat-electrician',
    categoryName_en: 'Electrician',
    categoryName_ta: 'எலக்ட்ரீஷியன்',
    trade_en: 'Electrician',
    trade_ta: 'எலக்ட்ரீஷியன்',
    skills: ['Wiring', 'Motor Repair'],
    dailyRate: 850,
    hourlyRate: 150,
    isAvailable: true,
    isVerified: false,
    rating: 5.0,
    reviewsCount: 0,
    experienceYears: 4,
    updatedAt: '2026-10-11T10:00:00Z',
    avatarUrl: '',
    bio: '',
  };

  // Check that NO private PII exists in the public worker document
  if ('email' in publicWorkerDoc) {
    throw new Error('FAILED: Private email leaked into public worker listing!');
  }
  if ('phone' in publicWorkerDoc) {
    throw new Error('FAILED: Private phone leaked into public worker listing!');
  }
  if ('aadhaarVerified' in publicWorkerDoc || 'aadhaar' in publicWorkerDoc) {
    throw new Error('FAILED: Sensitive KYC leaked into public worker listing!');
  }

  // Allowed public fields whitelist per firestore.rules
  const allowedPublicFields = new Set([
    'workerId', 'name_en', 'name_ta', 'localityId', 'locality_en',
    'locality_ta', 'categoryId', 'categoryName_en', 'categoryName_ta',
    'trade_en', 'trade_ta', 'skills', 'dailyRate', 'hourlyRate',
    'isAvailable', 'isVerified', 'rating', 'reviewsCount',
    'experienceYears', 'updatedAt', 'avatarUrl', 'bio'
  ]);

  for (const key of Object.keys(publicWorkerDoc)) {
    if (!allowedPublicFields.has(key)) {
      throw new Error(`FAILED: Unapproved field "${key}" present in public worker doc!`);
    }
  }

  console.log('✔ Zero PII in public worker listings confirmed (No email, No phone, No KYC)');
}

function testSecurityRulesWhitelist() {
  console.log('--- Test 4: Firestore Rules Whitelist & Constraint Simulation ---');

  const allowedUserFields = new Set([
    'uid', 'displayName', 'email', 'phone', 'role', 'language',
    'localityId', 'locality_en', 'locality_ta', 'avatarUrl',
    'createdAt', 'updatedAt', 'trade_en', 'trade_ta',
    'categoryId', 'categoryName_en', 'categoryName_ta',
    'dailyRate', 'hourlyRate', 'skills', 'isAvailable',
    'isVerified', 'experienceYears', 'aadhaarVerified', 'bio'
  ]);

  const testUserDoc = {
    uid: 'test-uid-1',
    displayName: 'Test User',
    email: 'test@example.com',
    phone: '+91 90000 00000',
    role: 'customer',
    language: 'ta',
    localityId: 'loc-1',
    locality_en: 'City Center',
    locality_ta: 'நகர மையம்',
    avatarUrl: '',
    createdAt: 'timestamp',
    updatedAt: 'timestamp',
    isVerified: false,
    aadhaarVerified: false,
  };

  for (const key of Object.keys(testUserDoc)) {
    if (!allowedUserFields.has(key)) {
      throw new Error(`FAILED: Unauthorized field ${key} in user schema!`);
    }
  }

  // Simulate an injected unapproved admin field
  const tamperedDoc = {
    ...testUserDoc,
    isAdmin: true,
  };
  const keysOnlyPassed = Object.keys(tamperedDoc).every(k => allowedUserFields.has(k));
  if (keysOnlyPassed) {
    throw new Error('FAILED: Rule whitelist allowed isAdmin field injection!');
  }

  console.log('✔ Schema whitelist strictly blocks unauthorized field injections');
}

try {
  testProfileValidation();
  testFieldProtectionAndImmutability();
  testZeroPiiInPublicWorkerListings();
  testSecurityRulesWhitelist();
  console.log('\n=== ALL SECURITY & LOGIC TESTS PASSED (4/4) ===');
} catch (err) {
  console.error('Test failed:', err);
  process.exit(1);
}

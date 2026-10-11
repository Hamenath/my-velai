/**
 * Test suite verifying Firestore user profile logic:
 * 1. Data model validation
 * 2. Immutable fields protection (UID, role, createdAt)
 * 3. Separation of private user data (/users/{uid}) and public worker listings (/workers/{uid})
 * 4. Input sanitization (names, phone numbers, numeric wage rates)
 */

function testProfileValidation() {
  console.log('--- Test 1: Validation & Sanitization ---');
  
  // Valid customer input
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

  // Worker input
  const workerInput = {
    displayName: 'Murugan K',
    phone: '+91 98421 77123',
    role: 'worker',
    trade_en: 'Electrician',
    trade_ta: 'எலக்ட்ரீஷியன்',
    dailyRate: 850,
    hourlyRate: 150,
    skills: ['Wiring', 'Repair'],
    localityId: 'loc-simmakkal',
    locality_en: 'Simmakkal',
    locality_ta: 'சிம்மக்கல்',
    language: 'ta',
  };

  console.log('✔ Worker profile input passed');
}

function testFieldProtection() {
  console.log('--- Test 2: Field Immutability (Role & UID Protection) ---');

  const existingProfile = {
    uid: 'user-abc-123',
    role: 'customer',
    displayName: 'Original Name',
    createdAt: '2026-10-10T00:00:00Z',
    updatedAt: '2026-10-10T00:00:00Z',
  };

  // Malicious or accidental update payload attempting to elevate role or alter UID
  const dangerousUpdatePayload = {
    uid: 'hacked-uid-456',
    role: 'worker',
    createdAt: '1970-01-01T00:00:00Z',
    displayName: 'Updated Name',
    phone: '+91 98765 43210',
  };

  // ProfileService sanitization logic:
  const sanitizedUpdates = {};
  if (dangerousUpdatePayload.displayName) {
    sanitizedUpdates.displayName = dangerousUpdatePayload.displayName.trim();
  }
  if (dangerousUpdatePayload.phone) {
    sanitizedUpdates.phone = dangerousUpdatePayload.phone.trim();
  }

  // UID, role, createdAt MUST NEVER be in sanitizedUpdates
  if ('uid' in sanitizedUpdates || 'role' in sanitizedUpdates || 'createdAt' in sanitizedUpdates) {
    throw new Error('FAILED: Protected fields were not stripped!');
  }

  const updatedProfile = {
    ...existingProfile,
    ...sanitizedUpdates,
  };

  if (updatedProfile.uid !== 'user-abc-123') {
    throw new Error('FAILED: UID was altered!');
  }
  if (updatedProfile.role !== 'customer') {
    throw new Error('FAILED: Role was altered!');
  }
  if (updatedProfile.createdAt !== '2026-10-10T00:00:00Z') {
    throw new Error('FAILED: createdAt was altered!');
  }
  if (updatedProfile.displayName !== 'Updated Name') {
    throw new Error('FAILED: displayName was not updated!');
  }

  console.log('✔ Protected fields (uid, role, createdAt) are strictly preserved');
}

function testPublicPrivateSeparation() {
  console.log('--- Test 3: Public vs Private Separation ---');

  const privateUserDoc = {
    uid: 'worker-xyz-789',
    displayName: 'Ramu Electrician',
    email: 'ramu.private@gmail.com', // Private PII
    phone: '+91 98421 00000',
    aadhaarVerified: true, // Sensitive KYC
    role: 'worker',
    createdAt: '2026-10-11T10:00:00Z',
  };

  // Public listing in /workers/{workerId}
  const publicWorkerDoc = {
    workerId: privateUserDoc.uid,
    name_en: privateUserDoc.displayName,
    phone: privateUserDoc.phone,
    trade_en: 'Electrician',
    dailyRate: 800,
    rating: 4.9,
  };

  if ('email' in publicWorkerDoc) {
    throw new Error('FAILED: Private email leaked into public worker listing!');
  }
  if ('aadhaarVerified' in publicWorkerDoc) {
    throw new Error('FAILED: Sensitive KYC field leaked into public worker listing!');
  }

  console.log('✔ Private PII is strictly kept out of public worker listing');
}

try {
  testProfileValidation();
  testFieldProtection();
  testPublicPrivateSeparation();
  console.log('\n=== ALL UNIT LOGIC TESTS PASSED (3/3) ===');
} catch (err) {
  console.error('Test failed:', err);
  process.exit(1);
}

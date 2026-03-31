// 🔧 DAYFLOW DEBUG SCRIPT
// Paste this entire code into Browser Console (F12) and press Enter

console.log('');
console.log('═══════════════════════════════════════');
console.log('       DayFlow Debug Test');
console.log('═══════════════════════════════════════');
console.log('');

// Test 1: Check if Supabase is loaded
console.log('1️⃣  Checking Supabase...');
console.log('   window.supabase exists?', !!window.supabase);
console.log('   supabase client created?', !!supabase);
console.log('');

// Test 2: Check Environment
console.log('2️⃣  Checking Environment...');
console.log('   window.ENV exists?', !!window.ENV);
console.log('   SUPABASE_URL:', window.ENV?.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('   SUPABASE_ANON_KEY:', window.ENV?.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
console.log('');

// Test 3: Check Auth Functions
console.log('3️⃣  Checking Auth Functions...');
console.log('   handleSignUp exists?', typeof handleSignUp === 'function' ? '✅ Yes' : '❌ NO');
console.log('   handleSignIn exists?', typeof handleSignIn === 'function' ? '✅ Yes' : '❌ NO');
console.log('   switchAuthTab exists?', typeof switchAuthTab === 'function' ? '✅ Yes' : '❌ NO');
console.log('   showAuthError exists?', typeof showAuthError === 'function' ? '✅ Yes' : '❌ NO');
console.log('');

// Test 4: Check DOM Elements
console.log('4️⃣  Checking DOM Elements...');
console.log('   authContainer:', document.getElementById('authContainer') ? '✅ Found' : '❌ Missing');
console.log('   signupForm:', document.getElementById('signupForm') ? '✅ Found' : '❌ Missing');
console.log('   signupEmail:', document.getElementById('signupEmail') ? '✅ Found' : '❌ Missing');
console.log('   signupPassword:', document.getElementById('signupPassword') ? '✅ Found' : '❌ Missing');
console.log('   signupConfirm:', document.getElementById('signupConfirm') ? '✅ Found' : '❌ Missing');
console.log('   authError:', document.getElementById('authError') ? '✅ Found' : '❌ Missing');
console.log('');

// Test 5: Manually test signup
console.log('5️⃣  Testing Manual Form Fill...');
document.getElementById('signupEmail').value = 'test@example.com';
document.getElementById('signupPassword').value = 'TestPass123';
document.getElementById('signupConfirm').value = 'TestPass123';
console.log('   ✅ Form filled with test data');
console.log('   Email:', document.getElementById('signupEmail').value);
console.log('   Password:', document.getElementById('signupPassword').value);
console.log('   Confirm:', document.getElementById('signupConfirm').value);
console.log('');

// Test 6: Test Auth Tab Switching
console.log('6️⃣  Testing Tab Switch...');
console.log('   Current signup form display:', window.getComputedStyle(document.getElementById('signupForm')).display);
console.log('   Attempting to show signup tab...');
document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
document.querySelectorAll('.auth-tab')[1].classList.add('active');
document.getElementById('signupForm').classList.add('active');
console.log('   ✅ Signup tab should now be visible');
console.log('');

// Test 7: Summary
console.log('═══════════════════════════════════════');
console.log('          DIAGNOSTIC SUMMARY');
console.log('═══════════════════════════════════════');
const allGood =
  !!supabase &&
  !!window.ENV?.VITE_SUPABASE_URL &&
  typeof handleSignUp === 'function' &&
  !!document.getElementById('signupForm');

console.log(allGood ? '✅ ALL SYSTEMS GO!' : '❌ ISSUES DETECTED - See above');
console.log('');
console.log('Next: Click the Sign Up button and watch console for messages');
console.log('');

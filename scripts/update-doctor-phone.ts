import 'dotenv/config';
import { db } from '../src/config/db';
import { realDoctorsTable } from '../src/models/schema';

async function updatePhoneNumber() {
  const newPhoneNumber = '0793198026';
  
  console.log('Updating doctor phone numbers to:', newPhoneNumber);
  
  try {
    // Update all doctors with the new phone number
    const result = await db.update(realDoctorsTable)
      .set({ phoneNumber: newPhoneNumber })
      .returning();
    
    console.log(`✓ Successfully updated ${result.length} doctors`);
    result.forEach(doc => {
      console.log(`  - ${doc.specialist}: ${doc.phoneNumber}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating phone numbers:', error);
    process.exit(1);
  }
}

updatePhoneNumber();


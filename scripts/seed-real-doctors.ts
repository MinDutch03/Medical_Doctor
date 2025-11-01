import 'dotenv/config';
import { db } from '../src/config/db';
import { realDoctorsTable } from '../src/models/schema';
import { AIDoctorAgents } from '../src/constants/doctorAgents';

async function seedRealDoctors() {
  console.log('Starting to seed real doctors...');
  
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL not found in .env file');
    console.log('Please create a .env file and add:');
    console.log('DATABASE_URL=your_database_connection_string');
    process.exit(1);
  }
  
  // Read phone number from environment variable
  const demoPhoneNumber = process.env.DOCTOR_PHONE_NUMBER || '0972219870';
  
  if (!process.env.DOCTOR_PHONE_NUMBER) {
    console.warn('⚠️  WARNING: DOCTOR_PHONE_NUMBER not found in .env file, using default number');
  }
  
  console.log(`Using phone number: ${demoPhoneNumber}`);
  
  try {
    // Insert real doctors for each doctor agent
    for (const agent of AIDoctorAgents) {
      await db.insert(realDoctorsTable).values({
        doctorAgentId: agent.id,
        name: `Dr. ${agent.specialist}`,
        specialist: agent.specialist,
        phoneNumber: demoPhoneNumber,
        email: `dr.${agent.specialist.toLowerCase().replace(/\s+/g, '')}@medical.com`
      });
      console.log(`✓ Created real doctor for ${agent.specialist}`);
    }
    
    console.log('Successfully seeded all real doctors!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding real doctors:', error);
    process.exit(1);
  }
}

// Run the seed function
seedRealDoctors();


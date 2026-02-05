import dotenv from 'dotenv';
import { connectDatabase } from './infrastructure/database/config';
import { MongoUserRepository } from './infrastructure/database/repositories/MongoUserRepository';
import { PasswordService } from './shared/services/PasswordService';

dotenv.config();

const KEEPER_EMAIL = 'keeper@masks.coc';
const KEEPER_USERNAME = 'Keeper';
const KEEPER_PASSWORD = 'nyarlathotep1925';

async function seedKeeper() {
  try {
    await connectDatabase();
    console.log('🔌 Connected to database');

    const userRepository = new MongoUserRepository();

    // Check if keeper already exists
    const existingKeeper = await userRepository.findByEmail(KEEPER_EMAIL);
    if (existingKeeper) {
      console.log('✅ Keeper user already exists:', existingKeeper.email);
      process.exit(0);
    }

    // Create keeper user
    const passwordHash = await PasswordService.hash(KEEPER_PASSWORD);
    const keeper = await userRepository.create({
      username: KEEPER_USERNAME,
      email: KEEPER_EMAIL,
      passwordHash,
      role: 'keeper',
    });

    console.log('🎭 Keeper user created successfully!');
    console.log('   Email:', keeper.email);
    console.log('   Username:', keeper.username);
    console.log('   Password:', KEEPER_PASSWORD);
    console.log('');
    console.log('⚠️  Change your password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding keeper:', error);
    process.exit(1);
  }
}

seedKeeper();

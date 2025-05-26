const mongoose = require('mongoose');

async function testDatabase() {
  try {
    // Conectar ao MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/masks-coc';
    console.log('🔌 Connecting to MongoDB:', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Listar todas as coleções
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Collections in database:', collections.map(c => c.name));
    
    // Verificar a coleção sessions
    const sessionsCollection = mongoose.connection.db.collection('sessions');
    const sessionCount = await sessionsCollection.countDocuments();
    console.log('📊 Total sessions in collection:', sessionCount);
    
    if (sessionCount > 0) {
      const sessions = await sessionsCollection.find({}).toArray();
      console.log('📝 Sessions found:');
      sessions.forEach((session, index) => {
        console.log(`  ${index + 1}. ${session.title} (ID: ${session._id})`);
      });
    }
    
    // Fechar conexão
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testDatabase(); 
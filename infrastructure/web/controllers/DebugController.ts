import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { SessionModel } from '../../database/models/SessionModel';

export class DebugController {
  async getDatabaseInfo(req: Request, res: Response): Promise<Response> {
    try {
      console.log('🔍 Debug: Getting database info');
      
      // Informações da conexão
      const connectionState = mongoose.connection.readyState;
      const dbName = mongoose.connection.db?.databaseName;
      
      console.log('📊 Connection state:', connectionState);
      console.log('🗄️ Database name:', dbName);
      
      // Listar coleções
      const collections = await mongoose.connection.db?.listCollections().toArray();
      const collectionNames = collections?.map(c => c.name) || [];
      
      console.log('📋 Collections:', collectionNames);
      
      // Contar documentos na coleção sessions
      const sessionCount = await SessionModel.countDocuments();
      console.log('📊 Session count:', sessionCount);
      
      // Buscar algumas sessões diretamente
      const sessions = await SessionModel.find().limit(5);
      console.log('📝 Sample sessions:', sessions.map(s => ({ id: s.id, title: s.title })));
      
      // Verificar índices
      const indexes = await SessionModel.collection.getIndexes();
      console.log('🔍 Indexes:', Object.keys(indexes));
      
      return res.status(200).json({
        connectionState,
        dbName,
        collections: collectionNames,
        sessionCount,
        sampleSessions: sessions.map(s => ({ id: s.id, title: s.title, date: s.date })),
        indexes: Object.keys(indexes)
      });
    } catch (error) {
      console.error('❌ Debug error:', error);
      return res.status(500).json({ 
        error: 'Debug failed', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
} 
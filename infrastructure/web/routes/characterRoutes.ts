import { Router } from 'express';
import { CharacterController } from '../controllers/CharacterController';
import { 
  GetAllCharactersUseCase, 
  GetCharacterByIdUseCase,
  CreateCharacterUseCase,
  UpdateCharacterUseCase,
  DeleteCharacterUseCase
} from '../../../application/useCases/character';
import { MongoCharacterRepository } from '../../database/repositories/MongoCharacterRepository';

const router = Router();
const characterRepository = new MongoCharacterRepository();

const getAllCharactersUseCase = new GetAllCharactersUseCase(characterRepository);
const getCharacterByIdUseCase = new GetCharacterByIdUseCase(characterRepository);
const createCharacterUseCase = new CreateCharacterUseCase(characterRepository);
const updateCharacterUseCase = new UpdateCharacterUseCase(characterRepository);
const deleteCharacterUseCase = new DeleteCharacterUseCase(characterRepository);

const characterController = new CharacterController(
  getAllCharactersUseCase,
  getCharacterByIdUseCase,
  createCharacterUseCase,
  updateCharacterUseCase,
  deleteCharacterUseCase
);

router.get('/', async (req, res) => {
  await characterController.getAllCharacters(req, res);
});

router.get('/:id', async (req, res) => {
  await characterController.getCharacterById(req, res);
});

router.post('/', async (req, res) => {
  await characterController.createCharacter(req, res);
});

router.put('/:id', async (req, res) => {
  await characterController.updateCharacter(req, res);
});

router.delete('/:id', async (req, res) => {
  await characterController.deleteCharacter(req, res);
});

export { router as characterRoutes };
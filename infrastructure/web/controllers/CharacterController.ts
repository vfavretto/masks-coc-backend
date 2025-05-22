import { Request, Response } from "express";
import {
  GetAllCharactersUseCase,
  GetCharacterByIdUseCase,
  CreateCharacterUseCase,
  UpdateCharacterUseCase,
  DeleteCharacterUseCase,
} from "../../../application/useCases/character";
import {
  validateCreateCharacter,
  validateUpdateCharacter,
} from "../validators/characterValidator";
import { ApplicationError } from "../../../shared/errors/ApplicationError";

export class CharacterController {
  constructor(
    private readonly getAllCharactersUseCase: GetAllCharactersUseCase,
    private readonly getCharacterByIdUseCase: GetCharacterByIdUseCase,
    private readonly createCharacterUseCase: CreateCharacterUseCase,
    private readonly updateCharacterUseCase: UpdateCharacterUseCase,
    private readonly deleteCharacterUseCase: DeleteCharacterUseCase
  ) {}

  async getAllCharacters(req: Request, res: Response): Promise<Response> {
    try {
      const characters = await this.getAllCharactersUseCase.execute();
      return res.status(200).json({ characters });
    } catch (error) {
      console.error("Error fetching characters:", error);
      return res.status(500).json({ message: "Error fetching characters" });
    }
  }

  async getCharacterById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const character = await this.getCharacterByIdUseCase.execute(id);
      return res.status(200).json(character);
    } catch (error) {
      if (error instanceof ApplicationError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Error fetching character by ID:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async createCharacter(req: Request, res: Response): Promise<Response> {
    try {
      const characterData = req.body;
      const { error, value } = validateCreateCharacter(characterData);

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      const character = await this.createCharacterUseCase.execute(value);
      return res.status(201).json(character);
    } catch (error) {
      console.error("Error creating character:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateCharacter(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const characterData = req.body;

      const { error, value } = validateUpdateCharacter(characterData);

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      const character = await this.updateCharacterUseCase.execute(id, value);
      return res.status(200).json(character);
    } catch (error) {
      if (error instanceof ApplicationError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Error updating character:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteCharacter(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.deleteCharacterUseCase.execute(id);
      return res.status(204).send();
    } catch (error) {
      if (error instanceof ApplicationError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Error deleting character:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

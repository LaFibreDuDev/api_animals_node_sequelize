import { Controller, Get, Route, Tags } from "tsoa";
import { Animal } from "../models";

export interface AnimalResponse {
    id: number;
    name: string;
    species: string;
    age: number;
}

@Route("animals")
@Tags("Animals")
export class AnimalController extends Controller {
    @Get()
    public async getAll(): Promise<AnimalResponse[]> {
        const animals = await Animal.findAll();
        return animals as unknown as AnimalResponse[];
    }
}

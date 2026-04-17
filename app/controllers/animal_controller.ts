import { Body, Controller, Get, Post, Route, SuccessResponse, Tags } from "tsoa";
import { Animal } from "../models";

export interface AnimalResponse {
    id: number;
    name: string;
    species: string;
    age: number;
}

export interface AnimalCreationParams {
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

    @Post()
    @SuccessResponse(201, "Created")
    public async create(@Body() body: AnimalCreationParams): Promise<AnimalResponse> {
        const animal = await Animal.create(body as unknown as Record<string, unknown>);
        this.setStatus(201);
        return animal as unknown as AnimalResponse;
    }
}

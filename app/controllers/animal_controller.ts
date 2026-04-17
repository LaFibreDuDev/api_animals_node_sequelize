import { Body, Controller, Get, Path, Post, Put, Route, SuccessResponse, Tags } from "tsoa";
import { ApiError } from "../errors";
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

export interface AnimalUpdateParams {
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

    @Put("{id}")
    public async update(@Path() id: number, @Body() body: AnimalUpdateParams): Promise<AnimalResponse> {
        const animal = await Animal.findByPk(id);
        if (!animal) {
            throw new ApiError(404, "Animal not found");
        }
        await animal.update(body as unknown as Record<string, unknown>);
        return animal as unknown as AnimalResponse;
    }
}

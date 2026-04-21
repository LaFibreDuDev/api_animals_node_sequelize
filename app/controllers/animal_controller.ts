import { Body, Controller, Delete, Get, Path, Post, Put, Response, Route, SuccessResponse, Tags } from "tsoa";
import { ApiError } from "../errors";
import { Animal } from "../models";

export interface AnimalResponse {
    id: number;
    name: string;
    species: string;
    age: number;
    categoryId: number | null;
}

export interface AnimalCreationParams {
    name: string;
    species: string;
    age: number;
    categoryId?: number;
}

export interface AnimalUpdateParams {
    name: string;
    species: string;
    age: number;
    categoryId?: number;
}

interface ErrorResponse {
    message: string;
}

@Route("animals")
@Tags("Animals")
export class AnimalController extends Controller {
    @Get()
    @Response<ErrorResponse>(500, "Internal server error")
    public async getAll(): Promise<AnimalResponse[]> {
        const animals = await Animal.findAll();
        //TEST => permettant de vérifier l'exécution de la CI/CD pour voir un test échoué... 
        return [] as AnimalResponse[];
        //return animals as unknown as AnimalResponse[];
    }

    @Post()
    @SuccessResponse(201, "Created")
    @Response<ErrorResponse>(422, "Validation failed")
    @Response<ErrorResponse>(500, "Internal server error")
    public async create(@Body() body: AnimalCreationParams): Promise<AnimalResponse> {
        const animal = await Animal.create(body as unknown as Record<string, unknown>);
        this.setStatus(201);
        return animal as unknown as AnimalResponse;
    }

    @Put("{id}")
    @Response<ErrorResponse>(404, "Animal not found")
    @Response<ErrorResponse>(422, "Validation failed")
    @Response<ErrorResponse>(500, "Internal server error")
    public async update(@Path() id: number, @Body() body: AnimalUpdateParams): Promise<AnimalResponse> {
        const animal = await Animal.findByPk(id);
        if (!animal) {
            throw new ApiError(404, "Animal not found");
        }
        await animal.update(body as unknown as Record<string, unknown>);
        return animal as unknown as AnimalResponse;
    }

    @Delete("{id}")
    @SuccessResponse(204, "Deleted")
    @Response<ErrorResponse>(404, "Animal not found")
    @Response<ErrorResponse>(500, "Internal server error")
    public async remove(@Path() id: number): Promise<void> {
        const animal = await Animal.findByPk(id);
        if (!animal) {
            throw new ApiError(404, "Animal not found");
        }
        await animal.destroy();
        this.setStatus(204);
    }
}

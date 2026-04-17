import { Controller, Get, Route } from "tsoa";

@Route("/")
export class MainController extends Controller {
    @Get()
    public async index(): Promise<string> {
        return "Hello, World!";
    }

    @Get("health")
    public async health(): Promise<string> {
        return "OK";
    }
}

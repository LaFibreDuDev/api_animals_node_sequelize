import { Request, Response } from "express";

const mainController = {
    index: (req: Request, res: Response) => {
        res.send('Hello, World!');
    }
};

export default mainController;